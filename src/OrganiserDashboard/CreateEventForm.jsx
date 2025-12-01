

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateEventForm.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
const CreateEventForm = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    location: '',
    categoryID: '',
    totalSeats: '',
    pricePerTicket: '',
    eventDate: '',
    eventTime: '',
    endTime: '',
    imagePath: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
 
  useEffect(() => {
    // Fetch categories on component mount
    axios.get('https://localhost:7283/api/Categories')
      .then(res => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"));
  }, []);
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };
 
  const validateFields = () => {
    const errors = {};
    // Current time in IST (Friday, November 7, 2025 at 6:09:45 PM)
    const now = new Date(); 
    // Helper function for required checks
    const isRequired = (value) => !value || (typeof value === 'string' && !value.trim());
 
    // --- 1. Check for Required Fields (All except imagePath and description) ---
    if (isRequired(formData.eventName)) errors.eventName = "Event name is required.";
    if (isRequired(formData.location)) errors.location = "Location is required.";
    if (isRequired(formData.categoryID)) errors.categoryID = "Category is required.";
    if (isRequired(formData.totalSeats) || parseInt(formData.totalSeats) <= 0) {
        errors.totalSeats = "Total seats must be greater than 0.";
    }
    if (isRequired(formData.pricePerTicket) || parseFloat(formData.pricePerTicket) <= 0) {
        errors.pricePerTicket = "Price must be greater than 0.";
    }
    if (isRequired(formData.eventDate)) errors.eventDate = "Event date is required.";
    if (isRequired(formData.eventTime)) errors.eventTime = "Start time is required.";
    if (isRequired(formData.endTime)) errors.endTime = "End time is required.";
    // Check Date and Time Constraints only if required fields are present
    if (formData.eventDate && formData.eventTime && formData.endTime) {
        const selectedDate = new Date(formData.eventDate);
        const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}:00`);
        // 2. Event Date must be today or next days (not before today)
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (selectedDate < today) {
            errors.eventDate = "Event date must be today or a future date.";
        }
 
        // Check time only if date is today and no previous date errors
        if (!errors.eventDate && selectedDate.toDateString() === today.toDateString()) {
            // 3. Start time must be at least 1 hour from now
            const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); 
            if (eventDateTime < oneHourFromNow) {
                errors.eventTime = `Start time must be at least 1 hour from the current time (${oneHourFromNow.toLocaleTimeString()}).`;
            }
        }
        // REMOVED: End Time validation (endDateTime <= eventDateTime) as requested.
    }
 
    return errors;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const clientErrors = validateFields();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      toast.error("Please correct the highlighted errors before creating the event.");
      return;
    }
 
    // Format time to "HH:mm:ss" for C# TimeOnly binding
    const eventTimeFormatted = formData.eventTime ? `${formData.eventTime}:00` : '';
    const endTimeFormatted = formData.endTime ? `${formData.endTime}:00` : '';
 
    // Payload structure must match C# Event model property names (PascalCase)
    const payload = {
      EventName: formData.eventName,
      Description: formData.description,
      Location: formData.location,
      CategoryID: parseInt(formData.categoryID),
      TotalSeats: parseInt(formData.totalSeats),
      PricePerTicket: parseFloat(formData.pricePerTicket),
      EventDate: formData.eventDate,
      EventTime: eventTimeFormatted,
      EndTime: endTimeFormatted,
      ImagePath: formData.imagePath
    };
    try {
      const response = await axios.post('https://localhost:7283/api/Events', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
 
      if (response.status === 200 || response.status === 201) {
        toast.success("Event created successfully!");
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        toast.error("❌ Failed to create event");
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = err.response?.data?.error;
      const mappedErrors = {};
 
      if (errors) {
        // Map ASP.NET Core ModelState errors (e.g., "EventName") to form keys (e.g., "eventName")
        Object.entries(errors).forEach(([field, messages]) => {
          const formField = field.charAt(0).toLowerCase() + field.slice(1);
          mappedErrors[formField] = messages[0];
        });
      }
 
      // Check for specific EventAlreadyExistsException message (Requirement 4)
      if (message && message.includes("already exists")) {
        mappedErrors.eventName = `Event with '${formData.eventName}' already exists, try another name.`;
      } else if (message) {
        toast.error(`❌ Backend Error: ${message}`);
      }
 
      setFieldErrors(mappedErrors);
    }
  };
 
  const handleReset = () => {
    setFormData({
      eventName: '',
      description: '',
      location: '',
      categoryID: '',
      totalSeats: '',
      pricePerTicket: '',
      eventDate: '',
      eventTime: '',
      endTime: '',
      imagePath: ''
    });
    setFieldErrors({});
  };
 
  // Function to apply error class conditionally
  const getErrorClass = (fieldName) => fieldErrors[fieldName] ? 'error' : '';
 
  return (
<div className="form-container">
<ToastContainer position="top-right" autoClose={3000} />
<button className="back-button" onClick={() => navigate(-1)}>← Back</button>
<h2 className="form-title">Create Your Event</h2>
<form className="event-form" onSubmit={handleSubmit}>
<input name="eventName" value={formData.eventName} onChange={handleChange} placeholder="Event Name" className={getErrorClass('eventName')} />
        {fieldErrors.eventName && <span className="error-text">{fieldErrors.eventName}</span>}
 
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className={getErrorClass('location')} />
        {fieldErrors.location && <span className="error-text">{fieldErrors.location}</span>}
 
        <select name="categoryID" value={formData.categoryID} onChange={handleChange} className={getErrorClass('categoryID')}>
<option value="">Select Category</option>
          {categories.map(cat => (
<option key={cat.categoryID} value={cat.categoryID}>{cat.categoryName}</option>
          ))}
</select>
        {fieldErrors.categoryID && <span className="error-text">{fieldErrors.categoryID}</span>}
 
        <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} placeholder="Total Seats" className={getErrorClass('totalSeats')} />
        {fieldErrors.totalSeats && <span className="error-text">{fieldErrors.totalSeats}</span>}
 
        <input type="number" name="pricePerTicket" value={formData.pricePerTicket} onChange={handleChange} placeholder="Price Per Ticket" className={getErrorClass('pricePerTicket')} />
        {fieldErrors.pricePerTicket && <span className="error-text">{fieldErrors.pricePerTicket}</span>}
 
        <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className={getErrorClass('eventDate')} />
        {fieldErrors.eventDate && <span className="error-text">{fieldErrors.eventDate}</span>}
 
        <input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} className={getErrorClass('eventTime')} />
        {fieldErrors.eventTime && <span className="error-text">{fieldErrors.eventTime}</span>}
 
        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className={getErrorClass('endTime')} />
        {fieldErrors.endTime && <span className="error-text">{fieldErrors.endTime}</span>}
 
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description (Optional)"></textarea>
        {fieldErrors.description && <span className="error-text">{fieldErrors.description}</span>}
 
        <input type="text" name="imagePath" value={formData.imagePath} onChange={handleChange} placeholder="Enter image URL (Optional)" />
        {fieldErrors.imagePath && <span className="error-text">{fieldErrors.imagePath}</span>}
 
        <div className="form-actions">
<button type="submit" className="submit-btn">Create Event</button>
<button type="button" className="reset-btn" onClick={handleReset}>Reset</button>
</div>
</form>
</div>
  );
};
 
export default CreateEventForm;