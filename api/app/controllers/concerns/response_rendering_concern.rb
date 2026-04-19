module ResponseRenderingConcern
  extend ActiveSupport::Concern

  def render_success(data: nil, message: 'Success', status: :ok, serializer: nil)
    serialized_data = serialize_data(data, serializer)
    render json: { success: true, message: message, data: serialized_data }, status: status
  end

  def render_error(message: 'Error', status: :unprocessable_entity, errors: nil)
    render json: { success: false, message: message, errors: errors }, status: status
  end
  private
  def serialize_data(data, serializer=nil)
    return nil if data.nil?

    if serializer
      if data.respond_to?(:to_ary)
        ActiveModelSerializers::SerializableResource.new(data, each_serializer: serializer)
      else
        ActiveModelSerializers::SerializableResource.new(data, serializer: serializer)
      end
    else
      ActiveModelSerializers::SerializableResource.new(data)
    end
  end
end
