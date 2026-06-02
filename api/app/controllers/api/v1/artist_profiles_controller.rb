module Api
  module V1
    class ArtistProfilesController < ApplicationController
      include Crudable
      load_and_authorize_resource except: [:index]
      # GET /api/v1/artists
       def index
         artists = base_scope
         artists = apply_search(artists)

         render_paginated_success(
            artists,
            message: "Artists retrieved successfully"
        )
      end

      def show
         authorize! :read, ArtistProfile

         artist = ArtistProfile
                   .includes(:user, :services, :reviews)
                   .find_by(id: params[:id])

         return render_error(message: "Artist not found", status: :not_found) unless artist

         render_success(
           data: artist,
           serializer: ArtistDetailSerializer,
           message: "Artist details retrieved successfully"
       )
      end

      private

      def base_scope
         ArtistProfile
         .includes(:services, :user)
         .order(created_at: :desc)
      end

      def apply_search(scope)
        return scope if params[:search].blank?

        query = "%#{ActiveRecord::Base.sanitize_sql_like(params[:search].strip)}%"

        scope
          .joins(:user)
          .where(
          "users.name ILIKE :q OR artist_profiles.city ILIKE :q OR artist_profiles.bio ILIKE :q",
          q: query
         )
         .distinct
       end

      def artist_profile_params
        params.require(:artist_profile).permit(:name, :bio, :experience_years, :base_price, :city ,:is_approved )
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
