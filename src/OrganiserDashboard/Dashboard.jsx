import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import CountUp from 'react-countup';
import axios from 'axios';
import EventTable from './EventTable';
import CreateCategory from './CreateCategory';
import {
  FaCalendarAlt, FaUsers, FaMoneyBillWave, FaClipboardList,
  FaMusic, FaLaughBeam, FaTheaterMasks, FaGlassCheers,
  FaUtensils, FaFutbol,
  FaHandSparkles, FaLaptop
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';
 
const iconMap = {
  Music: <FaMusic className="category-icon" />,
  Comedy: <FaLaughBeam className="category-icon" />,
  Performance: <FaTheaterMasks className="category-icon" />,
  NightLife: <FaGlassCheers className="category-icon" />,
  'Food & Drinks': <FaUtensils className="category-icon" />,
  Sports: <FaFutbol className="category-icon" />,
  Art: <FaTheaterMasks className="category-icon" />,
  Tech: <FaLaptop className="category-icon" />
};
 
const Dashboard = () => {
  const { role } = useAuth();
  const [stats, setStats] = useState({ events: 0, bookings: 0, revenue: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const navigate = useNavigate();
 
  const fetchStats = async () => {
    try {
      const [eventsRes, usersRes, bookingsRes, revenueRes] = await Promise.all([
        axios.get('https://localhost:7283/api/Events/Total%20Number%20Of%20Events'),
        axios.get('https://localhost:7283/api/Events/Total%20Number%20Of%20Users'),
        axios.get('https://localhost:7283/api/Events/Total%20Number%20Of%20Bookings'),
        axios.get('https://localhost:7283/api/Events/Total%20Revenue%20Generated'),
      ]);
 
      setStats({
        events: Number(eventsRes.data),
        users: Number(usersRes.data),
        bookings: Number(bookingsRes.data),
        revenue: Number(revenueRes.data),
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };
 
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://localhost:7283/api/Categories');
      setCategories(response.data);
    } catch {
      console.error('Failed to load categories');
    }
  };
 
  useEffect(() => {
    fetchStats();
    fetchCategories();
  }, []);
 
  return (
    <div className="dashboard-container">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {/* Stats */}
          <div className="dashboard-card">
            <div className="stats-row">
              <div className="stat-block"><FaCalendarAlt /><h2>Total Events</h2><CountUp end={stats.events} duration={2} /></div>
              <div className="stat-block"><FaUsers /><h2>Total Users</h2><CountUp end={stats.users} duration={2} /></div>
              <div className="stat-block"><FaClipboardList /><h2>Total Bookings</h2><CountUp end={stats.bookings} duration={2} /></div>
              <div className="stat-block"><FaMoneyBillWave /><h2>Total Revenue</h2>₹<CountUp end={stats.revenue} duration={2} separator="," decimals={2} /></div>
            </div>
          </div>
 
          {/* Categories Grid */}
          <div className="dashboard-card">
            <div className="category-grid">
              {categories.map(cat => (
                <div 
                  key={cat.categoryID} 
                  className={`category-card ${selectedCategory === cat.categoryID ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === cat.categoryID ? null : cat.categoryID)}
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  <div className="category-icon">{iconMap[cat.categoryName] || <FaHandSparkles />}</div>
                  <h2>{cat.categoryName}</h2>
                  <button 
                    className="delete-category-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingCategory(cat);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
 
              {/* Animated Plus Card */}
              <div
                className={`category-card add-category-card ${!showPopup ? 'animate' : ''}`}
                onClick={() => setShowPopup(true)}
              >
                <span className="plus-icon">+</span>
              </div>
            </div>
          </div>
 
          {/* Popup for Adding Category */}
          {showPopup && (
            <div className="popup-overlay" onClick={() => setShowPopup(false)}>
              <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                <CreateCategory onCategoryCreated={() => {
                  fetchCategories();
                  setShowPopup(false);
                }} />
                <button className="close-btn" onClick={() => setShowPopup(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Popup */}
          {deletingCategory && (
            <div className="popup-overlay" onClick={() => setDeletingCategory(null)}>
              <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                <h3 style={{ color: 'var(--simba-orange-dark)', marginBottom: '1rem' }}>Delete Category</h3>
                <p style={{ marginBottom: '1.5rem' }}>Are you sure you want to delete "{deletingCategory.categoryName}"?</p>
                <div className="popup-buttons">
                  <button 
                    className="btn create"
                    onClick={() => {
                      axios.delete(`https://localhost:7283/api/Categories/${deletingCategory.categoryID}`)
                        .then(() => {
                          toast.success('Category deleted successfully!');
                          fetchCategories();
                          setDeletingCategory(null);
                        })
                        .catch(err => {
                          toast.error('Failed to delete category.');
                          console.error('Delete failed:', err);
                        });
                    }}
                  >
                    Delete
                  </button>
                  <button className="btn cancel" onClick={() => setDeletingCategory(null)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
 
          {/* Events Table */}
          <div className="dashboard-card">
            <EventTable selectedCategory={selectedCategory} />
          </div>
        </>
      )}
    </div>
  );
};
 
export default Dashboard;