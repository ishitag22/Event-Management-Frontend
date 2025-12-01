import React, { useState } from 'react';
import './DropdownSection.css';

const FAQDropdown = ({ title, faqs }) => {
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
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item">
              <p className="faq-question">{faq.question}</p>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQDropdown;