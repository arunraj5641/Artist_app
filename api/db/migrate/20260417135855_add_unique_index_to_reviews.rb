class AddUniqueIndexToReviews < ActiveRecord::Migration[8.1]
  def change
    remove_index :reviews, :booking_id
    add_index :reviews, :booking_id, unique: true
  end
end
