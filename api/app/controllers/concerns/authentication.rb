module Authentication
  extend ActiveSupport::Concern

  included do
    before_action :authorize_request
  end

  def authorize_request
    # Use user already attached by middleware if available
    @current_user = request.env['current_user']
    return if @current_user

    header = request.headers['Authorization']
    header = header.split(' ').last if header
    begin
      @decoded = ::JsonWebToken.decode(header)
      @current_user = User.find(@decoded[:user_id])
    rescue ActiveRecord::RecordNotFound => e
      render_error(message: 'User not found', status: :unauthorized, errors: [e.message])
    rescue ::JWT::DecodeError => e
      render_error(message: 'Invalid token', status: :unauthorized, errors: [e.message])
    end
  end

  def current_user
    @current_user
  end
end
