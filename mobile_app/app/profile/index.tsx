import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { getProfile, UserProfile } from "../../services/profile";

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err: any) {
        console.error("Failed to load profile", err);
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-900 px-6">
        <Text className="text-red-400 text-center mb-4">
          {error || "User not found"}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-900 px-6 pt-6">
      <Stack.Screen
        options={{
          title: "My Profile",
          headerBackTitle: "Back",
        }}
      />

      {/* Profile Card Summary */}
      <View className="bg-dark-700 rounded-2xl p-6 mb-8 border border-white/5 items-center">
        {/* Avatar Placeholder */}
        <View className="w-24 h-24 rounded-full bg-purple-600/20 items-center justify-center mb-4 border-2 border-purple-500/30">
          <Ionicons name="person" size={48} color="#a855f7" />
        </View>

        {/* User Info */}
        <Text className="text-white text-2xl font-bold mb-1">
          {user.name || "No Name Provided"}
        </Text>
        <Text className="text-slate-400 text-sm mb-4">
          {user.email}
        </Text>
        
        {user.role && (
          <View className="bg-purple-600/20 px-3 py-1 rounded-full">
            <Text className="text-purple-400 text-xs font-semibold capitalize">
              {user.role}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        className="bg-purple-600 rounded-2xl p-4 items-center mb-4"
        onPress={() => {
          // Future: router.push('/profile/edit')
          console.log("Edit Profile Clicked");
        }}
      >
        <Text className="text-white font-semibold text-base">
          Edit Profile
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-dark-700 rounded-2xl p-4 items-center border border-white/5"
        onPress={() => {
          // Future: handle logout
          console.log("Logout Clicked");
        }}
      >
        <Text className="text-red-400 font-semibold text-base">
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
