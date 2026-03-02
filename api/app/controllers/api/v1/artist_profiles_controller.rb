module Api
  module V1
    class ArtistProfilesController < ApplicationController
      include Crudable
      load_and_authorize_resource

      def index
        authorize! :read, ArtistProfile
        profiles = paginate(collection)
        render_paginated_success(profiles, message: 'Artist profiles retrieved successfully', serialized_data: profiles.map { |p| serialize_profile(p) })
      end

      def show
        authorize! :read, @resource
        render_success(data: serialize_profile(@resource))
      end

      private

      def serialize_profile(profile)
        profile.as_json(
          include: {
            user: { only: [:id, :email, :role] },
            services: { only: [:id, :name, :description, :price, :duration_minutes, :artist_profile_id, :service_category_id] }
          }
        ).merge(
          'bookings_count' => profile.bookings.count,
          'reviews_count'  => profile.reviews.count
        )
      end

      def artist_profile_params
        params.require(:artist_profile).permit(:name, :bio, :experience_years, :base_price, :city)
      end

      def resource_params
        artist_profile_params
      end

      def collection
        ArtistProfile.includes(:user, :services, :bookings, :reviews).order(created_at: :desc)
      end
    end
  end
end

