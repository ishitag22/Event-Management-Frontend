import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import GetEventById from './GetEventById';
import EventDetailsCard from '../components/Booking/EventDetailsCard';
import EventDescriptionCard from '../components/Booking/EventDescriptionCard';
import BookTicketsPanel from '../components/Booking/BookTicketsPanel';
import { useNavigate, useParams } from 'react-router-dom';
import DropdownSection from '../components/Booking/DropdownSection';
import FAQDropdown from '../components/Booking/FAQDropdown';
import { useAuth } from '../AuthContext';
import './EventDetailsPage.css';

const EventDetailsPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { token } = useAuth();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isExpired = useMemo(() => {
    if (!event) return false;
    try {
      // if both date and time present, combine; otherwise fall back to date only
      const datePart = event.eventDate || event.date || event.eventDateTime;
      const timePart = event.eventTime || event.time || '';
      const iso = timePart ? `${datePart}T${timePart}` : datePart;
      const eventdatetime = new Date(iso);
      if (isNaN(eventdatetime.getTime())) return false;
      return eventdatetime < new Date();
    } catch (e) {
      console.warn('isExpired check failed', e);
      return false;
    }
  }, [event]);

  useEffect(() => {
    if (eventId) {
      setIsLoading(true);
      GetEventById(eventId).then(data => {
        setEvent(data);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [eventId]);

  const handleBack = () => navigate('/dashboard');

  const handleBook = () => {
    if (!token) {
      navigate('/login', { state: { from: `/event/${eventId}` } });
      return;
    }
    if (event) {
      navigate('/review-booking', {
        state: {
          eventId: event.id,
          eventPrice: event.price,
          eventName: event.name
        }
      });
    } else {
      console.error('Event not loaded.');
    }
  };

  if (isLoading) {
    return (
      <div className="page-content" style={{ textAlign: 'center', padding: '5rem' }}>
        <p style={{ color: 'var(--simba-brown-dark)' }}>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page-content" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2 style={{ color: 'red' }}>Event Not Found!</h2>
        <p>Please check the event ID or API connectivity.</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1 style={{ color: 'var(--simba-brown-dark)' }}>Event Details</h1>
      <h2 style={{ color: 'var(--simba-brown-dark)' }}>{event.name}</h2>

      <button onClick={handleBack} className="back-button">
        <ArrowLeft size={20} className="back-button-icon" /> Back to Listings
      </button>

      <div className="event-page-layout">
        <div>
          <img
            src={event.imagePath || '/default-event.jpg'}
            alt={event.name}
            style={{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}
          />
          <EventDetailsCard event={event} />
          <EventDescriptionCard description={event.description} />
        </div>
        <div>
          <BookTicketsPanel event={event} onBookClick={handleBook} disabled={isExpired} />
        </div>
        <div style={{ marginTop: '2rem' }}>
        <FAQDropdown
  title="Frequently Asked Questions"
  faqs={[
    { question: "Is there an age restriction for the event?", answer: "Yes, only people aged 10+ and above can attend the event." },
    { question: "Is there parking available?", answer: "Yes, limited paid parking is available at the venue." },
    { question: "Can I get a refund if I can't attend the event?", answer: "No, refunds will not be issued if you cannot attend." },
    { question: "What is the dress code for the event?", answer: "No, there is no specific dress code for the event." },
    { question: "Is the venue wheelchair accessible?", answer: "Yes, the venue is fully wheelchair accessible." },
    { question: "Will food, beverages & alcohol be available at the venue?", answer: "Yes, food, beverages, and alcohol will be available at the venue." },
    { question: "Is re-entry to the venue allowed?", answer: "Yes, re-entry to the venue is allowed, so you can step out and return freely during the event." },
    { question: "Is there a designated smoking area?", answer: "Yes, a designated smoking area will be available." }
  ]}
/>

  <DropdownSection
    title="Terms & Conditions"
    content={[
      "Please carry a valid ID proof along with you.",
      "No refunds on purchased ticket are possible, even in case of any rescheduling.",
      "Security procedures, including frisking remain the right of the management.",
      "No dangerous or potentially hazardous objects including but not limited to weapons, knives, guns, fireworks, helmets, lazer devices, bottles, musical instruments will be allowed in the venue and may be ejected with or without the owner from the venue.",
      "The sponsors/performers/organizers are not responsible for any injury or damage occurring due to the event. Any claims regarding the same would be settled in courts in Mumbai.",
      "People in an inebriated state may not be allowed entry.",
      "Organizers hold the right to deny late entry to the event.",
      "Venue rules apply."
    ]}
  />
</div>
      </div>
    </div>
  );
};

export default EventDetailsPage;