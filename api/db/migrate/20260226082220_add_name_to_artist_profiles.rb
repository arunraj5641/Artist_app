class AddNameToArtistProfiles < ActiveRecord::Migration[8.1]
  def change
    add_column :artist_profiles, :name, :string
  end
end
