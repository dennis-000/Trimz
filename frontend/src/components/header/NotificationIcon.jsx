import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BellIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../config";

const NotificationIcon = () => {
  const { user } = useAuth();
  const isProvider = user && user.role === "provider";
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!isProvider || !user?._id) return;

      try {
        const res = await fetch(`${BASE_URL}notifications/${user._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        
        const data = await res.json();
        setUnreadCount(data.length);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchUnreadCount();
  }, [isProvider, user?._id]);

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
