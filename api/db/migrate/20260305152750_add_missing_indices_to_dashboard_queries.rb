class AddMissingIndicesToDashboardQueries < ActiveRecord::Migration[8.1]
  def change
    add_index :bookings, :customer_id unless index_exists?(:bookings, :customer_id)
    add_index :reviews, :customer_id unless index_exists?(:reviews, :customer_id)
    
    # Compound index for the 'upcoming' filter which is frequently used on the dashboard
    add_index :bookings, [:status, :booking_date]
  end
end
