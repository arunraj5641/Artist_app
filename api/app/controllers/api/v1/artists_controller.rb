module Api
  module V1
    class ArtistsController < ApplicationController
      load_and_authorize_resource class: 'ArtistProfile'

      def show
        artist = ArtistProfile
                   .includes(:user, :services, :reviews)
                   .find_by(id: params[:id])

        return render_error(message: "Artist not found", status: :not_found) unless artist

        render json: {
          success: true,
          message: "Artist details retrieved successfully",
          data: ActiveModelSerializers::SerializableResource.new(
            artist,
            serializer: ArtistDetailSerializer
          )
        }
      end
    end
  end
end