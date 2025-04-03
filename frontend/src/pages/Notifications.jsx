import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";
import { CheckCircle } from "lucide-react";

const Notifications = () => {
  const { user, refreshNotifications } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user._id) return;
    

    // Fetching Notification from the backend
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${BASE_URL}notifications/${user._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        if (!res.ok) throw new Error("Failed to fetch notifications");
        
        const data = await res.json();
        const fetchedNotifications = Array.isArray(data) ? data : data.data || [];
        setNotifications(fetchedNotifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);


  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(`${BASE_URL}notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      if (!res.ok) throw new Error("Failed to mark notification as read");
      
      // Update local state to reflect the change
      setNotifications(
        notifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, notificationStatus: "read" }
            : notification
        )
      );
      
      // Refresh the unread count
      refreshNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };


  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(notification => notification.notificationStatus === "unread")
          .map((notification) =>
            fetch(`${BASE_URL}notifications/${notification._id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            })
          )
      );
      
      // Update local state
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          notificationStatus: "read",
        }))
      );
      
      // Refresh the unread count
      refreshNotifications();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      // Optionally show an error message to the user
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        {notifications.some(n => n.notificationStatus === "unread") && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      {!loading && !error && notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className={`p-4 mb-4 rounded-lg shadow-md border ${
                notification.notificationStatus === "unread"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold">
                    {notification.customer?.name || "Unknown Customer"}
                  </h2>
                  <p>{notification.service?.name || "No service provided"}</p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Date:</span> {notification.date}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Time:</span> {notification.time}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Status:</span>{" "}
                    {notification.notificationStatus}
                  </p>
                </div>
                
                {notification.notificationStatus === "unread" && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                    title="Mark as read"
                  >
                    <CheckCircle className="h-5 w-5 mr-1" />
                    Mark as read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !loading &&
        !error && (
          <p className="text-center text-gray-500">No notifications available</p>
        )
      )}
    </div>
  );
};

export default Notifications;