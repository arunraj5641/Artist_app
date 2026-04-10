require 'swagger_helper'

RSpec.describe 'Api::V1::Bookings', type: :request do
  path '/api/v1/bookings' do
    get 'List bookings' do
      tags 'Bookings'
      produces 'application/json'
      security [bearerAuth: []]
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    post 'Create booking' do
      tags 'Bookings'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :booking, in: :body, schema: { type: :object }
      response '201', 'created' do
        run_test!
      end
    end
  end

  path '/api/v1/bookings/{id}' do
    get 'Get booking' do
      tags 'Bookings'
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

    patch 'Update booking' do
      tags 'Bookings'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :id, in: :path, type: :string
      parameter name: :booking, in: :body, schema: { type: :object }
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    put 'Update booking (put)' do
      tags 'Bookings'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]
      parameter name: :id, in: :path, type: :string
      parameter name: :booking, in: :body, schema: { type: :object }
      response '200', 'success' do
        run_test!
      end


      response '401', 'unauthorized' do

        run_test!

      end
    end

    delete 'Delete booking' do
      tags 'Bookings'
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
path '/api/v1/bookings/my_bookings' do
  get 'List my bookings' do
    tags 'Bookings'
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

path '/api/v1/bookings/artist_bookings' do
  get 'List artist bookings' do
    tags 'Bookings'
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
