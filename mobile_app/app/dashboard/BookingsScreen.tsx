import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useResource } from "../../hooks/useResource";

// ── Types ──
interface ApiBooking {
  id: string;
  customer_name: string;
  service_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total_amount: string | number;
  created_at: string;
}

interface DashboardStats {
  pending_bookings: number;
  completed_bookings: number;
  upcoming_bookings_count: number;
}

import {
  MOCK_BOOKINGS,
  MOCK_SUMMARY,
  STATUS_FILTERS,
} from "../../constants/mocks";
import StatCard from "../../components/dashboard/StatCard";
import FilterChips from "../../components/dashboard/FilterChips";
import BookingCard from "../../components/dashboard/BookingCard";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr: string) {
  if (!timeStr) return "";
  try {
    return new Date(timeStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timeStr;
  }
}

export default function BookingsScreen() {
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch artist bookings from API
  const {
    data: bookingsResp,
    loading: bookingsLoading,
    error: bookingsError,
    reload,
  } = useResource<{ data: ApiBooking[] }>("/bookings/artist_bookings");

  // Fetch dashboard stats from API (for summary cards)
  const { data: dashboardResp, loading: statsLoading } = useResource<{
    stats: DashboardStats;
  }>("/dashboard/artist");

  const stats = dashboardResp?.stats;

  // Normalise API bookings → display shape; fall back to mock if API is empty
  const bookings = useMemo(() => {
    const raw = bookingsResp?.data;
    if (raw && raw.length > 0) {
      return raw.map((b) => ({
        id: b.id,
        customerName: b.customer_name,
        serviceName: b.service_name,
        bookingDate: formatDate(b.booking_date),
        startTime: formatTime(b.start_time),
        endTime: formatTime(b.end_time),
        status: b.status.toLowerCase(),
        totalAmount: Number(b.total_amount),
        createdAt: formatDate(b.created_at),
        avatarInitials:
          b.customer_name
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "?",
      }));
    }
    return MOCK_BOOKINGS; // Show mock while loading or if DB is empty
  }, [bookingsResp]);

  const summaryStats = [
    {
      label: "Upcoming",
      icon: "calendar-outline" as const,
      color: "#3b82f6",
      count:
        stats?.upcoming_bookings_count ?? MOCK_SUMMARY.upcoming_bookings_count,
    },
    {
      label: "Pending",
      icon: "time-outline" as const,
      color: "#f59e0b",
      count: stats?.pending_bookings ?? MOCK_SUMMARY.pending_bookings,
    },
    {
      label: "Done",
      icon: "checkmark-done-outline" as const,
      color: "#22c55e",
      count: stats?.completed_bookings ?? MOCK_SUMMARY.completed_bookings,
    },
  ];

  const filtered = useMemo(
    () =>
      bookings.filter(
        (b) =>
          statusFilter === "All" || b.status === statusFilter.toLowerCase(),
      ),
    [bookings, statusFilter],
  );

  return (
    <ScrollView
      className="flex-1 bg-dark-900"
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0b1120" />

      {/* Header */}
      <View className="px-5 pt-14 pb-2">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-white text-2xl font-extrabold">Bookings</Text>
            <Text className="text-slate-500 text-xs mt-1">
              {bookings.length} total appointments
            </Text>
          </View>
          <View className="flex-row items-center gap-x-2">
            {/* Live sync indicator */}
            {bookingsLoading && (
              <ActivityIndicator size="small" color="#4a7cf5" />
            )}
            {bookingsError && !bookingsLoading && (
              <TouchableOpacity onPress={reload}>
                <Ionicons name="refresh-outline" size={18} color="#ef4444" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-accent items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Summary Stats */}
      <View className="flex-row mx-5 mt-4 mb-4 gap-x-3">
        {summaryStats.map((stat) => (
          <StatCard
            key={stat.label}
            title={stat.label}
            value={stat.count}
            icon={stat.icon}
            accentColor={stat.color}
            borderColor={stat.color}
            className="flex-1"
          />
        ))}
      </View>

      {/* Filter Chips */}
      <View className="mb-4 px-5">
        <FilterChips
          options={STATUS_FILTERS}
          selected={statusFilter}
          onSelect={setStatusFilter}
        />
      </View>

      {/* Section Title */}
      <View className="px-5 flex-row justify-between items-center mb-3">
        <Text className="text-white text-base font-bold">
          {statusFilter === "All" ? "All Bookings" : `${statusFilter} Bookings`}
        </Text>
        <Text className="text-slate-500 text-xs">
          {filtered.length} results
        </Text>
      </View>

      {/* Booking Cards */}
      <View className="px-5">
        {filtered.length === 0 ? (
          <View className="items-center justify-center py-16 gap-y-3">
            <Ionicons name="calendar-outline" size={48} color="#334155" />
            <Text className="text-slate-500 text-base">No bookings found</Text>
            <Text className="text-slate-600 text-xs">
              Try adjusting your filters
            </Text>
          </View>
        ) : (
          filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              variant="full"
              customerName={booking.customerName}
              serviceName={booking.serviceName}
              avatarInitials={booking.avatarInitials}
              date={booking.bookingDate}
              time={`${booking.startTime} – ${booking.endTime}`}
              amount={booking.totalAmount}
              status={booking.status}
            />
          ))
        )}
      </View>

      {/* Bottom spacer */}
      <View className="h-24" />
    </ScrollView>
  );
}
