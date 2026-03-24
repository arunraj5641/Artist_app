module Api
  module V1
    class DashboardController < ApplicationController
      # GET /api/v1/dashboard  (legacy — returns stats based on role)
      def index
        stats = case current_user.role
                when 'admin'  then admin_stats
                when 'artist' then artist_stats
                else customer_stats
                end

        render_success(
          data: { stats: stats },
          message: "Dashboard data retrieved successfully"
        )
      end

      # GET /api/v1/dashboard/admin
      def admin
        unless current_user.admin?
          return render_error(message: "Forbidden", status: :forbidden)
        end

        render_success(
          data: { stats: admin_stats },
          message: "Admin dashboard retrieved successfully"
        )
      end

      # GET /api/v1/dashboard/artist
      def artist
        unless current_user.artist?
          return render_error(message: "Forbidden", status: :forbidden)
        end

        render_success(
          data: { stats: artist_stats },
          message: "Artist dashboard retrieved successfully"
        )
      end

      # GET /api/v1/dashboard/summary
      def summary
        stats = Dashboard::SummaryService.new(current_user).call
        render_success(data: stats, message: "Dashboard summary retrieved successfully")
      end

      private

      def admin_stats
        Dashboard::AdminStatsService.new(current_user).call
      end

      def artist_stats
        Dashboard::ArtistStatsService.new(current_user).call
      end

      def customer_stats
        Dashboard::CustomerStatsService.new(current_user).call
      end
    end
  end
end
