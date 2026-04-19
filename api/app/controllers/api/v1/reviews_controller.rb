module Api
  module V1
    class ReviewsController < ApplicationController
      include Crudable
      load_and_authorize_resource

      def create
        booking = Booking.find_by(id: review_params[:booking_id])

        return render_error(message: "Booking not found") unless booking

        # ✔ Ownership check
        unless booking.customer_id == current_user.id
          return render_error(message: "Not authorized", status: :forbidden)
        end

         # ✔ Status check
        unless booking.status == "completed"
          return render_error(message: "You can only review completed bookings")
        end

        @review = Review.new(review_params)

        # ✔ Assign from backend
        @review.customer_id = current_user.id
        @review.artist_profile_id = booking.artist_profile_id

        authorize! :create, @review

        begin
          if @review.save
            render_success(data: @review, serializer: ReviewDetailSerializer, status: :created)
          else
            render_error(errors: @review.errors.full_messages)
          end
        rescue ActiveRecord::RecordNotUnique
           render_error(message: "Review already exists for this booking")
        end
      end

      def my_reviews
        return render_error(message: "Only customers allowed", status: :forbidden) unless current_user.customer?

        reviews = base_scope.where(customer_id: current_user.id)

         reviews = paginate(reviews)

         render_paginated_success(
           reviews,
           serializer: ReviewDetailSerializer,
           message: "Your reviews retrieved successfully"
          )
        end

      def index
        reviews =
        if current_user.admin?
           base_scope
        else
          return render_error(message: "artist_profile_id is required") unless params[:artist_profile_id]
          base_scope.where(artist_profile_id: params[:artist_profile_id])
        end
        reviews = paginate(reviews)
        render_paginated_success(
            reviews,
            serializer: ReviewDetailSerializer,
            message: "Reviews retrieved successfully"
        )
      end

      private

      def review_params
        params.require(:review).permit(:booking_id, :rating, :comment)
      end

      def resource_params
        review_params
      end

      def base_scope
        Review
          .includes(artist_profile: :user)
          .order(created_at: :desc)
      end

      def collection
        base_scope.where(artist_profile_id: params[:artist_profile_id])
      end
    end
  end
end
