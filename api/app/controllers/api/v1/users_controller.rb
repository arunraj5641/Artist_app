module Api
  module V1
    class UsersController < ApplicationController
      include Crudable

      def index
        authorize! :read, model_class
        resources = paginate(sort(collection))
        active_count = collection.where(status: ['active', nil, '']).count
        new_this_week_count = collection.where('created_at >= ?', 1.week.ago).count
        render_paginated_success(resources, message: "#{model_class.name.pluralize} retrieved successfully", extra_meta: { 
          active_count: active_count,
          new_this_week_count: new_this_week_count
        })
      end

      private

      def collection
        users = User.order(created_at: :desc)
        users = users.where(role: params[:role]) if params[:role].present?
        users
      end

      def user_params
        permitted_params = [:email, :password, :password_confirmation, :name, :phone, :address, :loyalty_status, :preferences, 
                            artist_profile_attributes: [:id, :city, :bio]]
        permitted_params += [:role, :status] if current_user&.admin?
        params.require(:user).permit(permitted_params)
      end

      def resource_params
        user_params
      end
    end
  end
end
