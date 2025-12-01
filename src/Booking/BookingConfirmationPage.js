import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import confetti from 'canvas-confetti';
import { Download, Share } from 'lucide-react';
import { NotificationContext } from '../BookingHistory/NotificationContext';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;
  const [isBookingDone, setIsBookingDone] = useState(null);
  const { addNotification } = useContext(NotificationContext);
  const userId = localStorage.getItem('userId');

  // Run side effects (toast/confetti) depending on booking result passed from ReviewBookingPage
  useEffect(() => {
    if (!bookingData || !userId) return;

    const { success } = bookingData;
    if (success) {
      setIsBookingDone(true);
      
      // Add notification immediately
      console.log('Adding booking confirmation notification for userId:', userId);
      addNotification({
        message: `Your booking for "${bookingData.eventName}" has been confirmed!`,
        type: 'Booking Confirmation',
        userId: parseInt(userId)
      });
      
      // Verify it was saved
      setTimeout(() => {
        const saved = localStorage.getItem(`notifications_${userId}`);
        console.log('Saved notifications after booking:', saved);
      }, 500);
      
      toast.success('🎉 Your booking is confirmed!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        theme: 'colored'
      });

      const duration = 1.5 * 1000;
      const end = Date.now() + duration;
      (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 45, origin: { x: 0 } });
        confetti({ particleCount: 3, angle: 120, spread: 45, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    } else {
      setIsBookingDone(false);
      toast.error('Booking failed. See details on the confirmation page.', {
        position: 'top-center',
        autoClose: 4000,
        theme: 'colored'
      });
      console.error('Booking failed serverResponse:', bookingData.serverResponse);
    }
  }, [bookingData, userId, addNotification]);

  if (!bookingData) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ color: 'red' }}>No booking details found!</h2>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  const { eventName, selectedSeats, date, time, locationName, totalAmount } = bookingData;

  const handleDownload = () => {
    toast.info('Downloading booking confirmation...', {
      position: 'top-center',
      autoClose: 2000
    });
  };
  
  const handleShare = () => {
    toast.info('Sharing booking details...', {
      position: 'top-center',
      autoClose: 2000
    });
  };

  return (
    <div className="page-content" style={{
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '1.5rem',
      borderRadius: '12px',
      background: isBookingDone ? 'linear-gradient(135deg, #E6FFF0, #F4FFFA)' : 'linear-gradient(135deg, #FFF5F5, #FFF8F9)',
      boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <ToastContainer />
      <h1 style={{
        textAlign: 'center',
        color: 'var(--simba-brown-dark)',
        marginBottom: '1rem',
        fontWeight: '700'
      }}>
        BOOKING CONFIRMATION
      </h1>

      <div style={{
        backgroundColor: 'transparent',
        padding: '1rem',
        borderRadius: '8px'
      }}>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--simba-orange-dark)' }}>{eventName}</h2>
        <p>No of Tickets: <strong>{selectedSeats}</strong></p>
        <p>Date: {date} &nbsp; Time: {time}</p>
        <p>Location: {locationName}</p>
        <p>Total Payment: <strong>₹{totalAmount}</strong></p>
        <p style={{
          fontWeight: 'bold',
          color: isBookingDone ? 'green' : 'gray',
          marginTop: '1rem'
        }}>
          {isBookingDone ? 'YOUR BOOKING IS CONFIRMED!' : 'Processing your booking...'}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1.5rem' }}>
        <button onClick={handleDownload} style={{
          padding: '0.8rem 1.2rem',
          backgroundColor: 'var(--simba-orange-dark)',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600'
        }}>
          <Download size={16} /> Download
        </button>
        <button onClick={handleShare} style={{
          padding: '0.8rem 1.2rem',
          backgroundColor: 'var(--simba-brown-dark)',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600'
        }}>
          <Share size={16} /> Share
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;