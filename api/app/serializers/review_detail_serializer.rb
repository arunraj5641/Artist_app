class ReviewDetailSerializer < ActiveModel::Serializer
  attributes :id,
             :rating,
             :comment,
             :artist_name,
             :created_at

  def artist_name
    object.artist_profile&.name || object.artist_profile&.user&.email
  end
end