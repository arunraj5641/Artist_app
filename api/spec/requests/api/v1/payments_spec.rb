require 'swagger_helper'

RSpec.describe 'Api::V1::Payments', type: :request do
  path '/api/v1/payments' do
    get 'List payments' do
      tags 'Payments'
      produces 'application/json'
      security [bearerAuth: []]
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    post 'Create payment' do
      tags 'Payments'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :payment, in: :body, schema: { type: :object }
      response '201', 'created' do
        run_test!
      end
    end
  end

  path '/api/v1/payments/{id}' do
    get 'Get payment' do
      tags 'Payments'
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

    patch 'Update payment' do
      tags 'Payments'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :id, in: :path, type: :string
      parameter name: :payment, in: :body, schema: { type: :object }
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    put 'Update payment (put)' do
      tags 'Payments'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :id, in: :path, type: :string
      parameter name: :payment, in: :body, schema: { type: :object }
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    delete 'Delete payment' do
      tags 'Payments'
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
