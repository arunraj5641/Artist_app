import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {Stack, useLocalSearchParams } from "expo-router";

import { getArtistById } from "../../services/artists";

import ArtistHeader from "../../components/artist/ArtistHeader";
import ServiceCard from "../../components/artist/ServiceCard";
import ReviewCard from "../../components/artist/ReviewCard";

export default function ArtistDetail() {
  const params = useLocalSearchParams();
  const [selectedService, setSelectedService] = useState<any>(null);
  // Expo router param safety
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchArtist = async () => {
      try {
        const data = await getArtistById(id);
        setArtist(data);
      } catch (error) {
        console.error("Artist fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!artist) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-900">
        <Text className="text-red-400">Artist not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-900">
      <Stack.Screen
        options={{
        title: "Artist Details",
        headerBackTitle: "Back",
       }}
      />
      {/* MAIN CONTENT */}
      <ScrollView className="flex-1 p-5">

        {/* HEADER */}
        <ArtistHeader artist={artist} />

        {/* SERVICES */}
        <View className="mt-2 mb-4">
          <Text className="text-white font-semibold mb-2">
            Services
          </Text>

          {artist.services?.length ? (
            [...artist.services]
              .sort((a, b) => a.price - b.price)
              .map((service: any) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={selectedService?.id === service.id}
                  onSelect={setSelectedService}
                />
          ))
      ) : (
        <Text className="text-slate-500 text-xs">
          No services available
        </Text>
      )}
        </View>

        {/* REVIEWS */}
        <View className="mt-2 mb-6">
          <Text className="text-white font-semibold mb-2">
            Reviews
          </Text>

          {artist.reviews?.length ? (
           [...(artist.reviews || [])]
             .sort((a, b) => b.rating - a.rating)
             .map((review: any) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <Text className="text-slate-500 text-xs">
              No reviews yet
            </Text>
          )}
        </View>

      </ScrollView>

      {/* BOOK BUTTON (STICKY FOOTER) */}
      <View className="p-5 border-t border-white/5 bg-dark-900">

        <TouchableOpacity
          disabled={!selectedService}
          onPress={() =>
            router.push({
              pathname: "/booking",
              params: {
                artistId: artist.id,
                serviceId: selectedService.id,
                serviceName: selectedService.name,
                price: selectedService.price?.toString(),
                duration: selectedService.duration?.toString(),
                artistName: artist.email,
              },
            })
          }
          className={`rounded-xl p-4 items-center ${
            selectedService ? "bg-purple-600" : "bg-slate-700"
        }`}
     >
  <Text className="text-white font-semibold text-base">
    {selectedService
      ? `Book ${selectedService.name}`
      : "Select a Service"}
  </Text>
</TouchableOpacity>

      </View>

    </View>
  );
}