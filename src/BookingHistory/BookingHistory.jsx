import React, { useEffect, useState, useContext } from "react";
import api from "./api";
import { Modal, Button, Toast, ToastContainer } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import confetti from 'canvas-confetti';
import "./BookingHistory.css";
import { NotificationContext } from "./NotificationContext";
import { toast } from "react-toastify";
import { MapPin, Calendar, Clock, Armchair,Ticket } from "lucide-react";
 
const BookingHistory = () => {
  const userId = localStorage.getItem("userId");
  const { addNotification } = useContext(NotificationContext);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchEventName, setSearchEventName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedEventName, setSelectedEventName] = useState("");
  const [showBanner, setShowBanner] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
 
 
 
  // ✅ Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
 
 
 
 
 
 
 
  useEffect(() => {
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }
    fetchUpcoming();
    fetchPast();
 
    // Realtime handled elsewhere; nothing to clean up here
    return () => {};
  }, [userId]);
 
 
 
  // ✅ Reload data when search fields are cleared
useEffect(() => {
  if (!searchEventName && !searchDate) {
    fetchUpcoming();
    fetchPast();
  }
}, [searchEventName, searchDate]);
 
 
 
 
  const fetchUpcoming = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/BookingHistory/Upcoming/${userId}`);
      setUpcomingBookings(res.data || []);
      setError("");
    } catch {
      setError("Failed to load upcoming bookings.");
    } finally {
      setLoading(false);
    }
  };
 
  const fetchPast = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/BookingHistory/Past/${userId}`);
      setPastBookings(res.data || []);
      setError("");
    } catch {
      setError("Failed to load past bookings.");
    } finally {
      setLoading(false);
    }
  };
 
  const handleShowModal = (bookingId, eventName) => {
    setSelectedBookingId(bookingId);
    setSelectedEventName(eventName);
    setShowModal(true);
  };
 
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBookingId(null);
    setSelectedEventName("");
  };
 
 
 
 
 
 
 
 
 
