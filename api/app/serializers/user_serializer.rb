class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :role, :status, :name, :phone, :address, :loyalty_status, :preferences, :created_at, :updated_at
  has_one :artist_profile
end
