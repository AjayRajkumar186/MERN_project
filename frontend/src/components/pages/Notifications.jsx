import React, { useEffect, useState } from "react";
import { FiTrash2, FiCheck, FiPhone, FiBellOff } from "react-icons/fi";
import { notificationService } from "../services/notification"; 
import Swal from "sweetalert2";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      // FIX: Changed data.notification to data.notifications (plural)
      // Added fallback empty array [] to prevent .length error
      setNotifications(data.notifications || []); 
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.updateNotification(id, { read: true });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      window.dispatchEvent(new Event("notificationCreated"));
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

 const handleDelete = async (id) => {
  // 1. Ask for confirmation
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#4f46e5", // indigo-600
    cancelButtonColor: "#ef4444", // red-500
    confirmButtonText: "Yes, delete it!",
  });

  // 2. If confirmed, proceed with API call
  if (result.isConfirmed) {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      window.dispatchEvent(new Event("notificationCreated"));
      
      // Optional: Success toast
      Swal.fire({
        title: "Deleted!",
        text: "Notification has been removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      Swal.fire("Error", "Failed to delete the notification.", "error");
    }
  }
};

const handleClearAll = async () => {
  const result = await Swal.fire({
    title: "Clear all notifications?",
    text: "This will permanently delete all your notifications!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#4f46e5",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, clear all!",
  });

  if (result.isConfirmed) {
    try {
      await notificationService.deleteAllNotification();
      setNotifications([]);
      window.dispatchEvent(new Event("notificationCreated"));
      
      Swal.fire({
        title: "Cleared!",
        text: "All notifications have been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      Swal.fire("Error", "Failed to clear notifications.", "error");
    }
  }
};

  if (loading) return <div className="text-center p-10 dark:text-white font-semibold">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">
            Notifications
          </h2>

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-600 font-medium cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10 text-gray-500 dark:text-gray-400">
            <FiBellOff size={48} className="mb-2" />
            <p className="text-center text-sm">No notifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item._id} // FIX: Changed id to _id
                className={`p-4 rounded-lg border transition-all ${
                  item.read
                    ? "bg-gray-100 dark:bg-gray-700 border-transparent"
                    : "bg-indigo-50 dark:bg-indigo-900 border-indigo-400"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold dark:text-white">
                    {item.name}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-sm mt-1 dark:text-gray-300 flex items-center gap-2">
                  <FiPhone className="text-indigo-500" />
                  {item.phone}
                </p>

                <p className="mt-2 dark:text-gray-200">
                  {item.message}
                </p>

                <div className="flex gap-4 mt-3">
                  {!item.read && (
                    <button
                      onClick={() => handleMarkAsRead(item._id)} // FIX: Changed id to _id
                      className="text-green-600 text-sm flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <FiCheck /> Mark as read
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(item._id)} // FIX: Changed id to _id
                    className="text-red-500 text-sm flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;