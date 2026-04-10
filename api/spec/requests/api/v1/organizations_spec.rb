require 'swagger_helper'

RSpec.describe 'Api::V1::Organizations', type: :request do
  path '/api/v1/organizations' do
    get 'List organizations' do
      tags 'Organizations'
      produces 'application/json'
      security [bearerAuth: []]
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    post 'Create organization' do
      tags 'Organizations'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :organization, in: :body, schema: { type: :object }
      response '201', 'created' do
        run_test!
      end
    end
  end

  path '/api/v1/organizations/{id}' do
    get 'Get organization' do
      tags 'Organizations'
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

    patch 'Update organization' do
      tags 'Organizations'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :id, in: :path, type: :string
      parameter name: :organization, in: :body, schema: { type: :object }
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    put 'Update organization (put)' do
      tags 'Organizations'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :id, in: :path, type: :string
      parameter name: :organization, in: :body, schema: { type: :object }
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    delete 'Delete organization' do
      tags 'Organizations'
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
