import React from "react";
import { View, Text } from "react-native";

interface Props {
  review: any;
}

export default function ReviewCard({ review }: Props) {
  return (
    <View className="bg-dark-700 p-4 rounded-xl mb-3 border border-white/5">

      <Text className="text-yellow-400 text-sm">
        ⭐ {review.rating || 0}
      </Text>

      <Text className="text-slate-400 text-xs mt-1">
        {review.comment || "No comment"}
      </Text>

    </View>
  );
}