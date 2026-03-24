module Dashboard
  class BaseStatsService
    def initialize(user)
      @user = user
    end

    def call
      raise NotImplementedError
    end

    protected

    attr_reader :user

    def aggregate_booking_stats(query, extra_filters = {})
      # extra_filters can be things like { upcoming: ['booking_date >= ?', Date.today] }
      
      select_parts = ["COUNT(*) as total_bookings"]
      
      # Status counts
      ['pending', 'confirmed', 'completed', 'cancelled'].each do |status|
        select_parts << "COUNT(*) FILTER (WHERE status = '#{status}') as #{status}_bookings"
      end

      # Extra calculations
      extra_filters.each do |key, (condition, *args)|
        sanitized = Booking.send(:sanitize_sql_array, [condition, *args])
        select_parts << "COUNT(*) FILTER (WHERE #{sanitized}) as #{key}"
      end

      query.select(select_parts.join(', ')).take&.attributes&.symbolize_keys || {}
    end

    def sum_revenue(query)
      Payment.joins(:booking).merge(query).sum(:amount).to_f
    end
  end
end
