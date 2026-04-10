require 'swagger_helper'

RSpec.describe 'Api::V1::ArtistProfiles', type: :request do
  path '/api/v1/artist_profiles' do
    get 'List artist_profiles' do
      tags 'ArtistProfiles'
      produces 'application/json'
      security [bearerAuth: []]
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    post 'Create artist_profile' do
      tags 'ArtistProfiles'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :artist_profile, in: :body, schema: { type: :object }
      response '201', 'created' do
        run_test!
      end
    end
  end

  path '/api/v1/artist_profiles/{id}' do
    get 'Get artist_profile' do
      tags 'ArtistProfiles'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :id, in: :path, type: :string
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    patch 'Update artist_profile' do
      tags 'ArtistProfiles'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :id, in: :path, type: :string
      parameter name: :artist_profile, in: :body, schema: { type: :object }
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    put 'Update artist_profile (put)' do
      tags 'ArtistProfiles'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :id, in: :path, type: :string
      parameter name: :artist_profile, in: :body, schema: { type: :object }
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    delete 'Delete artist_profile' do
      tags 'ArtistProfiles'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :id, in: :path, type: :string
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end
  end
end
