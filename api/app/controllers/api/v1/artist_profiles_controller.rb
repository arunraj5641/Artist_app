module Api
  module V1
    class ArtistProfilesController < ApplicationController
      include Crudable
      load_and_authorize_resource

      def index
        authorize! :read, ArtistProfile
        profiles = paginate(collection)
        render_paginated_success(profiles, message: 'Artist profiles retrieved successfully')
      end

      def show
        authorize! :read, @resource
        render_success(data: @resource,
        message: 'Artist profile retrieved successfully')
      end

      private

      def artist_profile_params
        params.require(:artist_profile).permit(:name, :bio, :experience_years, :base_price, :city)
      end

      def resource_params
        artist_profile_params
      end

      def collection
        ArtistProfile
        .includes(:user, :services, :bookings, :reviews)
        .order(created_at: :desc)
      end
    end
  end
end

