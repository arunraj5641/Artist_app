import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ServiceCardProps {
  name: string;
  artist?: string;
  description?: string;
  price: string | number;
  duration: string;
  timesBooked?: number;
  rating: number;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  iconColor?: string;
  onPress?: () => void;
}

export default function ServiceCard({
  name,
  artist,
  description,
  price,
  duration,
  timesBooked,
  rating,
  icon = "sparkles",
  iconColor = "#3b82f6",
  onPress,
}: ServiceCardProps) {
  return (
    <TouchableOpacity
      className="bg-dark-700 rounded-2xl p-4 mb-3 border border-white/5"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start gap-x-3 mb-3">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${iconColor}18` }}
        >
          <Ionicons name={icon as any} size={20} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="text-white text-sm font-bold" numberOfLines={1}>
            {name}
          </Text>
          {description && (
            <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={2}>
              {description}
            </Text>
          )}
          {artist && (
            <View className="flex-row items-center gap-x-1 mt-1">
              <Ionicons name="brush-outline" size={11} color="#64748b" />
              <Text className="text-slate-400 text-xs">{artist}</Text>
            </View>
          )}
        </View>
      </View>

      <View className="flex-row items-center gap-x-4 mb-3">
        <View className="flex-row items-center gap-x-1.5">
          <Ionicons name="time-outline" size={13} color="#64748b" />
          <Text className="text-slate-400 text-xs">{duration}</Text>
        </View>
        {timesBooked !== undefined && (
          <View className="flex-row items-center gap-x-1.5">
            <Ionicons name="calendar-outline" size={13} color="#64748b" />
            <Text className="text-slate-400 text-xs">{timesBooked} booked</Text>
          </View>
        )}
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-accent text-base font-extrabold">
          {typeof price === "number" ? `₹${price.toLocaleString()}` : price}
        </Text>
        <View className="flex-row items-center gap-x-2">
          <View className="flex-row items-center gap-x-0.5">
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text className="text-slate-400 text-xs font-semibold">
              {rating}
            </Text>
          </View>
          <TouchableOpacity className="flex-row items-center gap-x-1 ml-2">
            <Text className="text-accent text-xs font-semibold">
              View Details
            </Text>
            <Ionicons name="arrow-forward" size={12} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
