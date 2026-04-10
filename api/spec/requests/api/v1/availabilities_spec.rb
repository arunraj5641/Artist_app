require 'swagger_helper'

RSpec.describe 'Api::V1::Availabilities', type: :request do
  path '/api/v1/availabilities' do
    get 'List availabilities' do
      tags 'Availabilities'
      produces 'application/json'
      security [bearerAuth: []]
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    post 'Create availability' do
      tags 'Availabilities'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :availability, in: :body, schema: { type: :object }
      response '201', 'created' do
        run_test!
      end
    end
  end

  path '/api/v1/availabilities/{id}' do
    get 'Get availability' do
      tags 'Availabilities'
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

    patch 'Update availability' do
      tags 'Availabilities'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :id, in: :path, type: :string
      parameter name: :availability, in: :body, schema: { type: :object }
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    put 'Update availability (put)' do
      tags 'Availabilities'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :id, in: :path, type: :string
      parameter name: :availability, in: :body, schema: { type: :object }
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    delete 'Delete availability' do
      tags 'Availabilities'
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
