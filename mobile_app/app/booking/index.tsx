import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCreateBooking } from "../../hooks/useCreateBooking";

export default function BookingScreen() {
  const params = useLocalSearchParams();

  const artistId = Array.isArray(params.artistId)
    ? params.artistId[0]
    : params.artistId;

  const serviceId = Array.isArray(params.serviceId)
    ? params.serviceId[0]
    : params.serviceId;

  const serviceName = Array.isArray(params.serviceName)
    ? params.serviceName[0]
    : params.serviceName;

  const price = Array.isArray(params.price) ? params.price[0] : params.price;

  const duration = Array.isArray(params.duration)
    ? params.duration[0]
    : params.duration;

  const artistName = Array.isArray(params.artistName)
    ? params.artistName[0]
    : params.artistName;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const { create, loading, error } = useCreateBooking();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const dates = useMemo(() => {
    const result = [];

    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      result.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate().toString(),
        fullDate: date.toISOString().split("T")[0],
      });
    }

    return result;
  }, []);

  const times = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
  ];

  const isPastTime = (time: string) => {
    if (!selectedDate) return false;

    const today = new Date().toISOString().split("T")[0];

    if (selectedDate !== today) return false;

    const [hours, minutes] = time.split(":").map(Number);

    const now = new Date();
    const slotTime = new Date();

    slotTime.setHours(hours);
    slotTime.setMinutes(minutes);
    slotTime.setSeconds(0);
    slotTime.setMilliseconds(0);

    return slotTime < now;
  };

  const formatDateLabel = (date: string | null) => {
    if (!date) return "Not selected";

    const parsed = new Date(date);

    return parsed.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const calculateEndTime = (startTime: string, durationInMinutes: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + durationInMinutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    const endHours = String(date.getHours()).padStart(2, "0");
    const endMinutes = String(date.getMinutes()).padStart(2, "0");

    return `${endHours}:${endMinutes}`;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !serviceId || !artistId) {
      Alert.alert("Missing details", "Please select date and time.");
      return;
    }

    const parsedPrice = Number(price || 0);
    const parsedDuration = Number(duration || 60);
    const endTime = calculateEndTime(selectedTime, parsedDuration);

    try {
      await create({
        artistProfileId: artistId as string,
        serviceId: serviceId as string,
        bookingDate: selectedDate,
        startTime: selectedTime,
        endTime,
        totalAmount: parsedPrice,
        status: "pending",
      });

      router.replace({
        pathname: "/booking/success",
        params: {
          serviceName: serviceName || "Your service",
          artistName: artistName || "Selected artist",
          selectedDate,
          selectedTime,
          price: String(parsedPrice),
        },
      });
    } catch (error: any) {
      console.error("Booking failed", error);
      Alert.alert(
        "Booking failed",
        error?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <View className="flex-1 bg-dark-900">
      <Stack.Screen
        options={{
          title: "Book Appointment",
          headerBackTitle: "Back",
        }}
      />

      <ScrollView
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-dark-800 rounded-2xl p-6 mb-8 border border-white/5">
          <Text className="text-white text-lg font-bold mb-5">
            Booking Details
          </Text>

          <View className="gap-4">
            <View className="flex-row items-start justify-between">
              <Text className="text-slate-400 text-sm font-medium">Service</Text>
              <Text className="text-white text-sm font-semibold max-w-[65%] text-right">
                {serviceName || "Not available"}
              </Text>
            </View>

            <View className="flex-row items-start justify-between">
              <Text className="text-slate-400 text-sm font-medium">Price</Text>
              <Text className="text-white text-sm font-semibold">
                {price ? `₹${price}` : "Not available"}
              </Text>
            </View>

            {duration ? (
              <View className="flex-row items-start justify-between">
                <Text className="text-slate-400 text-sm font-medium">Duration</Text>
                <Text className="text-white text-sm font-semibold">
                  {duration} mins
                </Text>
              </View>
            ) : null}

            <View className="flex-row items-start justify-between">
              <Text className="text-slate-400 text-sm font-medium">Artist</Text>
              <Text className="text-white text-sm font-semibold max-w-[65%] text-right">
                {artistName || artistId || "Not available"}
              </Text>
            </View>

            <View className="h-px bg-white/10 my-2" />

            <View className="flex-row items-start justify-between">
              <Text className="text-slate-400 text-sm font-medium">Date</Text>
              <Text className="text-white text-sm font-semibold">
                {formatDateLabel(selectedDate)}
              </Text>
            </View>

            <View className="flex-row items-start justify-between">
              <Text className="text-slate-400 text-sm font-medium">Time</Text>
              <Text className="text-white text-sm font-semibold">
                {selectedTime || "Not selected"}
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-slate-400 text-sm mb-3">Select date</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-8"
        >
          <View className="flex-row gap-3 pr-6">
            {dates.map((d) => (
              <TouchableOpacity
                key={d.fullDate}
                onPress={() => setSelectedDate(d.fullDate)}
                className={`min-w-[72px] h-[84px] rounded-2xl items-center justify-center border ${
                  selectedDate === d.fullDate
                    ? "bg-purple-600 border-purple-500"
                    : "bg-dark-800 border-white/5"
                }`}
              >
                <Text
                  className={`text-[11px] font-medium uppercase tracking-wider mb-1 ${
                    selectedDate === d.fullDate
                      ? "text-white/90"
                      : "text-slate-400"
                  }`}
                >
                  {d.day}
                </Text>

                <Text className={`text-2xl font-bold ${
                  selectedDate === d.fullDate ? "text-white" : "text-slate-200"
                }`}>
                  {d.date}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              className="min-w-[72px] h-[84px] rounded-2xl items-center justify-center border bg-dark-800 border-white/5"
            >
              <Text className="text-lg">📅</Text>
              <Text className="text-slate-400 text-[11px] font-medium mt-1">More</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {showPicker && (
          <DateTimePicker
            value={selectedDate ? new Date(selectedDate) : today}
            mode="date"
            display="default"
            minimumDate={today}
            onChange={(event, date) => {
              setShowPicker(false);
              if (date) {
                setSelectedDate(date.toLocaleDateString("en-CA"));
              }
            }}
          />
        )}

        <Text className="text-slate-400 text-sm mb-3">Select time</Text>

        <View className="flex-row flex-wrap gap-3 mb-10">
          {times.map((time) => {
            const disabled = isPastTime(time);

            return (
              <TouchableOpacity
                key={time}
                disabled={disabled || loading}
                onPress={() => setSelectedTime(time)}
                className={`flex-1 min-w-[30%] py-4 rounded-xl items-center border ${
                  disabled
                    ? "bg-dark-800/50 border-white/5 opacity-40"
                    : selectedTime === time
                    ? "bg-purple-600 border-purple-500"
                    : "bg-dark-800 border-white/10"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    disabled
                      ? "text-slate-500"
                      : selectedTime === time
                      ? "text-white"
                      : "text-slate-300"
                  }`}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View className="p-6 pt-5 pb-8 border-t border-white/10 bg-dark-900 flex-row items-center justify-between">
        <View className="flex-shrink mr-4">
          <Text className="text-slate-400 text-xs font-medium mb-1">Total</Text>
          <Text className="text-white text-2xl font-bold">₹{price || 0}</Text>
        </View>
        <TouchableOpacity
          disabled={!selectedDate || !selectedTime || loading}
          onPress={handleBooking}
          className={`flex-1 rounded-2xl py-4 items-center justify-center ${
            selectedDate && selectedTime && !loading
              ? "bg-purple-600"
              : "bg-dark-800 border-white/5 opacity-60"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className={`font-bold text-base ${
              selectedDate && selectedTime ? "text-white" : "text-slate-400"
            }`}>
              Book Now
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}