import React, { useEffect, useState } from 'react';
import { ArrowLeft, Share2, CreditCard, MapPin, Calendar, IndianRupee, Ticket, Plus, Minus } from 'lucide-react';
import GetBookingDetails from './GetBookingDetails';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Login/Api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ReviewBookingPage.css';
import { useAuth } from '../AuthContext';

const BookingSummaryHeader = ({ booking }) => (
    <div className="flex p-4 border-b">
        <div style={{ flexGrow: 1 }}>
            <h2 style={{ color: 'var(--simba-brown-dark)', fontSize: '1.4rem', marginBottom: '0.25rem' }}>
                {booking.EventName}
            </h2>
            <p style={{ color: 'var(--simba-text-medium)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: 'var(--simba-orange-dark)' }} />
                {booking.Location}
            </p>
        </div>
    </div>
);

const SeatCounter = ({ count, setCount, maxSeats }) => {
  return (
    <div className="seat-counter-container">
      <span className="seat-label">Selected Seats: </span>

      <div className="seat-controls">
        <button
          id="decrement-btn"
          onClick={() => setCount(c => Math.max(1, c - 1))}
          disabled={count <= 1}
          className="seat-btn minus-btn"
        >
          <Minus size={18} />
        </button>

        <span className="seat-count">{count}</span>

        <button
          id="increment-btn"
          onClick={() => setCount(c => Math.min(maxSeats, c + 1))}
          disabled={count >= maxSeats}
          className="seat-btn plus-btn"
        >
          <Plus size={18} />
        </button>
      </div>

      <span className="seat-max">(Max: {maxSeats})</span>
    </div>
  );
};

const TicketDetailsCard = ({ booking, selectedSeats, maxSeats, setSelectedSeats }) => {
    const eventDateTime = `${booking.EventDate} at ${booking.Time}`;

    return (
        <div className="review-card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--simba-orange-dark)', fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--simba-light-grey)', paddingBottom: '0.5rem' }}>
                <Ticket size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Booking Details
            </h3>

            <div className="detail-item" >
                <span><Calendar size={16} /><b> Date & Time:  </b></span>
                <span>{eventDateTime}</span>
            </div>
            
            <div className="detail-item">
                <span><IndianRupee size={16} /><b> Price/Ticket: </b></span>
                <span>₹{booking.PricePerTicket.toFixed(2)}</span>
            </div>
            
            <SeatCounter 
                count={selectedSeats} 
                setCount={setSelectedSeats} 
                maxSeats={maxSeats} 
            />
        </div>
    );
};

const PaymentSummaryCard = ({ totalAmount, onPaymentAdd, paymentMethod, setPaymentMethod }) => (
    <div className="review-card">
        <h3 style={{ color: 'var(--simba-orange-dark)', fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--simba-light-grey)', paddingBottom: '0.5rem' }}>
            <CreditCard size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Payment Summary
        </h3>

        <div style={{ marginBottom: '0.8rem', textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--simba-brown-dark)', fontSize: '0.9rem' }}>Payment Method:</label>
            <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '220px', margin: '0 auto' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.4rem 0.6rem', border: `1px solid ${paymentMethod === 'UPI' ? 'var(--simba-orange-dark)' : 'var(--simba-light-grey)'}`, borderRadius: '4px', flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                    <input 
                        type="radio" 
                        value="UPI" 
                        checked={paymentMethod === 'UPI'} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ marginRight: '0.3rem', width: '12px', height: '12px', accentColor: 'var(--simba-brown-dark)' }}
                    />
                    UPI
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.4rem 0.6rem', border: `1px solid ${paymentMethod === 'Card' ? 'var(--simba-orange-dark)' : 'var(--simba-light-grey)'}`, borderRadius: '4px', flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                    <input 
                        type="radio" 
                        value="Card" 
                        checked={paymentMethod === 'Card'} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ marginRight: '0.3rem', width: '12px', height: '12px', accentColor: 'var(--simba-brown-dark)' }}
                    />
                    Card
                </label>
            </div>
        </div>

        <div className="detail-item" style={{marginTop: '1rem', borderTop: '1px solid var(--simba-text-dark)', paddingTop: '1rem'}}>
            <span style={{ color: 'var(--simba-brown-dark)', fontSize: '1.2rem', fontWeight: 600 }}>Total Due:</span>
            <span style={{ color: 'var(--simba-orange-light)', fontSize: '1.2rem', fontWeight: 700}}>₹{totalAmount.toFixed(2)}</span>
        </div>

        <button onClick={onPaymentAdd} className="book-button" style={{ marginTop: '1.5rem' }}>
            Pay via {paymentMethod} - ₹{totalAmount.toFixed(2)}
        </button>
    </div>
);

const ReviewBookingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useAuth();
    const routeState = location.state;
    const eventId = routeState?.eventId;

    const [eventDetails, setEventDetails] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('UPI');

    useEffect(() => {
        if (eventId) {
            setIsLoading(true);
            GetBookingDetails(eventId).then(data => {
                setEventDetails(data);
                setSelectedSeats(1); 
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        if (eventDetails) {
            const baseAmount = selectedSeats * eventDetails.PricePerTicket;
            setTotalAmount(baseAmount);
        }
    }, [selectedSeats, eventDetails]);

    if (isLoading) {
        return <div className="page-content" style={{textAlign: 'center', padding: '5rem'}}>Loading booking summary...</div>;
    }
    
    if (!eventDetails) {
        return <div className="page-content" style={{textAlign: 'center', padding: '5rem'}}>
            <h2 style={{color: 'red'}}>Cannot retrieve event details.</h2>
            <button onClick={() => navigate('/')}>Go to Home</button>
        </div>;
    }
    
    const bookingSummary = {
        ...eventDetails,
        SelectedSeats: selectedSeats,
        TotalAmount: totalAmount,
    };

    const handleBack = () => navigate(`/event/${eventId}`);
    const handleShare = () => alert('Sharing booking details...');
    
    const handlePaymentAdd = async () => {
        if (!userId) {
            toast.error('User not found. Please login again.');
            navigate('/login');
            return;
        }

        // disable UI / indicate processing if needed (optional)
        let success = false;
        let serverResponse = null;

        try {
            // Call backend bookings endpoint (Review page performs the booking)
            const resp = await api.post('/Bookings', {
                selectedSeats,
                userId,
                eventId
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            success = true;
            serverResponse = resp.data;
        } catch (err) {
            console.error('Booking API error', err);
            success = false;
            serverResponse = err.response?.data || err.message || 'Unknown error';
        }

        // Navigate to confirmation page with booking result and payload for display
        navigate('/booking-confirmation', {
            state: {
                eventId,
                selectedSeats,
                eventName: bookingSummary.EventName,
                performer: 'Event Organizer',
                date: bookingSummary.EventDate,
                time: bookingSummary.Time,
                locationName: bookingSummary.Location,
                totalAmount: totalAmount,
                userId,
                success,
                serverResponse
            }
        });
    };

    return (
        <div className="page-content">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button onClick={handleBack} className="back-button">
                    <ArrowLeft size={20} />
                </button>
                <h1 style={{fontSize: '1.5rem', margin: 0}}>Review Booking</h1>
                <button onClick={handleShare} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--simba-text-medium)' }}>
                    <Share2 size={20} />
                </button>
            </div>
            
            {eventDetails.ImagePath && (
                <img
                    src={eventDetails.ImagePath}
                    alt={eventDetails.EventName}
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        display: 'block',
                        margin: '0 auto 1.5rem auto'
                    }}
                />
            )}
            
            <BookingSummaryHeader booking={bookingSummary} />
            <TicketDetailsCard 
                booking={bookingSummary}
                selectedSeats={selectedSeats}
                maxSeats={eventDetails.TotalSeats}
                setSelectedSeats={setSelectedSeats}
            />
            <PaymentSummaryCard 
                totalAmount={totalAmount} 
                onPaymentAdd={handlePaymentAdd}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
            />
        </div>
    );
};

export default ReviewBookingPage;