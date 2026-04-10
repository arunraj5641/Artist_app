require 'swagger_helper'

RSpec.describe 'Api::V1::Dashboard', type: :request do
  path '/api/v1/dashboard' do
    get 'Get main dashboard stats' do
      tags 'Dashboard'
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

  path '/api/v1/dashboard/admin' do
    get 'Get admin dashboard stats' do
      tags 'Dashboard'
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

  path '/api/v1/dashboard/artist' do
    get 'Get artist dashboard stats' do
      tags 'Dashboard'
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
end
