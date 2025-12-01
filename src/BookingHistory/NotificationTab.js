import React, { useContext ,useState} from "react";
import { NotificationContext } from "./NotificationContext";
import "./NotificationTab.css";

export default function NotificationTab() {
  const { notifications, unreadCount, resetUnreadCount, clearNotifications } = useContext(NotificationContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [showClearModal, setShowClearModal] = useState(false);
  const notificationsPerPage = 10;

  React.useEffect(() => {
    if (unreadCount > 0) {
      resetUnreadCount();
    }
  }, [unreadCount, resetUnreadCount]);

  const totalPages = Math.ceil(notifications.length / notificationsPerPage);
  const startIndex = (currentPage - 1) * notificationsPerPage;
  const currentNotifications = notifications.slice(startIndex, startIndex + notificationsPerPage);

  const handleClearAll = () => {
    clearNotifications();
    setCurrentPage(1);
    setShowClearModal(false);
  };

  const getNotificationIcon = (type) => {
    if (type.includes('Confirmation')) return '✅';
    if (type.includes('Cancellation')) return '❌';
    return '🔔';
  };

  const getNotificationColor = (type) => {
    if (type.includes('Confirmation')) return 'success';
    if (type.includes('Cancellation')) return 'danger';
    return 'info';
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>🔔 Notifications</h2>
        <p>Stay updated with your booking activities</p>
        {notifications.length > 0 && (
          <div className="notification-controls">
            <div className="notification-count">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            </div>
            <button className="clear-btn" onClick={() => setShowClearModal(true)}>
              🗑️ Clear All
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <div className="empty-icon">🔕</div>
          <h3>No notifications yet</h3>
          <p>Your booking notifications will appear here</p>
        </div>
      ) : (
        <div className="notifications-list">
          {currentNotifications.map(n => (
            <div key={n.notificationId} className={`notification-card ${getNotificationColor(n.type)}`}>
              <div className="notification-icon">
                {getNotificationIcon(n.type)}
              </div>
              <div className="notification-content">
                <div className="notification-type">{n.type}</div>
                <div className="notification-message">{n.message}</div>
                <div className="notification-time">
                   {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="page-btn" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="page-btn" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setShowClearModal(false)}>
          <div style={{
            backgroundColor: 'var(--simba-white)',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--simba-orange-dark)' }}>Clear All Notifications?</h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--simba-text-medium)' }}>Are you sure you want to clear all notifications? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowClearModal(false)}
                style={{
                  padding: '0.6rem 1.2rem',
                  border: '1px solid var(--simba-light-grey)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--simba-off-white)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleClearAll}
                style={{
                  padding: '0.6rem 1.2rem',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
