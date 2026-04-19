class Review < ApplicationRecord
  belongs_to :booking
  belongs_to :artist_profile

  validates :rating, presence: true, inclusion: { in: 1..5 }
  validates :booking_id, presence: true, uniqueness: true

  after_commit :update_artist_rating, if: :saved_change_to_rating?
  after_commit :update_artist_rating, on: :destroy

  private

  def update_artist_rating
    return unless artist_profile

    avg = artist_profile.reviews.average(:rating) || 0
    artist_profile.update_column(:rating, avg)
  end
end