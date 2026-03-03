module Api
  module V1
    class AvailabilitiesController < ApplicationController
      include Crudable
      load_and_authorize_resource class: 'Availability'

      private

      def availability_params
        params.require(:availability).permit(:artist_profile_id, :available_date, :start_time, :end_time, :is_booked)
      end

      def resource_params
        availability_params
      end

      def collection
        Availability.all.order(available_date: :asc)
      end
    end
  end
end
