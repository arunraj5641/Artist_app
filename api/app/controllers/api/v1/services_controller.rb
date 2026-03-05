module Api
  module V1
    class ServicesController < ApplicationController
      include Crudable
      load_and_authorize_resource except: [:create, :index]

      # Override create to auto-assign artist_profile_id for artists
      def create
        @resource = Service.new(resource_params)
        
        # Auto-assign artist_profile_id if current user is an artist
        if current_user.artist?
          unless current_user.artist_profile
            current_user.create_artist_profile(bio: '', city: '', experience_years: 0, base_price: 0, is_approved: false)
          end
          @resource.artist_profile_id = current_user.artist_profile.id
        end

        authorize! :create, @resource
        
        if @resource.save
          render_success(data: @resource, status: :created)
        else
          render_error(errors: @resource.errors.full_messages)
        end
      end

      private

      def service_params
        params.require(:service).permit(:artist_profile_id, :service_category_id, :name, :description, :duration_minutes, :price)
      end

      def resource_params
        service_params
      end

      def collection
        if current_user.admin?
          Service.all.order(name: :asc)
        elsif current_user.artist? && current_user.artist_profile
          Service.where(artist_profile_id: current_user.artist_profile.id).order(name: :asc)
        else
          Service.all.order(name: :asc)
        end
      end
    end
  end
end
