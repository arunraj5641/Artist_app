require 'swagger_helper'

RSpec.describe 'Api::V1::Artists', type: :request do
  path '/api/v1/artists' do
    get 'List all artists' do
      tags 'Artists'
      produces 'application/json'
      security [bearerAuth: []]
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end
  end

  path '/api/v1/artists/{id}' do
    get 'Get artist details' do
      tags 'Artists'
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

  path '/api/v1/artists/{id}/services' do
    get 'Get artist services' do
      tags 'Artists'
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

  path '/api/v1/artists/{id}/availability' do
    get 'Get artist availability' do
      tags 'Artists'
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
