import { useEffect, useState } from "react";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../services/notification.service";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotifications();

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data ?? [];

      setNotifications(data);
    } catch (err) {
      console.error("NOTIFICATIONS API ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notification_id === notificationId
            ? { ...notification, is_read: 1 }
            : notification
        )
      );
    } catch (err) {
      console.error("MARK AS READ ERROR:", err);

      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to mark notification as read."
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: 1,
        }))
      );
    } catch (err) {
      console.error("MARK ALL AS READ ERROR:", err);

      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to mark notifications as read."
      );
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification.notification_id !== notificationId
        )
      );
    } catch (err) {
      console.error("DELETE NOTIFICATION ERROR:", err);

      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to delete notification."
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  if (loading) {
    return (
      <div className="p-6 text-sm text-[#85786D]">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#2B2622]">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Stay updated with important alerts and activities.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="rounded-xl border border-[#E7DED3] bg-white px-4 py-2.5 text-sm font-medium text-[#6F3E32] hover:bg-[#FCFAF8]"
          >
            Mark all as read
          </button>
        )}

      </div>

      {/* NOTIFICATIONS */}
      <div className="overflow-hidden rounded-2xl border border-[#E7DED3] bg-white">

        {notifications.length === 0 ? (
          <div className="px-6 py-16 text-center">

            <div className="text-4xl">
              🔔
            </div>

            <h3 className="mt-4 text-base font-semibold text-[#2B2622]">
              No notifications
            </h3>

            <p className="mt-1 text-sm text-[#85786D]">
              You're all caught up.
            </p>

          </div>
        ) : (
          <div>

            {notifications.map((notification) => {

              const isUnread = !notification.is_read;

              return (
                <div
                  key={notification.notification_id}
                  className={`flex items-start justify-between gap-4 border-b border-[#F0E9E2] px-6 py-5 last:border-0 ${
                    isUnread
                      ? "bg-[#FCFAF8]"
                      : "bg-white"
                  }`}
                >

                  <div className="flex min-w-0 gap-4">

                    {/* ICON */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        isUnread
                          ? "bg-[#F6EBD4]"
                          : "bg-[#F3F0ED]"
                      }`}
                    >
                      🔔
                    </div>

                    {/* CONTENT */}
                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <h3 className="text-sm font-semibold text-[#2B2622]">
                          {notification.title}
                        </h3>

                        {isUnread && (
                          <span className="h-2 w-2 rounded-full bg-[#6F3E32]" />
                        )}

                      </div>

                      <p className="mt-1 text-sm leading-6 text-[#85786D]">
                        {notification.message}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-[#A0958B]">

                        <span>
                          {notification.notification_type}
                        </span>

                        <span>•</span>

                        <span>
                          {notification.created_at
                            ? new Date(
                                notification.created_at
                              ).toLocaleString()
                            : "—"}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="flex shrink-0 items-center gap-2">

                    {isUnread && (
                      <button
                        onClick={() =>
                          handleMarkAsRead(
                            notification.notification_id
                          )
                        }
                        className="rounded-lg border border-[#E7DED3] px-3 py-1.5 text-xs font-medium text-[#6F3E32] hover:bg-[#FCFAF8]"
                      >
                        Mark read
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleDelete(
                          notification.notification_id
                        )
                      }
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
};

export default Notifications;