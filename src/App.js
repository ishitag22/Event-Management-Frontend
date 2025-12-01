import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from './components/LandingPage'; // make sure this path is correct
 
// Booking & User Components
import BookingHistory from './BookingHistory/BookingHistory';
import NotificationTab from './BookingHistory/NotificationTab';
import TopEvents from './Booking/TopEvents';
import EventDetailsPage from './Booking/EventDetailsPage';
import ReviewBookingPage from './Booking/ReviewBookingPage';
import BookingConfirmationPage from './Booking/BookingConfirmationPage';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './Login/Login';
import Signup from './Login/Signup';
import ProfilePage from './Login/ProfilePage';
 
// Feedback Components
import FeedbackAdmin from './Feedback/FeedbackAdmin';
import SubmitFeedback from './Feedback/SubmitFeedback';
 
// Organiser Components
import Dashboard from './OrganiserDashboard/Dashboard';
import CreateEventForm from './OrganiserDashboard/CreateEventForm';
import UpdateEventPage from './OrganiserDashboard/UpdateEventPage';
import EventDetails from './OrganiserDashboard/EventDetails';
 
// Context & Services
import { useAuth } from './AuthContext';
// import { NotificationContext } from './BookingHistory/NotificationContext';
 
import UserDashboard from './Dashboard/UserDashboard';
 
function AppContent() {
  const { token, theme, role } = useAuth();
  const location = useLocation();
  const showNav = location.pathname !== '/';
  // const { addNotification } = useContext(NotificationContext);
 
  useEffect(() => {
    // immediate jump to top — change to behavior: 'smooth' if you prefer animated scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);
 
  // State and toggles for Feedback section
  const [showList, setShowList] = useState(false);
  const toggleView = () => {
    setShowList(prevShowList => !prevShowList);
  };
 
  // Effect to set initial view for Feedback based on user role
  useEffect(() => {
    if (role === 'Organiser') {
      setShowList(true); // If Organiser, go to the previous feedbacks directly
    } else {
      setShowList(false); // If User, go to the submit feedback form
    }
  }, [role]);
 
 
  // Determine if the user is an Organiser
  const isOrganiser = role === 'Organiser';
 
  return (
    <div className="App" data-theme={theme}>
      <Header />
      <ToastContainer />
 
      {/* Show nav on all routes except LandingPage ('/') */}
      {showNav && (
        <nav className="main-nav">
          {token ? (
            isOrganiser ? (
              <>
                <NavLink to="/dashboard" style={{ margin: '10px' }}>Dashboard</NavLink>
                <NavLink to="/create-event" style={{ margin: '10px' }}>Create Event</NavLink>
                <NavLink to="/feedback" style={{ margin: '10px' }}>Feedback</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" style={{ margin: '10px' }}>Dashboard</NavLink>
                <NavLink to="/booking-history" style={{ margin: '10px' }}>Booking History</NavLink>
                <NavLink to="/feedback" style={{ margin: '10px' }}>Feedback</NavLink>
                <NavLink to="/top-events" style={{ margin: '10px' }}>Top Events</NavLink>
              </>
            )
          ) : (
            <>
              <NavLink to="/login" style={{ margin: '10px' }}>Login</NavLink>
              <NavLink to="/top-events" style={{ margin: '10px' }}>Top Events</NavLink>
            </>
          )}
        </nav>
      )}
 
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* LandingPage is the public home screen */}
          <Route path="/" element={<LandingPage />} />
          {/* --- Protected Routes --- */}
          {/* If token exists, show the page. If not, show Login page. */}
 
          {isOrganiser ? (
             /* Organiser Routes */
             <>
               <Route path="/create-event" element={token ? <CreateEventForm /> : <Login />} />
               <Route path="/update-event" element={token ? <UpdateEventPage /> : <Login />} />
               <Route path="/event-details" element={token ? <EventDetails /> : <Login />} />
             </>
           ) : (
             /* User/Booking Routes */
             <>
               <Route path="/user-dashboard" element={token ? <UserDashboard /> : <Login />} />
               <Route path="/top-events" element={<TopEvents />} />
               {/* Viewing event details / booking requires login — redirect to Login if not authenticated */}
               <Route path="/event/:eventId" element={token ? <EventDetailsPage /> : <Login />} />
               <Route path="/review-booking" element={token ? <ReviewBookingPage /> : <Login />} />
               <Route path="/booking-confirmation" element={token ? <BookingConfirmationPage /> : <Login />} />
               <Route path="/booking-history" element={token ? <BookingHistory /> : <Login />} />
               <Route path="/notification" element={token ? <NotificationTab /> : <Login />} />
             </>
           )}
         
          {/* Profile Route - Available for both User and Organiser */}
          <Route path="/profile" element={token ? <ProfilePage /> : <Login />} />
         
          {/* Feedback Route (Shared but with role logic inside) */}
          <Route
            path="/feedback"
            element={token ?
              (showList ? <FeedbackAdmin onShowForm={toggleView} /> : <SubmitFeedback onViewPrevious={toggleView} />
              ) : <Login />
            }
          />
          {/* Fallback: anonymous -> LandingPage, authenticated -> role default */}
          <Route path="*" element={token ? (isOrganiser ? <Dashboard /> : <UserDashboard />) : <LandingPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
 
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
 
export default App;