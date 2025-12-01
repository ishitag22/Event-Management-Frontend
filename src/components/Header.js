import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SimbaLogo from '../images/simba-dark.png'; // Make sure this path is correct
import styles from './Header.module.css';
import { useAuth } from '../AuthContext';
import { NotificationContext } from '../BookingHistory/NotificationContext';
import { toast } from 'react-toastify';

const Header = () => {
  // 2. Get theme and toggleTheme from the context
  const { token, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!', {
      position: 'top-center',
      autoClose: 2000
    });
    navigate('/');
  };
  const { unreadCount, resetUnreadCount } = React.useContext(NotificationContext);
  
  const handleNotifications = () => {
    resetUnreadCount();
    navigate('/notification');
  };

  // Only show profile/notifications/logout when NOT on Landing or Auth pages
  const hideProfileOn = ['/', '/login', '/signup'];
  const showProfileControls = token && !hideProfileOn.includes(location.pathname);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        
        <Link to="/" className={styles.logoContainer}>
          <img src={SimbaLogo} alt="Logo" className={styles.logo} />
          <span className={styles.logoText}>SIMBA Events</span>
        </Link>

        <div className={styles.rightContainer}>
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          {showProfileControls && (
            <div className={styles.profileContainer}>
              <button 
                onClick={handleNotifications} 
                className={styles.notificationBell}
                aria-label="View notifications"
                style={{ position: 'relative' }}
              >
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      backgroundColor: 'red',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              <button onClick={() => navigate('/profile')} className={styles.profileIcon}>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" fillRule="evenodd"></path>
                </svg>
              </button>

              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          )}
        </div>
 
      </div>
</header>
  );
};
 
export default Header;