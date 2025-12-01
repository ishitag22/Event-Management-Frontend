import React, { useEffect, useState } from 'react';
import { getAllBookings } from './BookingService';
import DeleteBooking from './DeleteBooking';
import { Link } from 'react-router-dom';

function GetBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getAllBookings()
      .then(response => setBookings(response.data))
      .catch(error => console.error('Error fetching bookings:', error));
  }, []);

  return (
    <div>
      <h2>All Bookings</h2>
      {/* <Link to="/add" className="btn btn-primary">Book Tickets</Link> */}
      <table border={2}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Seats</th>
            <th>Event</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.bookingId}>
              <td>{b.bookingId}</td>
              <td>{b.userName}</td>
              <td>{b.selectedSeats}</td>
              <td>{b.eventId}</td>
              <td>{b.status}</td>
              <td>
                <Link to={`/update/${b.bookingId}`}>Edit</Link>
                <DeleteBooking id={b.bookingId} onDelete={() => setBookings(bookings.filter(x => x.bookingId !== b.bookingId))} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GetBookings;