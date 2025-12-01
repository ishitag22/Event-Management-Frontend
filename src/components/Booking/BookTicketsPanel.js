import React from 'react';
import { Users } from 'react-feather';
import './BookTicketsPanel.css';

const BookTicketsPanel = ({ event = {}, onBookClick, disabled = false }) => {
  const seatsLeft = event?.seats ?? event?.seatCount ?? 'N/A';
  // const price = event?.price ?? event?.eventPrice ?? null;

  return (
    <div className="page-card">
      <h3>Secure Your Spot!</h3>

      <div className="detail-item">
        <span><Users size={20} /> Availability: </span>
        <span>{seatsLeft} {typeof seatsLeft === 'number' ? 'Seats Left' : ''}</span>
      </div>

      {/* {price !== null && (
        <div className="detail-item" style={{ marginBottom: '1rem' }}>
          <span>Price:</span>
          <span>₹ {price}</span>
        </div>
      )} */}

      <button
        className="book-button"
        onClick={onBookClick}
        disabled={disabled}
        aria-disabled={disabled}
        title={disabled ? 'This event is no longer bookable' : 'Proceed to book'}
      >
        {disabled ? 'Event Expired' : 'Book Tickets Now'}
      </button>
    </div>
  );
};
export default BookTicketsPanel;