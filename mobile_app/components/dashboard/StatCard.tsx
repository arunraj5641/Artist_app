import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentProps<typeof Ionicons>["name"] | React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  accentColor?: string;
  borderColor?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendPositive,
  accentColor,
  borderColor,
  className = "",
}: StatCardProps) {
  const renderIcon = () => {
    if (typeof icon === "string") {
      return (
        <Ionicons
          name={icon as any}
          size={20}
          color={accentColor || "#3b82f6"}
        />
      );
    }
    return icon;
  };

  return (
    <View
      className={`bg-dark-700 rounded-2xl p-4 mb-3 border border-white/5 ${className}`}
      style={{
        borderLeftWidth: borderColor ? 4 : 0,
        borderLeftColor: borderColor,
      }}
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mb-2"
        style={{
          backgroundColor: accentColor
            ? `${accentColor}18`
            : "rgba(59, 130, 246, 0.1)",
        }}
      >
        {renderIcon()}
      </View>
      <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
        {title}
      </Text>
      <Text className="text-white text-xl font-extrabold mt-0.5">{value}</Text>
      {trend && (
        <View
          className={`mt-2 px-2 py-0.5 rounded-full self-start ${trendPositive ? "bg-success/10" : "bg-danger/10"}`}
        >
          <Text
            className={`text-[10px] font-semibold ${trendPositive ? "text-success" : "text-danger"}`}
          >
            {trend}
          </Text>
        </View>
      )}
    </View>
  );
}
