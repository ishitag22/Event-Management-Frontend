import React, { createContext, useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import api from "./api"; // your axios wrapper
import {
  startConnection,
  onNotificationReceived,
  offNotificationReceived,
  registerUser
} from "./SignalService";
 
 
export const NotificationContext = createContext({
  notifications: [],
  addNotification: () => {},
  resetUnreadCount: () => {"0"},
  clearNotifications: () => {}
});
 
// throttle to avoid spam while allowing different notifications
let lastToastTime = 0;
let lastToastMessage = '';
 
export function NotificationProvider({ children }) {
  const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem('userId'));
  const getUserId = () => localStorage.getItem('userId');
  const getNotificationKey = () => `notifications_${currentUserId}`;
  const getUnreadCountKey = () => `unreadCount_${currentUserId}`;

  const [notifications, setNotifications] = useState(() => {
    try {
      const userId = getUserId();
      if (!userId) return [];
      const saved = localStorage.getItem(getNotificationKey());
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
 
  const [unreadCount, setUnreadCount] = useState(() => {
    try {
      const userId = getUserId();
      if (!userId) return 0;
      return parseInt(localStorage.getItem(getUnreadCountKey()) || '0');
    } catch {
      return 0;
    }
  });
  
  const resetUnreadCount = () => {
    setUnreadCount(0);
    localStorage.setItem(getUnreadCountKey(), '0');
  };
 
  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem(getNotificationKey());
    setUnreadCount(0);
    localStorage.setItem(getUnreadCountKey(), '0');
  };
 
 
 
 
  const addNotificationRef = useRef();
 
  const addNotification = useCallback((n) => {
    const message = (n.message ?? n.Message ?? "").trim();
    if (!message) return; // skip empty notifications
   
    const cleanMessage = message.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
   
    // determine type from message content
    let type = n.type ?? n.Type ?? "General";
    if (cleanMessage.includes('cancelled')) type = "Booking Cancellation";
    else if (cleanMessage.includes('confirmed') || cleanMessage.includes('booked')) type = "Booking Confirmation";
   
    const normalized = {
      notificationId: n.notificationId ?? n.NotificationId ?? Math.random().toString(36).substr(2, 9),
      userId: n.userId ?? n.UserId,
      message: cleanMessage,
      type: type,
      createdAt: n.createdAt ?? n.CreatedAt ?? new Date().toISOString()
    };
 
    let wasAdded = false;
    setNotifications((prev) => {
      // enhanced deduplication: check ID and recent similar messages
      const now = Date.now();
      const exists = prev.some(existing => {
        const existingTime = new Date(existing.createdAt).getTime();
        const timeDiff = now - existingTime;
        return existing.notificationId === normalized.notificationId ||
               (existing.message === normalized.message && timeDiff < 5000);
      });
      if (exists) return prev;
     
      wasAdded = true;
      const updated = [normalized, ...prev];
      const userId = getUserId();
      if (userId) {
        localStorage.setItem(getNotificationKey(), JSON.stringify(updated));
      }
      return updated;
    });
   
    if (wasAdded) {
      setUnreadCount((prev) => {
        const newCount = prev + 1;
        const userId = getUserId();
        if (userId) {
          localStorage.setItem(getUnreadCountKey(), newCount.toString());
        }
        return newCount;
      });
 
      // Show toast notification
      try {
        const now = Date.now();
        const toastMessage = `You have a new notification: ${normalized.type}`;
        if (now - lastToastTime > 2000 || lastToastMessage !== toastMessage) {
          toast.info(toastMessage, {
            position: "top-center",
            autoClose: 3000,
            toastId: `notification-${normalized.notificationId}`
          });
          lastToastTime = now;
          lastToastMessage = toastMessage;
        }
      } catch (e) {
        // swallow toast errors
      }
    }
  }, []);
 
 
 
 
 
 
  // Reset notifications when userId changes
  useEffect(() => {
    const userId = getUserId();
    if (userId !== currentUserId) {
      setCurrentUserId(userId);
      if (userId) {
        const saved = localStorage.getItem(`notifications_${userId}`);
        const savedCount = localStorage.getItem(`unreadCount_${userId}`);
        setNotifications(saved ? JSON.parse(saved) : []);
        setUnreadCount(savedCount ? parseInt(savedCount) : 0);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    }
  }, [currentUserId]);

  useEffect(() => {
    let mounted = true;
    const intervalId = setInterval(() => {
      const userId = getUserId();
      if (userId !== currentUserId) {
        setCurrentUserId(userId);
      }
    }, 500);
 
    const init = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
 
      if (!token || !userId) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
 
      // only fetch from server if no local notifications exist
      if (notifications.length === 0) {
        try {
          const res = await api.get(`/api/Notification/User/${userId}`);
          if (mounted && Array.isArray(res.data)) {
            const serverNotifications = res.data
              .filter(n => (n.message ?? n.Message ?? "").trim()) // filter empty messages
              .map(n => ({
                notificationId: n.notificationId ?? n.NotificationId,
                userId: n.userId ?? n.UserId,
                message: (n.message ?? n.Message).replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
                type: n.type ?? n.Type,
                createdAt: n.createdAt ?? n.CreatedAt
              }));
 
            setNotifications(serverNotifications);
            if (userId) {
              localStorage.setItem(`notifications_${userId}`, JSON.stringify(serverNotifications));
            }
          }
        } catch (err) {
          console.warn("Failed to load server notifications", err);
        }
      }
 
      // start SignalR and subscribe to realtime notifications
      await startConnection();
 
      // register user group on server
      try { await registerUser(userId); } catch {}
 
      // subscribe to incoming notifications
      const unsubscribe = onNotificationReceived((payload) => {
        addNotificationRef.current?.(payload);
      });
 
      // cleanup: remove subscription when unmount
      return unsubscribe;
    };
 
    let cleanup;
    init().then((maybeUnsub) => { cleanup = maybeUnsub; });
 
    return () => {
      mounted = false;
      clearInterval(intervalId);
      if (cleanup) cleanup();
    };
  }, [currentUserId]);
 
  addNotificationRef.current = addNotification;
 
return (
  <NotificationContext.Provider value={{ notifications, addNotification, unreadCount, resetUnreadCount, clearNotifications }}>
    {children}
  </NotificationContext.Provider>
);
}