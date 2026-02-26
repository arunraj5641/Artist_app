class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)
    
    if user.role == 'admin'
      can :manage, :all
    elsif user.role == 'artist'
      # Own user account
      can :manage, User, id: user.id
      # Own artist profile
      can :manage, ArtistProfile, user_id: user.id
      # Own services
      can :manage, Service, artist_profile: { user_id: user.id }
      can :create, Service  # Allow creating (controller assigns artist_profile_id)
      can :read, Service    # Allow listing own services
      # Own bookings (received as an artist)
      can :read, Booking, artist_profile: { user_id: user.id }
      can :update, Booking, artist_profile: { user_id: user.id }
      # Own reviews (received)
      can :read, Review, artist_profile: { user_id: user.id }
      # Own availabilities
      can :manage, Availability, artist_profile: { user_id: user.id }
      # Dashboard access
      can :read, :dashboard
    else
      # Customer
      can :manage, User, id: user.id
      # Own bookings
      can :manage, Booking, customer_id: user.id
      # Can browse artists and services
      can :read, ArtistProfile
      can :read, Service
      # Own reviews
      can :manage, Review, customer_id: user.id
      # Dashboard access
      can :read, :dashboard
    end

    # Everyone can read organizations and service categories
    can :read, Organization
    can :read, ServiceCategory
  end
end
