module Api
  module V1
    class BookingsController < ApplicationController
      load_and_authorize_resource includes: [:service, :artist_profile, :customer], except: [:create]
      def create
        @booking = Booking.new(resource_params)
        
        # Auto-assign customer_id if current user is a customer
        if current_user.customer?
          @booking.customer_id = current_user.id
        end

        return render_error(message: "Service is required") unless @booking.service_id
        service = Service.find(@booking.service_id)
        @booking.total_amount = service.price
        @booking.artist_profile_id = service.artist_profile_id
        

        # Default status
        @booking.status = 'pending'

        authorize! :create, @booking
        conflict = Booking.where(
          artist_profile_id: @booking.artist_profile_id,
          booking_date: @booking.booking_date
        ).where(
         "start_time < ? AND end_time > ?",
         @booking.end_time,
         @booking.start_time
        ).exists?

if conflict
  return render_error(message: "This time slot is not available")
end

        begin
        if @booking.save
          render_success(data: @booking, status: :created)
        else
          render_error(errors: @booking.errors.full_messages)
        end
        rescue ActiveRecord::RecordNotUnique
          render_error(message: "This time slot is already booked")
        end
      end

      def index
        @bookings = paginate(collection)
        render_paginated_success(@bookings, message: "Bookings retrieved successfully")
      end
      
      def show
        render_success(
          data: @booking,
          message: "Booking retrieved successfully"
        )
      end
      
      # GET /api/v1/bookings/my_bookings
      # Returns bookings where the current user is the customer
      def my_bookings
        return render_error(message: "Only customers allowed", status: :forbidden) unless current_user.customer?
        bookings = Booking.where(customer_id: current_user.id).order(booking_date: :desc)
        bookings = paginate(bookings)
        render_paginated_success(bookings, message: "Your bookings retrieved successfully")
      end

      # GET /api/v1/bookings/artist_bookings
      # Returns bookings assigned to the current user's artist profile
      def artist_bookings
        return render_error(message: "Only artists allowed", status: :forbidden) unless current_user.artist?
        profile = current_user.artist_profile
        unless profile
          return render_error(message: "Artist profile not found", status: :not_found)
        end

        bookings = Booking.where(artist_profile_id: profile.id).order(booking_date: :desc)
        bookings = paginate(bookings)
        render_paginated_success(bookings, message: "Artist bookings retrieved successfully")
      end

      def destroy
        # load_and_authorize_resource sets @booking and handles authorization
        # Just need to destroy it and respond
        @booking.destroy
        render_success(message: 'Booking deleted successfully')
      end

      def cancel

        # Idempotent behavior: already cancelled
         if @booking.status == "cancelled"
           return render_success(
              message: "Booking already cancelled"
           )
         end

        # Business rule: only pending can be cancelled
         unless @booking.status == "pending"
           return render_error(
            message: "Only pending bookings can be cancelled",
            status: :unprocessable_entity
          )
         end

         # Transaction for safety
         Booking.transaction do
           @booking.update!(status: "cancelled")
           
           # Side effect (placeholder for async job)
           Rails.logger.info "Notify artist #{@booking.artist_profile_id} about cancellation"
         end
         # TODO: notify artist (we'll improve later)

         render_success(
            message: "Booking cancelled successfully"
         ) 
      end

      private

      def booking_params
        params.require(:booking).permit(:artist_profile_id, :service_id, :booking_date, :start_time, :end_time, :total_amount, :status)
      end

      def resource_params
        booking_params
      end

      def collection
        base = Booking.includes(:service, :artist_profile, :payment, :customer)
         
        scoped =
          if current_user.admin?
            base
          elsif current_user.artist?
            base.where(artist_profile_id: current_user.artist_profile&.id)
          else
            base.where(customer_id: current_user.id)
          end

        if params[:status].present?
          scoped = scoped.where(status: params[:status])
        end
        
        scoped.order(booking_date: :desc, created_at: :desc)
      end
    end
  end
end
