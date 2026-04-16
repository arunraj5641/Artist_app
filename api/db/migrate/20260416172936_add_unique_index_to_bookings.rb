class AddUniqueIndexToBookings < ActiveRecord::Migration[8.1]
  def change
    add_index :bookings,
             [:artist_profile_id, :booking_date, :start_time],
             unique: true,
             name: "index_unique_artist_time_slot"
  end
end
