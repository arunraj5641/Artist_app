require 'swagger_helper'

RSpec.describe 'Api::V1::Sessions', type: :request do
  path '/api/v1/login' do
    post 'Login' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :credentials, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string, example: 'user@example.com' },
          password: { type: :string, example: 'password123' }
        },
        required: [ 'email', 'password' ]
      }

      response '200', 'login successful' do
        schema type: :object,
               properties: {
                 data: {
                   type: :object,
                   properties: {
                     token: { type: :string },
                     exp: { type: :string },
                     id: { type: :integer },
                     email: { type: :string },
                     role: { type: :string }
                   }
                 },
                 message: { type: :string }
               }
        
        run_test!
      end

      response '401', 'invalid credentials' do
        run_test!
      end
    end
  end

  path '/api/v1/logout' do
    delete 'Logout' do
      tags 'Authentication'
      produces 'application/json'
      security [bearerAuth: []]

      response '200', 'logged out successfully' do
        run_test!
      end
    end
  end

  path '/api/v1/profile' do
    get 'Get current user profile' do
      tags 'Profile'
      produces 'application/json'
      security [bearerAuth: []]

      response '200', 'profile retrieved' do
        run_test!
      end

      response '401', 'unauthorized' do
        run_test!
      end
    end

    patch 'Update profile' do
      tags 'Profile'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :profile, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          phone: { type: :string },
          address: { type: :string },
          preferences: { type: :string },
          password: { type: :string },
          password_confirmation: { type: :string }
        }
      }

      response '200', 'profile updated' do
        run_test!
      end
      
      response '422', 'invalid request' do
        run_test!
      end

      response '401', 'unauthorized' do
        run_test!
      end
    end

    delete 'Delete profile' do
      tags 'Profile'
      produces 'application/json'
      security [bearerAuth: []]

      response '200', 'account deleted' do
        run_test!
      end

      response '401', 'unauthorized' do
        run_test!
      end
    end
  end
end
