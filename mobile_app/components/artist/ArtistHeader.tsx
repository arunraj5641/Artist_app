import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  artist: any;
}

export default function ArtistHeader({ artist }: Props) {
  const reviewCount = artist.reviews?.length || 0;

  const avgRating =
    reviewCount > 0
      ? (
          artist.reviews.reduce(
            (sum: number, r: any) => sum + (r.rating || 0),
            0
          ) / reviewCount
        ).toFixed(1)
      : "0.0";

  return (
    <View className="bg-dark-700 rounded-2xl p-5 mb-4 border border-white/5">

      <Text className="text-xl font-semibold text-white">
        {artist.name || artist.email}
      </Text>

      <View className="flex-row items-center mt-1">
        <Ionicons name="location-outline" size={14} color="#94a3b8" />
        <Text className="text-slate-400 text-xs ml-1">
          {artist.city || "Unknown location"}
        </Text>
      </View>

      <View className="flex-row items-center mt-2">
        <Ionicons name="star" size={14} color="#facc15" />
        <Text className="text-yellow-400 text-xs ml-1">
          {avgRating} ({reviewCount} reviews)
        </Text>
      </View>

      <Text className="text-slate-500 text-xs mt-1">
        {artist.experience_years ?? 0} years experience
      </Text>

      {artist.bio && (
        <Text className="text-slate-400 text-sm mt-3">
          {artist.bio}
        </Text>
      )}
    </View>
  );
}