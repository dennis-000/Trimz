import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BellIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {BASE_URL} from '../../config'

const NotificationIcon = () => {
  const { user } = useAuth();
  const isProvider = user && user.role === "provider";
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        if (isProvider) {
          const res = await fetch(`${BASE_URL}/notifications/${user._id}`);
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await res.json();
          setUnreadCount(data.length);
        }
      } catch (err) {
        console.error("Error fetching unread notifications:", err);
      }
    };
    fetchUnreadCount();
  }, [isProvider, user._id]);

  const handleIconClick = () => {
    navigate("/notifications");
  };

  return (
    <>
      {isProvider && (
        <div className="relative">
          <BellIcon
            className="text-gray-600 hover:text-black cursor-pointer"
            onClick={handleIconClick}
          />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationIcon;
