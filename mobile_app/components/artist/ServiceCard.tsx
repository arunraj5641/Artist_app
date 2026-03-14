import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  service: any;
  selected: boolean;
  onSelect: (service: any) => void;
}

export default function ServiceCard({
  service,
  selected,
  onSelect,
}: Props) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(service)}
      className={`p-4 rounded-xl mb-3 border ${
        selected
          ? "bg-purple-600/20 border-purple-500"
          : "bg-dark-700 border-white/5"
      }`}
    >
      <Text className="text-white font-medium">
        {service.name}
      </Text>

      {service.description && (
        <Text className="text-slate-400 text-xs mt-1">
          {service.description}
        </Text>
      )}

      <View className="flex-row justify-between mt-3">
        <Text className="text-purple-400 font-semibold">
          ₹{service.price}
        </Text>

        <Text className="text-slate-500 text-xs">
          {service.duration_minutes} mins
        </Text>
      </View>
    </TouchableOpacity>
  );
}