module Api
  module V1
    module Admin
      class ArtistProfilesController < ApplicationController
        before_action :authorize_admin
        def approve
          artist_profile = ArtistProfile.find_by(id: params[:id])

          return render_error(message: "Artist profile not found") unless artist_profile

          user = artist_profile.user

          ActiveRecord::Base.transaction do
            artist_profile.update!(is_approved: true)
            user.update!(role: "artist")
          end
  
          render_success(message: "Artist approved successfully")
        end
       
        private

        def authorize_admin
          return if current_user&.admin?

          render_error(message: "Unauthorized access", status: :forbidden)
        end
        
      end
    end
  end
end