# Setup Artist & Customer
artist_user = User.find_or_create_by!(email: 'artist@test.com') do |u|
  u.password = 'password123'
  u.role = 'artist'
end

artist_profile = artist_user.artist_profile || artist_user.create_artist_profile!(
  bio: "Professional makeup artist specializing in bridal and party looks.",
  base_price: 5000,
  city: "Mumbai",
  experience_years: 5,
  is_approved: true
)

customer_user = User.find_or_create_by!(email: 'customer@test.com') do |u|
  u.password = 'password123'
  u.role = 'customer'
end

# Setup Category
cat = ServiceCategory.find_or_create_by!(name: 'Makeup')

# Create Services
bridal = Service.find_or_create_by!(name: 'Bridal Makeup', artist_profile_id: artist_profile.id) do |s|
  s.description = 'Full bridal package'
  s.price = 15000
  s.duration_minutes = 180
  s.service_category = cat
end

party = Service.find_or_create_by!(name: 'Party Makeup', artist_profile_id: artist_profile.id) do |s|
  s.description = 'Evening party look'
  s.price = 3500
  s.duration_minutes = 90
  s.service_category = cat
end

# Create Bookings
# Completed Bookings
[7, 5, 3].each do |days_ago|
  b = Booking.create!(
    artist_profile_id: artist_profile.id,
    customer_id: customer_user.id,
    service_id: party.id,
    booking_date: Date.today - days_ago,
    start_time: '10:00:00',
    end_time: '11:30:00',
    status: 'completed',
    total_amount: party.price
  )
  Payment.create!(booking_id: b.id, amount: b.total_amount, payment_status: 'completed')
  Review.create!(booking_id: b.id, artist_profile_id: artist_profile.id, customer_id: customer_user.id, rating: rand(4..5), comment: 'Great job!')
end

# Pending Bookings
[1, 2].each do |days_out|
  Booking.create!(
    artist_profile_id: artist_profile.id,
    customer_id: customer_user.id,
    service_id: bridal.id,
    booking_date: Date.today + days_out,
    start_time: '09:00:00',
    end_time: '12:00:00',
    status: 'pending',
    total_amount: bridal.price
  )
end

# Confirmed Bookings
[3, 5].each do |days_out|
  Booking.create!(
    artist_profile_id: artist_profile.id,
    customer_id: customer_user.id,
    service_id: bridal.id,
    booking_date: Date.today + days_out,
    start_time: '14:00:00',
    end_time: '17:00:00',
    status: 'confirmed',
    total_amount: bridal.price
  )
end

puts '✅ Successfully seeded:'
puts "- 3 Completed Bookings with Payments & Reviews"
puts "- 2 Pending Bookings"
puts "- 2 Confirmed Bookings"
