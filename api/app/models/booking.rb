class Booking < ApplicationRecord
  belongs_to :service
  belongs_to :artist_profile
   has_one :payment, dependent: :destroy
  has_one :review, dependent: :destroy
end
