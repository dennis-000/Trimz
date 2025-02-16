import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {BASE_URL} from '../config'
const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${BASE_URL}notifications/${user._id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setNotifications(data);

        // Mark notifications as read
        data.forEach(async (notification) => {
          await fetch(`${BASE_URL}notifications/${notification._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          });
        });
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, [user._id]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li
              key={notification._id}
              className="p-4 mb-4 bg-white rounded-lg shadow-md border"
            >
              <h2 className="text-lg font-bold">
                {notification.customer.name}
              </h2>
              <p>{notification.service.name}</p>
              <p className="text-gray-600">
                <span className="font-semibold">Date:</span>{" "}
                {notification.date}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Time:</span>{" "}
                {notification.time}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Status:</span>{" "}
                {notification.notificationStatus}
              </p>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No notifications available</li>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
