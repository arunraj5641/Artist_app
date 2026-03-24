class AddDetailsToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :name, :string
    add_column :users, :phone, :string
    add_column :users, :address, :string
    add_column :users, :loyalty_status, :string
    add_column :users, :preferences, :text
  end
end
