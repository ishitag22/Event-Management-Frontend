import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UpdateEventPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
const UpdateEventPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event; 
  const [formData, setFormData] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
 
  useEffect(() => {
    if (event) setFormData({ ...event });
  }, [event]);
 
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };
 
  const validateFields = () => {
    const errors = {};
    const now = new Date();
    // Helper function for required checks
    const isRequired = (value) => !value || (typeof value === 'string' && !value.trim());
 
    // Check for Required Fields (All except imagePath and description)
    if (isRequired(formData.eventName)) errors.eventName = "Event name is required.";
    if (isRequired(formData.location)) errors.location = "Location is required.";
    if (isRequired(formData.totalSeats) || parseInt(formData.totalSeats) <= 0) {
        errors.totalSeats = "Total seats must be greater than 0.";
    }
    if (isRequired(formData.pricePerTicket) || parseFloat(formData.pricePerTicket) <= 0) {
        errors.pricePerTicket = "Price must be greater than 0.";
    }
    if (isRequired(formData.eventDate)) errors.eventDate = "Event date is required.";
    if (isRequired(formData.eventTime)) errors.eventTime = "Start time is required.";
    if (isRequired(formData.endTime)) errors.endTime = "End time is required.";
    // Check Date and Time Logic only if required fields are present
    if (formData.eventDate && formData.eventTime && formData.endTime) {
        const selectedDate = new Date(formData.eventDate);
        const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}:00`);
        // 1. Event Date must be today or next days (not before today)
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (selectedDate < today) {
            errors.eventDate = "Event date must be today or a future date.";
        }
 
        // Check time only if date is today and no previous date errors
        if (!errors.eventDate && selectedDate.toDateString() === today.toDateString()) {
            // 2. Start time must be at least 1 hour from now
            const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); 
            if (eventDateTime < oneHourFromNow) {
                errors.eventTime = "Start time must be at least 1 hour from now.";
            }
        }
        // REMOVED: End Time validation (endDateTime <= eventDateTime)
    }
 
 
    return errors;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;
 
    const clientErrors = validateFields();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      // Stop submission if client validation fails
      toast.error("Please correct the highlighted errors before updating.");
      return; 
    }
 
    const formatTime = (time) => {
      if (!time) return '';
      // Ensure time is in the format "HH:mm:ss" as expected by C# TimeOnly
      return time.length === 5 ? `${time}:00` : time;
    };
 
    const eventTimeFormatted = formatTime(formData.eventTime);
    const endTimeFormatted = formatTime(formData.endTime);
 
    // 1. Construct the payload matching C# Event model property names (PascalCase)
    const payload = {
        EventName: formData.eventName,
        Description: formData.description,
        Location: formData.location,
        TotalSeats: parseInt(formData.totalSeats),
        PricePerTicket: parseFloat(formData.pricePerTicket),
        EventDate: formData.eventDate,
        EventTime: eventTimeFormatted,
        EndTime: endTimeFormatted,
        ImagePath: formData.imagePath,
        CategoryID: formData.categoryID || event.categoryID, 
    };
    // 2. Update the URL to include the ID in the path
    const url = `https://localhost:7283/api/Events/update-event/${formData.eventID}`;
 
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Crucial for JSON body
          'Accept': '*/*'
        },
        body: JSON.stringify(payload) // Send the data as a JSON body
      });
 
      if (response.ok) {
        toast.success("✅ Event updated successfully!");
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        const errorData = await response.json();
        const message = errorData?.error;
        const mappedErrors = {};
 
        // Mapping backend errors back to fields
        if (message && message.toLowerCase().includes("already exists")) {
          mappedErrors.eventName = "Event name has already been taken, use another name.";
        } else if (message) {
           toast.error(`❌ Backend Error: ${message}`);
        } else {
           toast.error("❌ Error updating event: Unknown issue.");
        }
 
        setFieldErrors(mappedErrors);
      }
    } catch (err) {
      toast.error("❌ Error updating event: Network connection failed.");
      console.error(err);
    }
  };
 
  if (!formData) return <p>Loading...</p>;
 
  // Function to apply error class conditionally
  const getErrorClass = (fieldName) => fieldErrors[fieldName] ? 'error' : '';
 
  return (
<div className="update-event-container">
<ToastContainer position="top-right" autoClose={3000} />
<button className="back-button" onClick={() => navigate(-1)}>← Back</button>
<h2>Update Event</h2>
<form className="update-form" onSubmit={handleSubmit}>
<label>Event Name</label>
<input name="eventName" value={formData.eventName} onChange={handleChange} className={getErrorClass('eventName')} />
        {fieldErrors.eventName && <span className="error-text">{fieldErrors.eventName}</span>}
 
        <label>Description (Optional)</label>
<textarea name="description" value={formData.description} onChange={handleChange} className={getErrorClass('description')}></textarea>
        {fieldErrors.description && <span className="error-text">{fieldErrors.description}</span>}
 
        <label>Location</label>
<input name="location" value={formData.location} onChange={handleChange} className={getErrorClass('location')} />
        {fieldErrors.location && <span className="error-text">{fieldErrors.location}</span>}
 
        <label>Total Seats</label>
<input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} className={getErrorClass('totalSeats')} />
        {fieldErrors.totalSeats && <span className="error-text">{fieldErrors.totalSeats}</span>}
 
        <label>Price Per Ticket</label>
<input type="number" name="pricePerTicket" value={formData.pricePerTicket} onChange={handleChange} className={getErrorClass('pricePerTicket')} />
        {fieldErrors.pricePerTicket && <span className="error-text">{fieldErrors.pricePerTicket}</span>}
 
        <label>Date</label>
<input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className={getErrorClass('eventDate')} />
        {fieldErrors.eventDate && <span className="error-text">{fieldErrors.eventDate}</span>}
 
        <label>Start Time</label>
<input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} className={getErrorClass('eventTime')} />
        {fieldErrors.eventTime && <span className="error-text">{fieldErrors.eventTime}</span>}
 
        <label>End Time</label>
<input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className={getErrorClass('endTime')} />
        {fieldErrors.endTime && <span className="error-text">{fieldErrors.endTime}</span>}
 
        <label>Image URL (Optional)</label>
<input type="text" name="imagePath" value={formData.imagePath} onChange={handleChange} placeholder="Enter image URL" className={getErrorClass('imagePath')} />
        {fieldErrors.imagePath && <span className="error-text">{fieldErrors.imagePath}</span>}
 
        {formData.imagePath && (
<img src={formData.imagePath} alt="Preview" className="preview-img" />
        )}
 
        <div className="form-buttons">
<button type="submit" className="btn update">Update</button>
<button type="button" className="btn cancel" onClick={() => navigate('/dashboard')}>Cancel</button>
</div>
</form>
</div>
  );
};
 
export default UpdateEventPage;