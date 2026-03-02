class User < ApplicationRecord
  has_secure_password
  
  has_one :artist_profile, dependent: :destroy
  accepts_nested_attributes_for :artist_profile, update_only: true
  has_many :bookings, foreign_key: :customer_id, dependent: :destroy
  has_many :reviews, foreign_key: :customer_id, dependent: :destroy

  ROLES = %w[admin artist customer].freeze
  STATUSES = %w[active inactive suspended].freeze

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :role, inclusion: { in: ROLES }
  validates :status, inclusion: { in: STATUSES }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }

  after_create :setup_artist_profile, if: -> { artist? && artist_profile.nil? }
  after_update :sync_artist_profile_name, if: -> { saved_change_to_name? && artist? }

  def admin?
    role == 'admin'
  end

  def artist?
    role == 'artist'
  end

  def customer?
    role == 'customer'
  end

  private

  def setup_artist_profile
    create_artist_profile(
      name: name,
      bio: '',
      city: '',
      experience_years: 0,
      base_price: 0
    )
  end

  def sync_artist_profile_name
    artist_profile&.update(name: name)
  end
end
