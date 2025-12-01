import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryList from './CategoryList';
import EventCard from './EventCard';
import './UserDashboard.css';
 
const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [activeCategoryId, setActiveCategoryId] = useState(null);
 
  useEffect(() => {
    axios.get('https://localhost:7283/api/Events')
      .then(res => {
        setEvents(res.data);
        setFilteredEvents(res.data);
      })
      .catch(err => console.error('Events fetch error:', err));
  }, []);
 
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents(events);
    } else {
      const result = events.filter(ev =>
        ev.eventName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(result);
    }
  }, [searchQuery, events]);
 
  const handleCategoryClick = (categoryId) => {
    if (activeCategoryId === categoryId) {
      // If same category clicked, reset to show all events
      setActiveCategoryId(null);
      setFilteredEvents(events);
    } else {
      // Filter by new category
      setActiveCategoryId(categoryId);
      const result = events.filter(ev => ev.categoryID === categoryId);
      setFilteredEvents(result);
    }
  };
 
  const handleDateFilter = (filterType) => {
    setFilter(filterType);
    const today = new Date();
    let result = events;
 
    if (filterType === 'Today') {
      result = events.filter(ev => new Date(ev.eventDate).toDateString() === today.toDateString());
    } else if (filterType === 'Tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      result = events.filter(ev => new Date(ev.eventDate).toDateString() === tomorrow.toDateString());
    } else if (filterType === 'This Week') {
      const weekEnd = new Date();
      weekEnd.setDate(today.getDate() + 7);
      result = events.filter(ev => new Date(ev.eventDate) <= weekEnd);
    }
 
    setFilteredEvents(result);
  };
 
  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategoryId(null);
    setFilter('All');
    setFilteredEvents(events);
  };
 
  return (
    <div className="dashboard-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for events"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
 
      {/* Categories */}
      <h3 className="section-title">Explore Events</h3>
      <CategoryList onCategoryClick={handleCategoryClick} activeCategoryId={activeCategoryId} />
 
      {/* Date Filters */}
      <h3 className="section-title">All Events</h3>
      <div className="filter-buttons">
        {['All', 'Today', 'Tomorrow', 'This Week'].map(f => (
          <button
            key={f}
            onClick={() => handleDateFilter(f)}
            className={filter === f ? 'active-filter' : ''}
          >
            {f}
          </button>
        ))}
        {/* <button onClick={resetFilters} style={{ marginLeft: '8px' }}>Reset</button> */}
      </div>
 
      {/* Event Grid */}
      {filteredEvents.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--simba-brown-dark)' }}>No events found!</h4>
          <p style={{ margin: 0, color: 'var(--simba-text-medium)' }}>
            Try adjusting your search or filters.
          </p>
          {/* <div style={{ marginTop: '1rem' }}>
            <button onClick={resetFilters} className="cta">Show all events</button>
          </div> */}
        </div>
      ) : (
        <div className="event-grid">
          {filteredEvents.map(event => (
            <EventCard key={event.eventID || event.id || event.eventId} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};
 
export default UserDashboard;