class BookingSerializer < ActiveModel::Serializer
  attributes :id,
             :booking_date,
             :start_time,
             :end_time,
             :status,
             :total_amount,
             :created_at,
             :artist,
             :service,
             :customer

  def total_amount
    object.total_amount.to_f
  end

  def start_time
    object.start_time&.strftime("%H:%M")
  end

  def end_time
    object.end_time&.strftime("%H:%M")
  end

  def artist
    user = object.artist_profile&.user
    return nil unless user

    {
      id: user.id,
      email: user.email,
      name: user.name
    }
  end

  def service
    s = object.service
    return nil unless s

    {
      id: s.id,
      name: s.name,
      price: s.price.to_f,
      duration_minutes: s.duration_minutes
    }
  end

  def customer
    c = object.customer
    return nil unless c

    {
      id: c.id,
      email: c.email,
      name: c.name
    }
  end
end