import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './EventDetails.css';
import { useAuth } from '../AuthContext';

const EventDetails = () => {
  const{role}=useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!state?.eventName) {
        setError('No event name provided.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://localhost:7283/api/Events/by-name?eventName=${encodeURIComponent(state.eventName)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [state]);

  const formatTime = (timeStr) => {
    try {
      return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch {
      return timeStr;
    }
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!event) return <p>No event data available.</p>;

  const category = event.categoryName || 'event';
  const backgroundStyle = {
    backgroundImage: `url(https://source.unsplash.com/1600x900/?${encodeURIComponent(category)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '20px',
    borderRadius: '12px',
    maxWidth: '800px',
    margin: '40px auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif',
    animation: 'fadeIn 1s ease-in'
  };

  return (
    <div style={backgroundStyle} className="event-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h2 className="event-title">{event.eventName}</h2>
      <img src={event.imagePath || 'https://via.placeholder.com/600x300'} alt={event.eventName} className="event-image" />
      <p className="event-description">{event.description}</p>
      <div className="event-info">
        <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
        <p><strong>Time:</strong> {formatTime(event.eventTime)} - {formatTime(event.endTime)}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Total Seats:</strong> {event.totalSeats}</p>
        <p><strong>Price Per Ticket:</strong> ₹{event.pricePerTicket}</p>
      </div>
    </div>
  );
};

export default EventDetails;


