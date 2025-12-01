import React, { useState } from 'react';
import './EventDescriptionCard.css';
import { Info } from 'react-feather';

const EventDescriptionCard = ({ description = '' }) => {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 320;
  const isLong = description.length > LIMIT;
  const displayText = !isLong ? description : (expanded ? description : `${description.slice(0, LIMIT).trim()}...`);

  return (
    <div className="event-card-detail">
      <h2 style={{ color: 'var(--simba-orange-dark)', fontSize: '1.5rem', marginBottom: '1rem' }}>
        <Info size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> About the Event
      </h2>
      <p className="description-text" style={{ color: 'var(--simba-text-medium)' }}>{displayText}</p>

      {isLong && (
        <button
          type="button"
          className="see-toggle"
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? 'See less' : 'See more'}
        </button>
      )}
    </div>
  );
};

export default EventDescriptionCard;