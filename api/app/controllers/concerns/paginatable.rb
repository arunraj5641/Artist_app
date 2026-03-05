module Paginatable
  extend ActiveSupport::Concern

  def paginate(scope, per_page = 10)
    scope.page(params[:page]).per(params[:per_page] || per_page)
  end

  def render_paginated_success(scope, message: 'Success', status: :ok)
    serialized_data = ActiveModelSerializers::SerializableResource.new(scope)
    render json: {
      success: true,
      message: message,
      data: serialized_data,
    }, status: status
  end
end
