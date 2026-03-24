import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../../components/dashboard/SearchBar";
import { SERVICES } from "../../constants/mocks";
import ServiceCard from "../../components/dashboard/ServiceCard";

export default function ExploreScreen() {
  const [search, setSearch] = useState("");

  const filteredServices = useMemo(() => {
    return SERVICES.filter((s) => {
      const q = search.toLowerCase();
      return (
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    });
  }, [search]);

  return (
    <ScrollView
      className="flex-1 bg-dark-900"
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0b1120" />

      {/* Header */}
      <View className="px-5 pt-14 pb-2">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-white text-2xl font-extrabold">Services</Text>
            <Text className="text-slate-500 text-xs mt-1">
              {SERVICES.length} beauty services offered
            </Text>
          </View>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-accent items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View className="px-5 mt-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search services..."
        />
      </View>

      {/* Service Cards */}
      <View className="px-5 mt-6">
        {filteredServices.length === 0 ? (
          <View className="items-center justify-center py-16 gap-y-3">
            <Ionicons name="search-outline" size={48} color="#334155" />
            <Text className="text-slate-500 text-base">No services found</Text>
          </View>
        ) : (
          filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              name={service.name}
              description={service.description}
              price={service.price}
              duration={service.duration}
              timesBooked={service.timesBooked}
              rating={service.rating}
              icon={service.icon}
              iconColor={service.iconColor}
            />
          ))
        )}
      </View>

      {/* Bottom spacer */}
      <View className="h-24" />
    </ScrollView>
  );
}
