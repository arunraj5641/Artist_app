module Api
  module V1
    module Admin
      class DashboardController < ApplicationController
        before_action :authorize_admin

        # GET /api/v1/admin/dashboard
        def index
          render_success(
            data: {
              total_users: User.count,
              total_artists: ArtistProfile.count,
              total_bookings: Booking.count,
              revenue: Payment.sum(:amount).to_f
            },
            message: "Admin dashboard stats retrieved successfully"
          )
        end

        # GET /api/v1/admin/recent-bookings
        def recent_bookings
          bookings = Booking.includes(:service, :customer, :artist_profile).order(created_at: :desc).limit(10)
          render_success(
            data: ActiveModelSerializers::SerializableResource.new(
              bookings,
              each_serializer: BookingSerializer
            ).as_json,
            message: "Recent bookings retrieved successfully"
          )
        end

        # GET /api/v1/admin/top-artists
        def top_artists
          # Top 5 artists by completed bookings
          artists = ArtistProfile.joins(:bookings)
                                 .where(bookings: { status: 'completed' })
                                 .group('artist_profiles.id')
                                 .select('artist_profiles.*, COUNT(bookings.id) as bookings_count')
                                 .order('bookings_count DESC')
                                 .limit(5)

          render_success(
            data: artists.map { |artist| 
              {
                id: artist.id,
                name: artist.name.presence || artist.user&.name || artist.user&.email,
                bookings_count: artist.attributes['bookings_count'],
                city: artist.city,
                base_price: artist.base_price.to_f
              }
            },
            message: "Top artists retrieved successfully"
          )
        end

        # GET /api/v1/admin/revenue-chart
        def revenue_chart
          revenue_data = Payment.group("DATE_TRUNC('month', created_at)")
                                .sum(:amount)
                                .map do |date, total|
            {
              month: date.strftime('%b %Y'),
              revenue: total.to_f
            }
          end

          render_success(
            data: revenue_data,
            message: "Revenue chart data retrieved successfully"
          )
        end

        # GET /api/v1/admin/bookings-by-status
        def bookings_by_status
          counts = Booking.group(:status).count
          
          # Ensure all statuses are included, even with 0 count
          formatted_counts = Booking::STATUSES.map do |status|
            {
              status: status,
              count: counts[status] || 0
            }
          end

          render_success(
            data: formatted_counts,
            message: "Bookings by status retrieved successfully"
          )
        end

        # GET /api/v1/admin/activity-feed
        def activity_feed
          # Combine recent users, bookings, and artist approvals
          users = User.order(created_at: :desc).limit(5).map do |user|
            {
              id: user.id,
              type: 'signup',
              message: "New user joined: #{user.name || user.email}",
              timestamp: user.created_at
            }
          end

          bookings = Booking.includes(:customer, :service).order(created_at: :desc).limit(5).map do |booking|
            {
              id: booking.id,
              type: 'booking',
              message: "New booking for #{booking.service&.name} by #{booking.customer&.name || 'a customer'}",
              timestamp: booking.created_at
            }
          end

          approvals = ArtistProfile.where.not(approved_at: nil).order(approved_at: :desc).limit(5).map do |profile|
            {
              id: profile.id,
              type: 'approval',
              message: "Artist approved: #{profile.name || profile.user&.email}",
              timestamp: profile.approved_at
            }
          end

          feed = (users + bookings + approvals).sort_by { |item| item[:timestamp] }.reverse.first(15)

          render_success(
            data: feed,
            message: "Activity feed retrieved successfully"
          )
        end

        private

        def authorize_admin
          unless current_user&.role == 'admin'
            render_error(message: "Unauthorized access", status: :forbidden)
          end
        end
      end
    end
  end
end
