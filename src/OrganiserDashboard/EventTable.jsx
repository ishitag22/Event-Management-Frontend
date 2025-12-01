
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventTable.css';

const EventTable = ({ selectedCategory }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [confirmingEvent, setConfirmingEvent] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [eventsRes, categoriesRes] = await Promise.all([
        fetch('https://localhost:7283/api/Events'),
        fetch('https://localhost:7283/api/Categories')
      ]);
      const eventsData = await eventsRes.json();
      const categoriesData = await categoriesRes.json();
      const categoryMap = {};
      categoriesData.forEach(cat => {
        categoryMap[cat.categoryID] = cat.categoryName;
      });
      setEvents(eventsData);
      setCategories(categoryMap);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (event) => {
    navigate('/update-event', { state: { event } });
  };

  const confirmDelete = async (eventName) => {
    const url = `https://localhost:7283/api/Events/eventName?eventName=${encodeURIComponent(eventName)}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Accept': '*/*'
        }
      });

      if (response.ok) {
        console.log(`${eventName} deleted successfully`);
        fetchData(); // Refresh the list
      } else {
        const errorText = await response.text();
        console.error(`Failed to delete event: ${errorText}`);
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    } finally {
      setConfirmingEvent(null);
    }
  };

  const handleDeleteClick = (eventName) => {
    setConfirmingEvent(eventName);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSortOption('');
  };

  const getEventEndDateTime = (event) => {
    const [startHour, startMinute] = event.eventTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);
    const eventDate = new Date(event.eventDate);

    const startDateTime = new Date(eventDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(eventDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    // If end time is earlier than start time, assume event ends next day
    if (endDateTime <= startDateTime) {
      endDateTime.setDate(endDateTime.getDate() + 1);
    }

    return endDateTime;
  };

  const now = new Date();

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || event.categoryID === selectedCategory;
      console.log('Event:', event.eventName, 'CategoryID:', event.categoryID, 'Selected:', selectedCategory, 'Matches:', matchesCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === 'latest') return new Date(b.eventDate) - new Date(a.eventDate);
      if (sortOption === 'earliest') return new Date(a.eventDate) - new Date(b.eventDate);
      return 0;
    });

  const upcomingEvents = filteredEvents.filter(event => getEventEndDateTime(event) >= now);
  const completedEvents = filteredEvents.filter(event => getEventEndDateTime(event) < now);

  const renderEventCard = (event, isCompleted = false) => (
    <div
      className={`event-card ${isCompleted ? 'inactive' : ''}`}
      key={event.eventID}
      onClick={() => navigate('/event-details', { state: { eventName: event.eventName } })}
    >
      {isCompleted && <span className="badge">Completed</span>}
      <img
        src={event.imagePath || 'https://via.placeholder.com/300x200'}
        alt={event.eventName}
        className="event-card-image"
      />
      <h3 className="event-card-name">{event.eventName}</h3>
      <p className="event-card-details">
        {new Date(event.eventDate).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        })}, {event.eventTime} - {event.endTime}
      </p>
      <p className="event-card-location">{event.location}</p>
      <div className="event-card-actions" onClick={(e) => e.stopPropagation()}>
        <button className="btn update" onClick={(e) => { e.stopPropagation(); handleUpdate(event); }}>Update</button>

        {confirmingEvent === event.eventName ? (
          <div className="inline-confirm" onClick={(e) => e.stopPropagation()}>
            <p>Are you sure?</p>
            <button onClick={(e) => { e.stopPropagation(); confirmDelete(event.eventName); }}>Yes</button>
            <button onClick={(e) => { e.stopPropagation(); setConfirmingEvent(null); }}>No</button>
          </div>
        ) : (
          <button className="btn delete" onClick={(e) => { e.stopPropagation(); handleDeleteClick(event.eventName); }}>Delete</button>
        )}
      </div>

    </div>
  );

  return (
    <div className="event-table-container">
      <h3 className="table-heading">All Events</h3>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
        />
        <div className="filter-toggle" onClick={() => setShowSortOptions(!showSortOptions)}>
          <span>Sort</span>
          <span className="sort-icon">⇅</span>
        </div>
        {showSortOptions && (
          <div className="sort-options">
            <button onClick={() => setSortOption('latest')}>Latest</button>
            <button onClick={() => setSortOption('earliest')}>Earliest</button>
          </div>
        )}
        <button className="reset-btn" onClick={handleResetFilters}>Reset</button>
        <button className="add-event-btn" onClick={() => navigate('/create-event')}>+ Add Event</button>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <>
          <h3 className="group-heading">Upcoming Events</h3>
          <div className="event-card-grid">
            {upcomingEvents.map(event => renderEventCard(event))}
          </div>

          <h3 className="group-heading">Completed Events</h3>
          <div className="event-card-grid">
            {completedEvents.map(event => renderEventCard(event, true))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventTable;