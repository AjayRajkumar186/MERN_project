import { useEffect, useState } from "react";
import {
  FiTrash2,
  FiCheck,
  FiPhone,
  FiBellOff,
  FiBell,
  FiClock,
  FiX,
} from "react-icons/fi";
import { notificationService } from "../services/notification";
import Swal from "sweetalert2";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
      setTimeout(() => setMounted(true), 50);
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
    const result = await Swal.fire({
      title: "Delete notification?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
      background: "#0d0f16",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await notificationService.deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        window.dispatchEvent(new Event("notificationCreated"));
        Swal.fire({
          title: "Deleted!",
          text: "Notification has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#0d0f16",
          color: "#fff",
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
      text: "This will permanently delete everything!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear all!",
      background: "#0d0f16",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await notificationService.deleteAllNotification();
        setNotifications([]);
        window.dispatchEvent(new Event("notificationCreated"));
        Swal.fire({
          title: "Cleared!",
          text: "All notifications deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#0d0f16",
          color: "#fff",
        });
      } catch (error) {
        console.error("Error deleting all notifications:", error);
        Swal.fire("Error", "Failed to clear notifications.", "error");
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080a0f] flex flex-col items-center justify-center gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-sm text-white/30 tracking-widest uppercase">Loading notifications</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#080a0f] py-10 px-4 overflow-hidden">

      {/* Blobs */}
      <div className="absolute -top-15 -left-20 w-72 h-72 bg-indigo-500 rounded-full blur-[110px] opacity-[0.08] pointer-events-none" />
      <div className="absolute -bottom-15 -right-20 w-64 h-64 bg-violet-600 rounded-full blur-[100px] opacity-[0.08] pointer-events-none" />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Header */}
        <div
          className={`flex items-center justify-between mb-8 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <p className="text-[11px] font-medium tracking-[4px] uppercase text-indigo-400 mb-1">
              Admin Panel
            </p>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 text-xs font-bold">
                  <FiBell size={11} /> {unreadCount} new
                </span>
              )}
            </div>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/35 transition-all duration-200"
            >
              <FiX size={13} /> Clear All
            </button>
          )}
        </div>

        {/* Empty state */}
        {notifications.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center py-28 gap-4 transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <FiBellOff size={26} className="text-white/20" />
            </div>
            <div className="text-center">
              <p className="text-white/40 text-sm font-medium">No notifications</p>
              <p className="text-white/20 text-xs mt-1">You're all caught up!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item, idx) => (
              <div
                key={item._id}
                className={`group relative rounded-2xl border overflow-hidden transition-all duration-500 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                } ${
                  item.read
                    ? "bg-white/2 border-white/6 hover:border-white/10"
                    : "bg-indigo-500/5 border-indigo-500/25 hover:border-indigo-500/40"
                }`}
                style={{ transitionDelay: `${80 + idx * 60}ms` }}
              >
                {/* Unread accent */}
                {!item.read && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />
                )}

                {/* Unread dot */}
                {!item.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
                )}

                <div className="p-5">
                  {/* Top row */}
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        item.read
                          ? "bg-white/5 text-white/30 border border-white/[0.07]"
                          : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                      }`}>
                        {item.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${item.read ? "text-white/60" : "text-white/90"}`}>
                          {item.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <FiPhone size={10} className="text-indigo-400/60" />
                          <span className="text-[11px] text-white/35">{item.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-white/25 shrink-0">
                      <FiClock size={9} />
                      {new Date(item.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  <p className={`text-sm leading-relaxed pl-10.5 mb-4 ${
                    item.read ? "text-white/35" : "text-white/60"
                  }`}>
                    {item.message}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pl-10.5">
                    {!item.read && (
                      <button
                        onClick={() => handleMarkAsRead(item._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/35 transition-all duration-200"
                      >
                        <FiCheck size={11} /> Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/35 transition-all duration-200"
                    >
                      <FiTrash2 size={11} /> Delete
                    </button>
                  </div>
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