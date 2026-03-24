module Dashboard
  class AdminStatsService < BaseStatsService
    def call
      booking_stats = aggregate_booking_stats(Booking.all)
      user_stats = {
        total_users: User.count,
        active_users: User.where(status: 'active').count
      }

      {
        total_users: user_stats[:total_users],
        active_users: user_stats[:active_users],
        total_artists: ArtistProfile.count,
        approved_artists: ArtistProfile.where(is_approved: true).count,
        total_bookings: booking_stats[:total_bookings] || 0,
        pending_bookings: booking_stats[:pending_bookings] || 0,
        confirmed_bookings: booking_stats[:confirmed_bookings] || 0,
        completed_bookings: booking_stats[:completed_bookings] || 0,
        total_services: Service.count,
        total_reviews: Review.count,
        total_revenue: Payment.sum(:amount).to_f,
        total_organizations: (ActiveRecord::Base.connection.table_exists?('organizations') ? Organization.count : 0)
      }
    end
  end
end
