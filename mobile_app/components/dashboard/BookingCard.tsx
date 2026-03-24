import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { STATUS_COLORS } from "../../constants/mocks";

interface BookingCardProps {
  customerName: string;
  serviceName: string;
  artistName?: string;
  avatarInitials?: string;
  date?: string;
  time?: string;
  amount: string | number;
  status: string;
  variant?: "full" | "compact";
  onPress?: () => void;
}

export default function BookingCard({
  customerName,
  serviceName,
  artistName,
  avatarInitials,
  date,
  time,
  amount,
  status,
  variant = "full",
  onPress,
}: BookingCardProps) {
  const config = STATUS_COLORS[status.toLowerCase()] || STATUS_COLORS.pending;

  if (variant === "compact") {
    return (
      <TouchableOpacity
        className="bg-dark-700 rounded-2xl p-4 mb-3 border border-white/5"
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full items-center justify-center mr-3 bg-dark-600">
            <Text className="text-white text-xs font-bold">
              {avatarInitials || customerName.charAt(0)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-sm font-semibold">
              {customerName}
            </Text>
            <Text className="text-slate-400 text-xs mt-0.5">{serviceName}</Text>
          </View>
          <View className="items-end">
            <Text className="text-white text-sm font-extrabold">
              ₹{Number(amount).toLocaleString()}
            </Text>
            <View className="flex-row items-center gap-x-1 mt-1">
              <View
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: config.dot }}
              />
              <Text
                className="text-xs font-semibold capitalize"
                style={{ color: config.text }}
              >
                {status.toLowerCase()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className="bg-dark-700 rounded-2xl p-4 mb-3 border border-white/5"
      style={{ borderLeftWidth: 3, borderLeftColor: config.dot }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-full items-center justify-center mr-3 bg-dark-600">
          <Text className="text-white text-xs font-bold">
            {avatarInitials || customerName.charAt(0)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-white text-sm font-bold">{customerName}</Text>
          <Text className="text-slate-400 text-xs mt-0.5">{serviceName}</Text>
        </View>
        <View
          className="flex-row items-center gap-x-1.5 px-2.5 py-1 rounded-full"
          style={{ backgroundColor: config.bg }}
        >
          <View
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: config.dot }}
          />
          <Text
            className="text-[10px] font-semibold uppercase"
            style={{ color: config.text }}
          >
            {status.toLowerCase()}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-x-4 mb-3">
        <View className="flex-row items-center gap-x-1.5">
          <Ionicons name="calendar-outline" size={13} color="#64748b" />
          <Text className="text-slate-300 text-xs">{date}</Text>
        </View>
        <View className="flex-row items-center gap-x-1.5">
          <Ionicons name="time-outline" size={13} color="#64748b" />
          <Text className="text-slate-300 text-xs">{time}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center pt-2 border-t border-white/5">
        <Text className="text-slate-500 text-[10px]">
          {artistName ? `Artist: ${artistName}` : ""}
        </Text>
        <Text className="text-accent text-base font-extrabold">
          ₹{Number(amount).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
