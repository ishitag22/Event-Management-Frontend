import React from 'react';

const DeleteEvent = ({ eventId, onDeleteSuccess, onDeleteError }) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this event?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:7283/api/Events/${eventId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onDeleteSuccess('Event deleted successfully!');
      } else {
        onDeleteError('Failed to delete event.');
      }
    } catch {
      onDeleteError('Something went wrong while deleting the event.');
    }
  };

  return (
    <button className="btn delete" onClick={handleDelete}>
      Delete
    </button>
  );
};

export default DeleteEvent;