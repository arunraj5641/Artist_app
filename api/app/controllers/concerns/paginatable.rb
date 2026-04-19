module Paginatable
  extend ActiveSupport::Concern

  def paginate(scope, per_page = 10)
    scope.page(params[:page]).per(params[:per_page] || per_page)
  end

  def render_paginated_success(scope, message: 'Success', status: :ok, serializer: nil, extra_meta: {})
    paginated_scope = paginate(scope)
    serialized_data = serialize_data(paginated_scope, serializer)
    meta = {
      current_page: paginated_scope.current_page,
      next_page: paginated_scope.next_page,
      prev_page: paginated_scope.prev_page,
      total_pages: paginated_scope.total_pages,
      total_count: paginated_scope.total_count
    }.merge(extra_meta || {})

    render json: {
      success: true,
      message: message,
      data: serialized_data,
      meta: meta
    }, status: status
  end
end
