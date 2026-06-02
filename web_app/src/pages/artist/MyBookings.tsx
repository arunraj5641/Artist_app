import React, { useState, useMemo } from "react";
import { useBookings } from "../../hooks/useBookings";
import { AuthService } from "../../services/AuthService";
import { BookingService, type Booking } from "../../services/BookingService";
import {
  AlertCircle,
  Search,
  X,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  CalendarCheck,
  Trash2,
  IndianRupee,
} from "lucide-react";
import { motion } from "framer-motion";
import "./ArtistPages.css";
import { LayoutGrid, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const STATUS_FILTERS = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

const MyBookingsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const {
    bookings,
    meta,
    isLoading,
    error,
    updateBooking,
    isUpdating,
    deleteBooking,
    isDeleting,
  } = useBookings(page);

  const { data: statsResponse } = useQuery({
    queryKey: ["booking-stats"],
    queryFn: async () => {
      const res = await BookingService.getStats();
      return res;
    },
  });

  const stats = statsResponse?.data || {
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    revenue: 0,
  };

  const currentUser = AuthService.getCurrentUser();
  const isArtist = currentUser?.role === "artist";
  const isCustomer = currentUser?.role === "customer";

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const filtered: Booking[] = useMemo(() => {
    return bookings.filter((b: Booking) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q || b.status.toLowerCase().includes(q) || b.booking_date.includes(q);
      const matchStatus =
        statusFilter === "All" || b.status === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    updateBooking({ id: bookingId, data: { status: newStatus } });
  };

  const handleDelete = (bookingId: string) => {
    if (!window.confirm("Delete this booking? This cannot be undone.")) return;
    deleteBooking(bookingId);
  };

  const formatTime = (time: string) => {
    if (!time) return "—";

    const [hour, minute] = time.split(":").map(Number);

    const date = new Date();
    date.setHours(hour, minute);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <span>Loading bookings...</span>
      </div>
    );
  }

  return (
    <div className="artist-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-icon emerald">
            <Calendar size={18} />
          </div>
          <div>
            <h1>Booking</h1>
            <p>
              {isArtist
                ? "Review and approve booking requests"
                : "Track and manage your appointments"}
            </p>
          </div>
        </div>
        <div className="page-header-badge">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="view-toggle">
              <button
                className={`toggle-btn ${view === "grid" ? "active" : ""}`}
                onClick={() => setView("grid")}
              >
                <LayoutGrid size={16} />
              </button>

              <button
                className={`toggle-btn ${view === "list" ? "active" : ""}`}
                onClick={() => setView("list")}
              >
                <List size={16} />
              </button>
            </div>

            <div className="page-header-badge">
              <span className="label">Total</span>
              <span className="count">{stats.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-icon amber">
            <Clock size={18} />
          </div>
          <div>
            <p className="stat-label">Pending</p>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-icon blue">
            <CalendarCheck size={18} />
          </div>
          <div>
            <p className="stat-label">Confirmed</p>
            <p className="stat-value">{stats.confirmed}</p>
          </div>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-icon green">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="stat-label">Completed</p>
            <p className="stat-value">{stats.completed}</p>
          </div>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-icon purple">
            <IndianRupee size={18} />
          </div>
          <div>
            <p className="stat-label">Revenue</p>
            <p className="stat-value">₹{stats.revenue}</p>
          </div>
        </motion.div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>{String(error)}</span>
        </div>
      )}

      {/* Content Card */}
      <div className="content-card">
        <div className="toolbar">
          <div className="toolbar-search">
            <Search size={14} />
            <input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery("")}>
                <X size={14} />
              </button>
            )}
          </div>
          <div className="pills">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                className={`pill ${statusFilter === f ? "active" : ""}`}
                onClick={() => setStatusFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Calendar size={24} />
            </div>
            <p>
              {searchQuery || statusFilter !== "All"
                ? "No bookings match your filters"
                : "No bookings yet"}
            </p>
          </div>
        ) : view === "grid" ? (
          <div className="card-grid">
            {filtered.map((booking: Booking, i: number) => (
              <motion.div
                key={booking.id}
                className="item-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <div className="item-card-header">
                  <div>
                    <p className="item-card-title">
                      {booking.service?.name || "Service Booking"}
                    </p>

                    <p className="item-card-subtitle">
                      {isArtist
                        ? `Customer: ${booking.customer?.name || booking.customer?.email || "Unknown"}`
                        : `Artist: ${booking.artist?.name || booking.artist?.email || "Unknown"}`}
                    </p>

                    <p className="item-card-meta">
                      {new Date(booking.booking_date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  <span className={`badge ${booking.status}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="detail-compact">
                  <span className="detail-chip">
                    ⏰ {formatTime(booking.start_time)} →{" "}
                    {formatTime(booking.end_time)}
                  </span>

                  <span className="detail-chip">₹{booking.total_amount}</span>
                </div>
                <div className="item-card-footer">
                  <span className="meta-item">
                    <Calendar size={11} />
                    Created{" "}
                    {new Date(booking.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  <div className="actions-row">
                    {/* ── ARTIST ACTIONS: approve pending bookings ── */}
                    {isArtist && booking.status === "pending" && (
                      <button
                        className="icon-btn edit"
                        title="Approve Request"
                        onClick={() =>
                          handleStatusChange(booking.id, "confirmed")
                        }
                        disabled={isUpdating}
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    {isArtist && booking.status === "confirmed" && (
                      <button
                        className="icon-btn edit"
                        title="Mark Complete"
                        onClick={() =>
                          handleStatusChange(booking.id, "completed")
                        }
                        disabled={isUpdating}
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    {isArtist &&
                      (booking.status === "pending" ||
                        booking.status === "confirmed") && (
                        <button
                          className="icon-btn delete"
                          title="Cancel Booking"
                          onClick={() =>
                            handleStatusChange(booking.id, "cancelled")
                          }
                          disabled={isUpdating}
                        >
                          <XCircle size={14} />
                        </button>
                      )}

                    {/* ── CUSTOMER ACTIONS: cancel or delete ── */}
                    {isCustomer && booking.status === "pending" && (
                      <button
                        className="icon-btn delete"
                        title="Cancel Booking"
                        onClick={() =>
                          handleStatusChange(booking.id, "cancelled")
                        }
                        disabled={isUpdating}
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                    {isCustomer && (
                      <button
                        className="icon-btn delete"
                        title="Delete Booking"
                        onClick={() => handleDelete(booking.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bookings-table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>{isArtist ? "Customer" : "Artist"}</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((booking) => (
                  <tr key={booking.id} className="booking-row">
                    {/* SERVICE */}
                    <td>
                      <div className="booking-cell-main">
                        <p className="booking-name">
                          {booking.service?.name || "Service"}
                        </p>
                        <p className="booking-sub">
                          {booking.service?.duration_minutes || 0} min
                        </p>
                      </div>
                    </td>

                    {/* PERSON */}
                    <td>
                      {isArtist
                        ? booking.customer?.name ||
                          booking.customer?.email ||
                          "Unknown"
                        : booking.artist?.name ||
                          booking.artist?.email ||
                          "Unknown"}
                    </td>

                    {/* DATE */}
                    <td>
                      {new Date(booking.booking_date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </td>

                    {/* TIME */}
                    <td>
                      {formatTime(booking.start_time)} →{" "}
                      {formatTime(booking.end_time)}
                    </td>

                    {/* STATUS */}
                    <td>
                      <span className={`badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>

                    {/* AMOUNT */}
                    <td>₹{booking.total_amount || 0}</td>

                    {/* ACTIONS */}
                    <td>
                      <div className="booking-actions">
                        {isArtist && booking.status === "pending" && (
                          <button
                            onClick={() =>
                              handleStatusChange(booking.id, "confirmed")
                            }
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}

                        {isArtist && booking.status === "confirmed" && (
                          <button
                            onClick={() =>
                              handleStatusChange(booking.id, "completed")
                            }
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}

                        {(isArtist || isCustomer) &&
                          (booking.status === "pending" ||
                            booking.status === "confirmed") && (
                            <button
                              onClick={() =>
                                handleStatusChange(booking.id, "cancelled")
                              }
                            >
                              <XCircle size={14} />
                            </button>
                          )}

                        {isCustomer && (
                          <button
                            className="icon-btn delete"
                            type="button"
                            title="Delete Booking"
                            aria-label="Delete booking"
                            onClick={() => handleDelete(booking.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta?.total_pages > 1 && (
          <div className="pagination-footer">
            <span>
              Page {meta?.current_page} of {meta?.total_pages} —{" "}
              {meta?.total_count} total bookings
            </span>

            <div className="pagination">
              <button
                disabled={!meta?.prev_page}
                onClick={() => setPage(page - 1)}
              >
                ‹
              </button>

              {Array.from({ length: meta?.total_pages || 0 }, (_, i) => (
                <button
                  key={i}
                  className={meta?.current_page === i + 1 ? "active" : ""}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={!meta?.next_page}
                onClick={() => setPage(page + 1)}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
