module Dashboard
  class ArtistStatsService < BaseStatsService
    def call
      profile = user.artist_profile
      return {} unless profile

      bookings_query = Booking.where(artist_profile_id: profile.id)
      stats = aggregate_booking_stats(bookings_query, {
        upcoming_bookings_count: ['booking_date >= ? AND status IN (?)', Date.today, %w[pending confirmed]]
      })

      {
        total_bookings: stats[:total_bookings] || 0,
        pending_bookings: stats[:pending_bookings] || 0,
        completed_bookings: stats[:completed_bookings] || 0,
        upcoming_bookings_count: stats[:upcoming_bookings_count] || 0,
        total_services: Service.where(artist_profile_id: profile.id).count,
        total_reviews: Review.where(artist_profile_id: profile.id).count,
        average_rating: Review.where(artist_profile_id: profile.id).average(:rating)&.round(1) || 0,
        total_revenue: sum_revenue(bookings_query),
        recent_bookings: ActiveModelSerializers::SerializableResource.new(
          bookings_query.order(created_at: :desc).limit(5),
          each_serializer: BookingSerializer
        ).as_json
      }
    end
  end
end
