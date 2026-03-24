import React, { useState, useMemo, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Avatar from "../../components/admin/Avatar";
import StatusBadge from "../../components/admin/StatusBadge";
import SectionHeader from "../../components/admin/SectionHeader";
import SearchFilterBar from "../../components/admin/SearchFilterBar";
import KPICard from "../../components/admin/KPICard";
import { router } from "expo-router";
import { toast } from "../../utils/toast";
import { getArtists, Artist } from "../../services/artists";
import { useArtists } from "../../hooks/useArtists";

const STATUS_FILTERS = ["All", "Approved", "Pending"];

export default function ArtistsScreen() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { artists, loading, searchLoading } = useArtists(debouncedSearch);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const filtered = useMemo(() => {
    return artists.filter((a) => {
      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Approved" && a.is_approved) ||
        (statusFilter === "Pending" && !a.is_approved);

      return matchStatus;
    });
  }, [artists, statusFilter]);

  const avgRating =
    artists.length > 0
      ? (
          artists.reduce((sum, a) => sum + (a.reviews || 0), 0) /
          artists.length
        ).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-900">
        <Text className="text-slate-400">Loading artists...</Text>
      </View>
    );
  }

  const renderArtist = ({ item: artist }: { item: Artist }) => (
    <View className="bg-dark-700 rounded-2xl p-4 mb-3 border border-white/5">

      <View className="flex-row items-start gap-x-3 mb-4">
        <Avatar name={artist.name || artist.email} size={44} />

        <View className="flex-1">
          <Text className="text-white text-base font-semibold">
            {artist.name || artist.email}
          </Text>

          <Text className="text-slate-400 text-xs mt-0.5">
            {artist.bio || "No bio available"}
          </Text>

          <View className="flex-row items-center gap-x-1 mt-1.5">
            <Ionicons name="location-outline" size={12} color="#64748b" />
            <Text className="text-slate-500 text-[10px]">
              {artist.city || "Unknown"}
            </Text>

            <Text className="text-slate-500 text-[10px]"> · </Text>

            <Ionicons name="time-outline" size={12} color="#64748b" />
            <Text className="text-slate-500 text-[10px]">
              {artist.experience_years ?? 0} yrs
            </Text>
          </View>
        </View>

        <StatusBadge status={artist.is_approved ? "Active" : "Pending"} />
      </View>

      <View className="flex-row bg-dark-800 rounded-xl p-3 mb-3">

        <View className="flex-1 items-center">
          <Text className="text-white text-base font-bold">
            {artist.bookings ?? 0}
          </Text>
          <Text className="text-slate-500 text-[10px] mt-0.5">Bookings</Text>
        </View>

        <View className="w-px bg-white/5 my-1" />

        <View className="flex-1 items-center">
          <Text className="text-white text-base font-bold">
            ★ {artist.reviews ?? 0}
          </Text>
          <Text className="text-slate-500 text-[10px] mt-0.5">Reviews</Text>
        </View>

        <View className="w-px bg-white/5 my-1" />

        <View className="flex-1 items-center">
          <Text className="text-white text-base font-bold">
            ₹{artist.base_price}
          </Text>
          <Text className="text-slate-500 text-[10px] mt-0.5">Base Price</Text>
        </View>

      </View>

      <View className="flex-row justify-between items-center border-t border-white/5 pt-3">

        <Text className="text-slate-500 text-[10px] flex-1">
          <Ionicons name="mail-outline" size={10} color="#64748b" />{" "}
          {artist.email}
        </Text>

        <View className="flex-row gap-x-2">

          <TouchableOpacity
             className="w-[34] h-[34] rounded-md bg-dark-800 items-center justify-center border border-white/5"
             onPress={() => router.push(`/artists/${artist.id}`)}
          >
          <Ionicons name="eye-outline" size={16} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[34] h-[34] rounded-md bg-dark-800 items-center justify-center border border-white/5"
            onPress={() => toast.info(`Editing ${artist.name}`)}
          >
            <Ionicons name="create-outline" size={16} color="#3b82f6" />
          </TouchableOpacity>

          {!artist.is_approved && (
            <TouchableOpacity
              className="w-[34] h-[34] rounded-md bg-success/10 items-center justify-center border border-success/20"
              onPress={() => toast.success(`${artist.name} approved!`)}
            >
              <Ionicons name="checkmark" size={16} color="#22c55e" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="w-[34] h-[34] rounded-md bg-danger/10 items-center justify-center border border-danger/20"
            onPress={() => toast.error(`${artist.name} deleted`)}
          >
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      className="bg-dark-900"
      contentContainerStyle={{ padding: 20 }}
      data={filtered}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderArtist}
      initialNumToRender={6}
      windowSize={10}
      removeClippedSubviews

      ListHeaderComponent={
        <>
          <View className="flex-row items-center gap-x-2 mb-4">
            <Text className="text-slate-500 text-xs">Admin</Text>
            <Ionicons name="chevron-forward" size={14} color="#64748b" />
            <Text className="text-slate-400 text-xs font-medium">Artists</Text>
          </View>

          <SectionHeader
            title="Artist Management"
            subtitle="Manage makeup artists on the platform"
            actionLabel="Add Artist"
            onAction={() => toast.success("Opening Add Artist form...")}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6 -mx-5"
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            <KPICard title="Total Artists" value={artists.length} icon={<Ionicons name="brush" size={18} color="#a855f7" />} />
            <KPICard title="Approved" value={artists.filter((a) => a.is_approved).length} icon={<Ionicons name="checkmark-circle" size={18} color="#22c55e" />} />
            <KPICard title="Pending" value={artists.filter((a) => !a.is_approved).length} icon={<Ionicons name="hourglass" size={18} color="#f59e0b" />} />
            <KPICard title="Avg Reviews" value={avgRating} icon={<Ionicons name="star" size={18} color="#ef4444" />} />
          </ScrollView>

          <SearchFilterBar
            searchValue={search}
            onSearchChange={setSearch}
            placeholder="Search artists or city..."
            statusOptions={STATUS_FILTERS}
            selectedStatus={statusFilter}
            onStatusChange={setStatusFilter}
          />
          {searchLoading && (
            <View className="py-2 items-center">
              <ActivityIndicator size="small" color="#94a3b8" />
            </View>
          )}
        </>
      }
    />
  );
}