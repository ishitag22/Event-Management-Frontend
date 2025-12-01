import React from 'react';
import { Calendar, Clock, MapPin } from 'react-feather';
import { MdCurrencyRupee } from 'react-icons/md';
import './EventDetailsCard.css';

const EventDetailsCard = ({ event }) => (
    <div className="event-details-card">
      <h1 style={{ color: 'var(--simba-brown-dark)', fontSize: '2rem', marginBottom: '1.5rem', borderBottom: `2px solid var(--simba-orange-light)`, paddingBottom: '0.5rem' }}>
        {event.name}
      </h1>
      
      <div className="detail-item">
        <Calendar size={20} className="detail-icon" />
        <span className="detail-label">Date: </span>
        <span className="detail-value"> {event.date}</span>
      </div>
  
      <div className="detail-item">
        <Clock size={20} className="detail-icon" />
        <span className="detail-label">Time:  </span>
        <span className="detail-value"> {event.time}</span>
      </div>
  
      <div className="detail-item">
        <MapPin size={20} className="detail-icon" />
        <span className="detail-label">Location: </span>
        <span className="detail-value"> {event.location}</span>
      </div>
  
      <div className="detail-item">
        <MdCurrencyRupee size={20} className="detail-icon" />
        <span className="detail-label">Price: </span>
        <span className="detail-value">₹{event.price}</span>
      </div>
    </div>
  );
  export default EventDetailsCard;