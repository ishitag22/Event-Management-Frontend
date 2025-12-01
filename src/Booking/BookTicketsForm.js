import React, { useState } from 'react';
import { bookTickets } from './BookingService';
import { useNavigate } from 'react-router-dom';

function BookTicketsForm() {
  const [selectedSeats, setSelectedSeats] = useState('');
  const [userName, setUserName] = useState('');
  const [eventId, setEventId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    bookTickets(selectedSeats, eventId)
      .then(() => {
        alert('Booking successful!');
        navigate('/');
      })
      .catch(error => {
        alert('Booking failed!');
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Book Tickets</h2>
      <input type="number" placeholder="Seats" value={selectedSeats} onChange={(e) => setSelectedSeats(e.target.value)} required />
      <input type="text" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} required />
      <input type="number" placeholder="Event ID" value={eventId} onChange={(e) => setEventId(e.target.value)} required />
      <button type="submit">Book</button>
    </form>
  );
}

export default BookTicketsForm;