const cancelBooking = async () => {
  handleCloseModal(); // Close modal immediately
  try {
    // API call
    await api.put(`/api/BookingHistory/Cancel/${selectedBookingId}`);
 
    // Optimistic update
    setUpcomingBookings(prev =>
      prev.map(b =>
        b.bookingId === selectedBookingId ? { ...b, status: "Cancelled" } : b
      )
    );
 
    // Refresh from backend
    fetchUpcoming();
 
    // 🎉 Confetti effect
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
 
    // ✅ Show Bootstrap banner
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 4000);
 
    // Add manual notification for notification tab
    addNotification({
      message: `Your booking for "${selectedEventName}" has been cancelled.`,
      type: "Booking Cancellation",
      userId: parseInt(userId)
    });
 
    // ✅ Add notification
    addNotification({
      message: `Your booking for "${selectedEventName}" has been cancelled.`,
      type: "Booking Cancellation",
      userId: parseInt(userId)
    });
 
    // ✅ Show Toast notification
    toast.success(`Booking for "${selectedEventName}" cancelled successfully!`, {
      position: "top-center",
      autoClose: 3000,
      className: "alert alert-success text-dark fw-bold shadow-sm"
    });
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Error cancelling booking.";
    toast.error(errorMsg, {
      position: "top-center",
      autoClose: 3000,
      className: "alert alert-danger text-dark fw-bold shadow-sm"
    });
  }
};
 
  const showToastMessage = (message, variant) => {
  if (variant === "success") toast.success(message, { position: "top-center", autoClose: 3000 });
  else if (variant === "danger") toast.error(message, { position: "top-center", autoClose: 3000 });
  else toast.info(message, { position: "top-center", autoClose: 3000 });
};
 
  const isCancelable = (eventDate, eventTime) => {
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    const now = new Date();
    const diff = (eventDateTime - now) / (1000 * 60 * 60);
    return diff > 1;
  };
 
 const searchByEventName = async () => {
    if (!searchEventName) { fetchUpcoming(); fetchPast(); return; }
    setLoading(true);
    setCurrentPage(1);
    try {
      const res = await api.get(`/api/BookingHistory/SearchByEventName`, {
        params: { userId, eventName: searchEventName },
      });
      activeTab === "upcoming"
        ? setUpcomingBookings(res.data || [])
        : setPastBookings(res.data || []);
    } catch {
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };
 
  const searchByDate = async () => {
    if (!searchDate) { fetchUpcoming(); fetchPast(); return; }
    setLoading(true);
    setCurrentPage(1);
    try {
      const res = await api.get(`/api/BookingHistory/SearchByDate`, {
        params: { userId, date: searchDate },
      });
      activeTab === "upcoming"
        ? setUpcomingBookings(res.data || [])
        : setPastBookings(res.data || []);
    } catch {
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="booking-history-container">
      <div className="booking-header">
        <h2>Booking History</h2>
        <p>Manage your event bookings</p>
      </div>
 
      {/* Tabs */}
      <div className="booking-tabs">
        <button
          className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({upcomingBookings.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
           Past ({pastBookings.length})
        </button>
      </div>
 
      {/* Search Section */}
      <div className="search-section">
        <div className="search-group">
          <input
            type="text"
            placeholder="Search by Event Name"
            className="search-input"
            value={searchEventName}
            onChange={(e) => setSearchEventName(e.target.value)}
          />
          <button className="search-btn primary" onClick={searchByEventName}>
            Search
          </button>
        </div>
        <div className="search-group">
          <input
            type="date"
            className="search-input"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <button className="search-btn secondary" onClick={searchByDate}>
            Search by Date
          </button>
        </div>
      </div>
 
      {/* Loading/Error */}
      {loading && <div className="loading-state">⏳ Loading your bookings...</div>}
      {error && <div className="error-state">❌ {error}</div>}
 
      {/* Bookings Grid */}
      <div className="bookings-grid">
        {(activeTab === "upcoming" ? upcomingBookings : pastBookings)
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((booking) => (
            <div key={booking.bookingId} className={`booking-card ${booking.status.toLowerCase()}`}>
              <div className="booking-header-card">
                <h4>{booking.eventName}</h4>
                <span className={`status-badge ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>
              <div className="booking-details">
                <div className="detail-item">
                  <span className="label"><MapPin /> Location:</span>
                  <span className="value">{booking.location}</span>
                </div>
                <div className="detail-item">
                  <span className="label"><Calendar /> Date:</span>
                  <span className="value">{booking.eventDate}</span>
                </div>
                <div className="detail-item">
                  <span className="label"><Clock /> Time:</span>
                  <span className="value">{booking.eventTime}</span>
                </div>
                <div className="detail-item">
                  <span className="label"><Armchair /> Seats:</span>
                  <span className="value">{booking.selectedSeats}</span>
                </div>
                <div className="detail-item">
                  <span className="label"><Ticket /> Booking ID:</span>
                  <span className="value">#{booking.bookingId}</span>
                </div>
              </div>
              {activeTab === "upcoming" && (
                <div className="booking-actions">
                  {booking.status === "Upcoming" &&
                  isCancelable(booking.eventDate, booking.eventTime) ? (
                    <button
                      className="cancel-btn"
                      onClick={() => handleShowModal(booking.bookingId, booking.eventName)}
                    >
                      ❌ Cancel Booking
                    </button>
                  ) : (
                    <span className="not-allowed">🚫 Cannot Cancel</span>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>
 
      {(activeTab === "upcoming" ? upcomingBookings : pastBookings).length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">{activeTab === "upcoming" ? "📅" : ""}</div>
          <h3>No {activeTab} bookings found</h3>
          <p>Your {activeTab} bookings will appear here</p>
        </div>
      )}
 
      {/* Pagination */}
      {(activeTab === "upcoming" ? upcomingBookings : pastBookings).length > itemsPerPage && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {Math.ceil((activeTab === "upcoming" ? upcomingBookings : pastBookings).length / itemsPerPage)}
          </span>
          <button
            className="page-btn"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage >= Math.ceil((activeTab === "upcoming" ? upcomingBookings : pastBookings).length / itemsPerPage)}
          >
            Next
          </button>
        </div>
      )}
 
 
      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered className="custom-modal">
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>⚠️ Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          Are you sure you want to cancel your booking for <strong>{selectedEventName}</strong>?
          <br/><small className="text-muted">This action cannot be undone.</small>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            Keep Booking
          </Button>
          <Button variant="danger" onClick={cancelBooking}>
            Yes, Cancel
          </Button>
        </Modal.Footer>
      </Modal>
 
      {/* ✅ Toast Notification */}
      <ToastContainer position="top-center" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Body className="text-Red">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};
 
export default BookingHistory;