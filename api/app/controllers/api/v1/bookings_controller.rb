module Api
  module V1
    class BookingsController < ApplicationController
      include Crudable
      load_and_authorize_resource except: [:create]

      def create
        @resource = Booking.new(resource_params)
        
        # Auto-assign customer_id if current user is a customer
        if current_user.customer?
          @resource.customer_id = current_user.id
        end

        # Auto-assign artist_profile_id from the service if missing
        if @resource.artist_profile_id.blank? && @resource.service_id.present?
          service = Service.find_by(id: @resource.service_id)
          @resource.artist_profile_id = service.artist_profile_id if service
        end

        # Default status
        @resource.status ||= 'pending'

        authorize! :create, @resource

        if @resource.save
          render_success(data: @resource, status: :created)
        else
          render_error(errors: @resource.errors.full_messages)
        end
      end

      def index
        @bookings = paginate(collection)
        render_paginated_success(@bookings, message: "Bookings retrieved successfully")
      end

      # GET /api/v1/bookings/my_bookings
      # Returns bookings where the current user is the customer
      def my_bookings
        bookings = Booking.where(customer_id: current_user.id).order(booking_date: :desc)
        bookings = paginate(bookings)
        render_paginated_success(bookings, message: "Your bookings retrieved successfully")
      end

      # GET /api/v1/bookings/artist_bookings
      # Returns bookings assigned to the current user's artist profile
      def artist_bookings
        profile = current_user.artist_profile
        unless profile
          return render_error(message: "Artist profile not found", status: :not_found)
        end

        bookings = Booking.where(artist_profile_id: profile.id).order(booking_date: :desc)
        bookings = paginate(bookings)
        render_paginated_success(bookings, message: "Artist bookings retrieved successfully")
      end

      private

      def booking_params
        params.require(:booking).permit(:artist_profile_id, :service_id, :booking_date, :start_time, :end_time, :total_amount, :status)
      end

      def resource_params
        booking_params
      end

      def collection
        if current_user.role == 'admin'
          Booking.all
        elsif current_user.role == 'artist'
          Booking.where(artist_profile_id: current_user.artist_profile&.id)
        else
          Booking.where(customer_id: current_user.id)
        end.order(booking_date: :desc)
      end
    end
  end
end
