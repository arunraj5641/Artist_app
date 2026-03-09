Rails.application.routes.draw do
  # System Health
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      # Authentication
      post "login", to: "sessions#create"
      post "signup", to: "registrations#create"
      patch "password/update", to: "passwords#update"
      delete "logout", to: "sessions#destroy"
      get "me", to: "sessions#me"
      get "profile", to: "sessions#me"
      patch "profile", to: "sessions#update_profile"
      delete "profile", to: "sessions#delete_profile"

      # Dashboard
      get "dashboard", to: "dashboard#index"
      get "dashboard/admin", to: "dashboard#admin"
      get "dashboard/artist", to: "dashboard#artist"

      # Resources
      resources :users
      resources :artist_profiles
      resources :services
      resources :service_categories
      resources :organizations
      get "artists/:id", to: "artist_profiles#show"
      resources :bookings do
        collection do
          get :my_bookings
          get :artist_bookings
        end
      end

      resources :availabilities
      resources :reviews
      resources :payments

      # Nested: artist availability
      get "artists/:artist_id/availability", to: "availabilities#artist_availability"
      get "artists/:id/services", to: "services#artist_services"
      
    end
  end
end
