import React, { useState } from "react";
import "./Notification.css"; // Import CSS file

function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New scholarship posted!", read: false },
    { id: 2, message: "Your application has been approved ✅", read: false },
    { id: 3, message: "Reminder: Deadline is tomorrow ⏳", read: false },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <button className="notification-bell">
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {unreadCount > 0 && (
        <div className="notification-dropdown">
          {notifications
            .filter((n) => !n.read)
            .map((n) => (
              <div key={n.id} className="notification-item">
                <span>{n.message}</span>
                <button
                  onClick={() => markAsRead(n.id)}
                  className="mark-read-btn"
                >
                  Mark as Read
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
