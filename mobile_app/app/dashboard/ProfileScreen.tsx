import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import storage from "../../services/storage";
import { useResource } from "../../hooks/useResource";
import { MOCK_ARTIST as ARTIST } from "../../constants/mocks";
import StatCard from "../../components/dashboard/StatCard";

interface DashboardStats {
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  average_rating: number;
  total_revenue: number;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function ProfileScreen() {
  const router = useRouter();
  const { data: apiData } = useResource<{ stats: DashboardStats }>(
    "/dashboard/artist",
  );
  const stats = apiData?.stats;

  // Merge: prioritize API values, otherwise fall back to mock
  const totalBookings = stats?.total_bookings ?? ARTIST.bookings;
  const rating = stats?.average_rating ?? ARTIST.rating;
  const completedBookings = stats?.completed_bookings ?? 116;

  const profileStats = [
    {
      label: "Bookings",
      value: totalBookings,
      icon: "calendar" as const,
      color: "#3b82f6",
      trend: "+12% this month",
      trendPositive: true,
    },
    {
      label: "Done",
      value: completedBookings,
      icon: "checkmark-done" as const,
      color: "#22c55e",
      trend: "+8% growth",
      trendPositive: true,
    },
    {
      label: "Rating",
      value: rating,
      icon: "star" as const,
      color: "#f59e0b",
      trend: "Top 5% Artist",
      trendPositive: true,
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-dark-900"
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0b1120" />

      {/* Profile Header */}
      <View className="pt-14 pb-8 items-center bg-dark-800 rounded-b-[40px] border-b border-white/5">
        <View className="relative">
          <View className="w-24 h-24 rounded-[32px] bg-accent items-center justify-center border-4 border-dark-900 overflow-hidden">
            <Text className="text-white text-3xl font-extrabold">
              {getInitials(ARTIST.name)}
            </Text>
          </View>
          <TouchableOpacity className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white items-center justify-center shadow-lg border-2 border-dark-900">
            <Ionicons name="camera" size={16} color="#0f172a" />
          </TouchableOpacity>
        </View>

        <Text className="text-white text-2xl font-extrabold mt-4">
          {ARTIST.name}
        </Text>
        <View className="flex-row items-center gap-x-2 mt-1">
          <Ionicons name="brush-outline" size={14} color="#64748b" />
          <Text className="text-slate-400 text-sm font-medium">
            {ARTIST.title}
          </Text>
        </View>

        <View className="flex-row items-center gap-x-1.5 mt-3 bg-success/10 px-3 py-1 rounded-full">
          <View className="w-2 h-2 rounded-full bg-success" />
          <Text className="text-success text-[10px] font-bold uppercase tracking-wider">
            Verified Artist
          </Text>
        </View>

        <View className="px-10 mt-5">
          <Text className="text-slate-400 text-xs text-center leading-5 italic">
            "{ARTIST.bio}"
          </Text>
        </View>

        <View className="flex-row items-center gap-x-1 mt-4">
          <Ionicons name="location-sharp" size={12} color="#64748b" />
          <Text className="text-slate-500 text-[10px] font-medium">
            {ARTIST.location}
          </Text>
        </View>
      </View>

      {/* Stats Bar */}
      <View className="-mt-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4 }}
        >
          <View className="flex-row gap-x-3">
            {profileStats.map((stat) => (
              <StatCard
                key={stat.label}
                title={stat.label}
                value={stat.value}
                icon={stat.icon}
                accentColor={stat.color}
                borderColor={stat.color}
                trend={stat.trend}
                trendPositive={stat.trendPositive}
                className="w-44"
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Account Section */}
      <View className="mx-5 mt-8">
        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">
          Account
        </Text>
        <View className="bg-dark-700 rounded-2xl overflow-hidden border border-white/5">
          <TouchableOpacity className="flex-row items-center p-4 gap-x-3 border-b border-white/5">
            <View className="w-9 h-9 rounded-xl bg-accent/10 items-center justify-center">
              <Ionicons name="person-sharp" size={18} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-semibold">
                Edit Profile
              </Text>
              <Text className="text-slate-500 text-[10px]">
                Update your personal details
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#334155" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 gap-x-3 border-b border-white/5">
            <View className="w-9 h-9 rounded-xl bg-purple-500/10 items-center justify-center">
              <Ionicons name="images-sharp" size={18} color="#a855f7" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-semibold">
                Portfolio
              </Text>
              <Text className="text-slate-500 text-[10px]">
                Manage your work gallery
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#334155" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 gap-x-3">
            <View className="w-9 h-9 rounded-xl bg-slate-500/10 items-center justify-center">
              <Ionicons name="settings-sharp" size={18} color="#94a3b8" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-semibold">Settings</Text>
              <Text className="text-slate-500 text-[10px]">
                App preferences & security
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#334155" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Business Section */}
      <View className="mx-5 mt-5">
        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">
          Business
        </Text>
        <View className="bg-dark-700 rounded-2xl overflow-hidden border border-white/5">
          <TouchableOpacity className="flex-row items-center p-4 gap-x-3">
            <View className="w-9 h-9 rounded-xl bg-orange-500/10 items-center justify-center">
              <Ionicons name="wallet-sharp" size={18} color="#f59e0b" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-semibold">Earnings</Text>
              <Text className="text-slate-500 text-[10px]">
                View income & payouts
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#334155" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout */}
      <View className="mx-5 mt-5">
        <View className="bg-dark-700 rounded-2xl overflow-hidden border border-white/5">
          <TouchableOpacity
            className="flex-row items-center p-4 gap-x-3"
            onPress={async () => {
              await storage.clear();
              router.replace("/");
            }}
          >
            <View className="w-9 h-9 rounded-xl bg-red-500/10 items-center justify-center">
              <Ionicons name="log-out-sharp" size={18} color="#ef4444" />
            </View>
            <View className="flex-1">
              <Text className="text-red-500 text-sm font-semibold">Logout</Text>
              <Text className="text-slate-500 text-[10px]">
                Sign out of your account
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="h-24" />
    </ScrollView>
  );
}
