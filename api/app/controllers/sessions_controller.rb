class SessionsController < ApplicationController
  skip_before_action :authorize_request, only: :create

  # POST /login
  def create
    @user = User.find_by_email(params[:email])
    if @user&.authenticate(params[:password])
      token = ::JsonWebToken.encode(user_id: @user.id)
      time = Time.now + 24.hours.to_i
      render_success(
        data: { 
          token: token, 
          exp: time.strftime("%m-%d-%Y %H:%M"),
          email: @user.email,
          name: @user.name,
          role: @user.role
        }, 
        message: 'Login successful'
      )
    else
      render_error(message: 'Invalid credentials', status: :unauthorized)
    end
  end

  private

  def login_params
    params.permit(:email, :password)
  end
end
