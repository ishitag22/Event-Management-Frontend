import React, { useState } from 'react';
import './DropdownSection.css';

const DropdownSection = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown-section">
      <button
        className="dropdown-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="dropdown-content">
          {Array.isArray(content) ? (
            <ul>
              {content.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{content}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownSection;