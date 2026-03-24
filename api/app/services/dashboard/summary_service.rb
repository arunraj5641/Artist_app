module Dashboard
  class SummaryService
    def initialize(user)
      @user = user
    end

    def call
      {
        total_bookings: stats[:total_bookings] || 0,
        upcoming_bookings: stats[:upcoming_bookings] || 0,
        total_spent: total_spent
      }
    end

    private

    attr_reader :user

    # Optimized single-query aggregation using PostgreSQL FILTER.
    # This avoids multiple round-trips to the database.
    def stats
      @stats ||= begin
        # We use sanitize_sql_array to securely handle the date parameter
        sql = Booking.send(:sanitize_sql_array, [
          'COUNT(*) as total_bookings, ' \
          'COUNT(*) FILTER (WHERE booking_date >= ? AND status IN (?)) as upcoming_bookings',
          Date.current,
          %w[pending confirmed]
        ])

        user.bookings.select(sql).take&.attributes&.symbolize_keys || {}
      end
    end

    def total_spent
      # Summing payments linked to the user's bookings.
      # If the user is an artist, this might need to be 'revenue' instead.
      # Based on the requirement 'total spent', we assume Customer role perspective.
      Payment.joins(:booking)
             .where(bookings: { customer_id: user.id })
             .sum(:amount).to_f
    end
  end
end
