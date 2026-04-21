Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  # System Health
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      # Authentication
      post "login", to: "sessions#create"
      post "signup", to: "registrations#create"
      patch "password/update", to: "passwords#update"
      delete "logout", to: "sessions#destroy"
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

      resources :bookings do
        collection do
          get :my_bookings
          get :artist_bookings
        end
        member do
          patch :cancel
        end
      end

      resources :availabilities
      resources :reviews do
        collection do
          get :my_reviews
        end 
      end
      resources :payments

      # Nested: artist availability
      get "artists", to: "artist_profiles#index"
      get "artists/:id", to: "artist_profiles#show"
      get "artists/:id/services", to: "services#artist_services"
      get "artists/:id/availability", to: "availabilities#artist_availability"


      namespace :admin do
         resources :artist_profiles, only: [] do
           member do
             patch :approve
           end
         end
      end
      
    end
  end
end
