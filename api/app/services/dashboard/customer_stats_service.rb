module Dashboard
  class CustomerStatsService < BaseStatsService
    def call
      bookings_query = Booking.where(customer_id: user.id)
      stats = aggregate_booking_stats(bookings_query)

      {
        total_bookings: stats[:total_bookings] || 0,
        pending_bookings: stats[:pending_bookings] || 0,
        completed_bookings: stats[:completed_bookings] || 0,
        total_spent: sum_revenue(bookings_query),
        total_reviews: Review.where(customer_id: user.id).count
      }
    end
  end
end
