module ResponseRenderingConcern
  extend ActiveSupport::Concern

  def render_success(data: nil, message: 'Success', status: :ok)
    serialized_data = serialize_data(data)
    render json: { success: true, message: message, data: serialized_data }, status: status
  end

  def render_error(message: 'Error', status: :unprocessable_entity, errors: nil)
    render json: { success: false, message: message, errors: errors }, status: status
  end
  private
  def serialize_data(data)
    return nil if data.nil?
     ActiveModelSerializers::SerializableResource.new(data) 
    end
end
