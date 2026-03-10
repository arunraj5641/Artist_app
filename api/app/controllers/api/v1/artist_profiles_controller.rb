module Api
  module V1
    class ArtistProfilesController < ApplicationController
      include Crudable
      load_and_authorize_resource except: [:index]
      # GET /api/v1/artists
      def index
        artists = ArtistProfile
                   .where(is_approved: true)
                   .includes(:services, :user)

        # search
        if params[:search].present?
          artists = artists.joins(:user).where(
            "users.name ILIKE :q OR artist_profiles.city ILIKE :q OR artist_profiles.bio ILIKE :q",
            q: "%#{params[:search]}%"
          )
        end

        artists = artists.order(created_at: :desc)

        paginated_artists = paginate(artists)
        
        render_success(
          data: paginated_artists,
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

