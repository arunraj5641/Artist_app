module Paginatable
  extend ActiveSupport::Concern

  def paginate(scope, per_page = 10)
    scope.page(params[:page]).per(params[:per_page] || per_page)
  end

  def pagination_meta(scope)
    {
      current_page: scope.current_page,
      next_page: scope.next_page,
      prev_page: scope.prev_page,
      total_pages: scope.total_pages,
      total_count: scope.total_count
    }
  end

  def render_paginated_success(scope, message: 'Success', status: :ok, extra_meta: {}, serialized_data: nil)
    render json: {
      success: true,
      message: message,
      data: serialized_data || scope,
      meta: pagination_meta(scope).merge(extra_meta)
    }, status: status
  end
end
