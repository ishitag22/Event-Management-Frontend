import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingPageWrapper = () => {
  const [eventId, setEventId] = useState("");
  const navigate = useNavigate();

  const handleCheckEvent = () => {
    if (eventId.trim()) {
      navigate(`/event/${eventId}`);
    }
  };

  return (
    <div className="page-content">
      <h1 style={{ color: 'var(--simba-brown-dark)' }}>Check Event Page</h1>
      <input
        type="text"
        placeholder="Enter Event ID (e.g., e101)"
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        style={{
          padding: '0.5rem',
          marginRight: '1rem',
          borderRadius: '4px',
          border: '1px solid var(--simba-light-grey)'
        }}
      />
      <button
        onClick={handleCheckEvent}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--simba-orange-dark)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Go to Event
      </button>
    </div>
  );
};

export default BookingPageWrapper;