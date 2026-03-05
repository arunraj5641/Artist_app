class ReviewDetailSerializer < ActiveModel::Serializer
  attributes :id,
             :rating,
             :comment,
             :created_at
end