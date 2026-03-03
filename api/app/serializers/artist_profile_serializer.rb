class ArtistProfileSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :email,
             :city,
             :bio,
             :experience_years,
             :base_price,
             :is_approved,
             :services_count,
             :bookings_count,
             :reviews_count,
             :created_at

  def name
    object.user&.email # change if you have name column
  end

  def email
    object.user&.email
  end

  def services_count
    object.services.size
  end

  def bookings_count
    object.bookings.size
  end

  def reviews_count
    object.reviews.size
  end
end