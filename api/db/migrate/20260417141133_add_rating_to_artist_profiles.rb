class AddRatingToArtistProfiles < ActiveRecord::Migration[8.1]
  def change
    add_column :artist_profiles, :rating, :decimal, precision: 3, scale: 2, default: 0
  end
end
