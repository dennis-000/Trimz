// NotificationIcon.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BellIcon } from "lucide-react";
import { useEffect } from "react";
// import { BASE_URL } from "../../config";

const NotificationIcon = () => {
  const { user, unreadCount, refreshNotifications } = useAuth();
  const isProvider = user && user.role === "provider";
  const navigate = useNavigate();

  useEffect(() => {
    if (isProvider && user?._id) {
      refreshNotifications(); // Initial fetch when component mounts
    }
  }, [isProvider, user?._id, refreshNotifications]);

  const handleIconClick = () => {
    navigate("/notifications");
  };

  return (
    isProvider && (
      <div className="relative cursor-pointer" onClick={handleIconClick}>
        <BellIcon className="text-gray-600 hover:text-black" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
    )
  );
};

export default NotificationIcon;