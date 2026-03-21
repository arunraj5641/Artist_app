import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function BookingSuccessScreen() {
  const params = useLocalSearchParams();

  const serviceName = Array.isArray(params.serviceName)
    ? params.serviceName[0]
    : params.serviceName;

  const artistName = Array.isArray(params.artistName)
    ? params.artistName[0]
    : params.artistName;

  const selectedDate = Array.isArray(params.selectedDate)
    ? params.selectedDate[0]
    : params.selectedDate;

  const selectedTime = Array.isArray(params.selectedTime)
    ? params.selectedTime[0]
    : params.selectedTime;

  const price = Array.isArray(params.price) ? params.price[0] : params.price;

  const formatDateLabel = (date?: string) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <View className="flex-1 bg-dark-900 px-6 justify-center">
      <Stack.Screen
        options={{
          title: "Booking Success",
          headerBackVisible: false,
        }}
      />

      <View className="items-center mb-10">
        <View className="w-24 h-24 rounded-full bg-purple-600/20 items-center justify-center mb-5">
          <Ionicons name="checkmark-circle" size={64} color="#a855f7" />
        </View>

        <Text className="text-white text-3xl font-bold mb-3">
          Booking Confirmed
        </Text>

        <Text className="text-slate-400 text-center text-base leading-6">
          Your appointment has been scheduled successfully.
        </Text>
      </View>

      <View className="bg-dark-700 rounded-2xl p-5 border border-white/5 mb-8">
        <Text className="text-white text-lg font-semibold mb-4">
          Booking Details
        </Text>

        <View className="gap-3">
          <View className="flex-row items-start justify-between">
            <Text className="text-slate-400 text-sm">Service</Text>
            <Text className="text-white text-sm font-medium max-w-[65%] text-right">
              {serviceName || "Not available"}
            </Text>
          </View>

          <View className="flex-row items-start justify-between">
            <Text className="text-slate-400 text-sm">Artist</Text>
            <Text className="text-white text-sm font-medium max-w-[65%] text-right">
              {artistName || "Not available"}
            </Text>
          </View>

          <View className="flex-row items-start justify-between">
            <Text className="text-slate-400 text-sm">Date</Text>
            <Text className="text-white text-sm font-medium">
              {formatDateLabel(selectedDate)}
            </Text>
          </View>

          <View className="flex-row items-start justify-between">
            <Text className="text-slate-400 text-sm">Time</Text>
            <Text className="text-white text-sm font-medium">
              {selectedTime || "Not available"}
            </Text>
          </View>

          <View className="flex-row items-start justify-between">
            <Text className="text-slate-400 text-sm">Amount</Text>
            <Text className="text-white text-sm font-medium">
              {price ? `₹${price}` : "Not available"}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/")}
        className="bg-purple-600 rounded-2xl p-4 items-center mb-4"
      >
        <Text className="text-white font-semibold text-base">Back to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-dark-700 rounded-2xl p-4 items-center border border-white/5"
      >
        <Text className="text-white font-semibold text-base">Book Another</Text>
      </TouchableOpacity>
    </View>
  );
}