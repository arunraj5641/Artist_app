import React, { useMemo } from "react";
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
interface DashboardStats {
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  total_services: number;
  total_revenue: string | number;
  upcoming_bookings_count: number;
  recent_bookings: {
    id: string;
    customer_name: string;
    service_name: string;
    total_amount: string | number;
    status: string;
  }[];
}

import { MOCK_STATS, MOCK_RECENT_BOOKINGS } from "../../constants/mocks";
import StatCard from "../../components/dashboard/StatCard";
import BookingCard from "../../components/dashboard/BookingCard";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning 🌅";
  if (hour < 17) return "Good Afternoon ☀️";
  return "Good Evening 🌙";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function HomeScreen() {
  const {
    data: apiData,
    loading,
    error,
    reload,
  } = useResource<{ stats: DashboardStats }>("/dashboard/artist");

  const stats = apiData?.stats;

  // Merge: use API values when available, otherwise fall back to mock
  const totalBookings = stats?.total_bookings ?? MOCK_STATS.total_bookings;
  const pendingBookings =
    stats?.pending_bookings ?? MOCK_STATS.pending_bookings;
  const totalServices = stats?.total_services ?? MOCK_STATS.total_services;
  const totalRevenue = stats?.total_revenue ?? MOCK_STATS.total_revenue;

  const recentBookings = useMemo(() => {
    if (stats?.recent_bookings?.length) {
      return stats.recent_bookings.map((b) => ({
        id: b.id,
        customerName: b.customer_name,
        serviceName: b.service_name,
        amount: Number(b.total_amount),
        status: b.status,
      }));
    }
    return MOCK_RECENT_BOOKINGS;
  }, [stats]);

  const overviewStats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: "calendar" as const,
      color: "#3b82f6",
    },
    {
      label: "Pending",
      value: pendingBookings,
      icon: "time" as const,
      color: "#f59e0b",
    },
    {
      label: "Services",
      value: totalServices,
      icon: "brush" as const,
      color: "#22c55e",
    },
    {
      label: "Revenue",
      value: `₹${Number(totalRevenue).toLocaleString()}`,
      icon: "cash" as const,
      color: "#a855f7",
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-dark-900"
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0b1120" />

      {/* ── Header ── */}
      <View className="px-5 pt-14 pb-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-slate-400 text-xs">{getGreeting()}</Text>
            <Text className="text-white text-2xl font-extrabold mt-0.5">
              Dashboard
            </Text>
          </View>
          <View className="flex-row items-center gap-x-3">
            {/* Live / syncing indicator */}
            {loading && <ActivityIndicator size="small" color="#4a7cf5" />}
            {error && !loading && (
              <TouchableOpacity onPress={reload}>
                <Ionicons name="refresh-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            )}
            <TouchableOpacity className="w-10 h-10 rounded-full bg-dark-700 items-center justify-center border border-white/5">
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#94a3b8"
              />
              <View className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-accent" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-accent items-center justify-center border border-white/10">
              <Text className="text-white text-sm font-bold">
                {getInitials("User")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Welcome Banner ── */}
      <View
        className="mx-5 mb-6 rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#4a7cf5" }}
      >
        <View className="p-5">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">
                Welcome back! ✨
              </Text>
              <Text className="text-white/70 text-xs mt-1">
                {pendingBookings > 0
                  ? `You have ${pendingBookings} pending booking requests waiting.`
                  : "You're all caught up! No new requests."}
              </Text>
              <TouchableOpacity
                className="mt-3 bg-white/20 self-start px-4 py-2 rounded-lg flex-row items-center gap-x-1"
                activeOpacity={0.7}
              >
                <Text className="text-white text-xs font-bold">
                  View Requests
                </Text>
                <Ionicons name="arrow-forward" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
            <View className="w-14 h-14 rounded-2xl bg-white/10 items-center justify-center ml-3">
              <Ionicons name="sparkles" size={28} color="#fff" />
            </View>
          </View>
        </View>
        <View style={{ height: 6, backgroundColor: "rgba(0,0,0,0.1)" }} />
      </View>

      {/* ── Overview ── */}
      <View className="px-5 mb-6">
        <Text className="text-white text-base font-bold mb-3">Overview</Text>
        <View className="flex-row flex-wrap justify-between">
          {overviewStats.map((stat) => (
            <StatCard
              key={stat.label}
              title={stat.label}
              value={stat.value}
              icon={stat.icon}
              accentColor={stat.color}
              borderColor={stat.color}
              className="w-[48%]"
            />
          ))}
        </View>
      </View>

      {/* ── Recent Bookings ── */}
      <View className="px-5 mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-base font-bold">
            Recent Bookings
          </Text>
          <TouchableOpacity className="flex-row items-center gap-x-1">
            <Text className="text-accent text-xs font-semibold">View All</Text>
            <Ionicons name="chevron-forward" size={14} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {recentBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            variant="compact"
            customerName={booking.customerName}
            serviceName={booking.serviceName}
            amount={booking.amount}
            status={booking.status}
          />
        ))}
      </View>

      {/* Bottom spacer for tab bar */}
      <View className="h-24" />
    </ScrollView>
  );
}
