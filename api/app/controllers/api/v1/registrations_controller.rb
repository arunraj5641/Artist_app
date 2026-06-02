module Api
  module V1
    class RegistrationsController < ApplicationController
      skip_before_action :authorize_request, only: :create

      def create
        @user = User.new(user_params)
        @user.role = requested_role
        if @user.save
          if @user.artist?
            profile = @user.artist_profile || @user.build_artist_profile
            profile.assign_attributes(
              name: @user.name,
              bio: '',
              city: '',
              experience_years: 0,
              base_price: 0,
              is_approved: true,
              approved_at: Time.current
            )
            profile.save!
          end
          

          token = ::JsonWebToken.encode(user_id: @user.id)
          render_success(
            data: { 
              user: @user.slice(:id, :name, :email, :role),
              token: token 
            }, 
            message: 'Account created successfully', 
            status: :created
          )
        else
          render_error(message: 'Registration failed', errors: @user.errors.full_messages)
        end
      end

      private

      def requested_role
        params[:user][:role] == "artist" ? "artist" : "customer"
      end

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end
    end
  end
end
