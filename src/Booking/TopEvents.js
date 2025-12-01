import React, { useState, useEffect } from 'react';
import { getTopBookedEvents } from './BookingService';
import EventCard from '../Dashboard/EventCard';
import './TopEvents.css';

function TopEvents() {
  const [count, setCount] = useState(5);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getTopBookedEvents(count)
      .then(response => setEvents(response.data))
      .catch(error => console.error(error));
  }, [count]); // Fetch automatically when count changes

  return (
    <div className="top-events-container">
      <h1 className="page-title">Top Booked Events</h1>

      {/* Dropdown aligned left */}
      <div className="dropdown-container">
        <label htmlFor="eventCount">Show:</label>
        <select
          id="eventCount"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        >
          {[5, 10, 15, 20].map(num => (
            <option key={num} value={num}>{num} Events</option>
          ))}
        </select>
      </div>

      {/* Event Grid */}
      <div className="event-grid">
        {events.map(event => (
          <EventCard key={event.eventID} event={event} />
        ))}
      </div>
    </div>
  );
}

export default TopEvents;