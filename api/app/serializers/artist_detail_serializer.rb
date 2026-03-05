class ArtistDetailSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :email,
             :city,
             :bio,
             :experience_years,
             :base_price,
             :is_approved,
             :created_at

  has_many :services, serializer: ServiceDetailSerializer
  has_many :reviews, serializer: ReviewDetailSerializer

  def name
    object.user&.name
  end

  def email
    object.user&.email
  end
end