import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const isExpired = (() => {
    const eventDateTime = new Date(`${event.eventDate}T${event.eventTime}`);
    return eventDateTime < new Date();
  })();

  const handleClick = () => {
    if (!isExpired) {
      navigate(`/event/${event.eventID}`);
    }
  };

  const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      };
    
      const formatTime = (timeString) => {
        return timeString ? timeString.slice(0, 5) : '';
      };

  return (
    <div className={`event-card ${isExpired ? 'expired' : ''}`} onClick={handleClick}>
      <img src={event.imagePath || '/default-event.jpg'} alt={event.eventName} className="event-image" />
      <div className="event-datetime">
        {formatDate(event.eventDate)} • {formatTime(event.eventTime)}
      </div>
      <h3 className="event-name">{event.eventName}</h3>
      <div className="event-location">{event.location}</div>
      <div className="event-price">₹{event.pricePerTicket}</div>
      {isExpired && <span className="expired-tag">Expired</span>}
    </div>
  );
};

export default EventCard;