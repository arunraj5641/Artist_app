module Api
  module V1
    class RegistrationsController < ApplicationController
      skip_before_action :authorize_request, only: :create

      def create
        @user = User.new(user_params)
        if @user.save
          # Auto-create artist profile for artist users
          if @user.artist?
            @user.create_artist_profile(
              bio: '',
              city: '',
              experience_years: 0,
              base_price: 0,
              is_approved: false
            )
          end

          token = ::JsonWebToken.encode(user_id: @user.id)
          render_success(
            data: { 
              user: UserSerializer.new(@user), 
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

      def user_params
        permitted = params.require(:user).permit(:email, :password, :password_confirmation, :role)
        permitted[:role] = 'customer' if permitted[:role] == 'admin'
        permitted
      end
    end
  end
end
