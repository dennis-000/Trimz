import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";


const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user._id) return; // Wait until user is available
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${BASE_URL}notifications/${user._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include Authorization header if required:
            // Authorization: `Bearer ${yourToken}`,
          },
        });
        const data = await res.json();

        // If your API wraps the results in a data property, adjust here:
        const fetchedNotifications = Array.isArray(data)
          ? data
          : data.data || [];
        setNotifications(fetchedNotifications);

        // Mark notifications as read using Promise.all
        await Promise.all(
          fetchedNotifications.map((notification) =>
            fetch(`${BASE_URL}notifications/${notification._id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                // Include Authorization header if required:
                // Authorization: `Bearer ${yourToken}`,
              },
            })
          )
        );
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!loading && !error && notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className="p-4 mb-4 bg-white rounded-lg shadow-md border"
            >
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
            </li>
          ))}
        </ul>
      ) : (
        !loading &&
        !error && <p className="text-center text-gray-500">No notifications available</p>
      )}
    </div>
  );
};

export default Notifications;