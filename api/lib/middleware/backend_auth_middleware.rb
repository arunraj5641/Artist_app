require_relative '../json_web_token'

module Middleware
  class BackendAuthMiddleware
    def initialize(app)
      @app = app
    end

    def call(env)
      request = ActionDispatch::Request.new(env)
      
      # We only care about API routes for this middleware
      return @app.call(env) unless request.path.start_with?('/api/v1')

      # 1. Decode JWT
      auth_header = env['HTTP_AUTHORIZATION']
      token = auth_header&.split(' ')&.last
      
      if token
        begin
          decoded = JsonWebToken.decode(token)
          
          # 2. Attach user to request
          # We fetch the user and put it in the env hash for controllers to use
          user = User.find(decoded[:user_id])
          env['current_user'] = user

          # 3. Verify client role = backend
          # We define "backend" users as those with role 'admin' or 'artist'
          is_backend_user = ['admin', 'artist'].include?(user.role)

          # Logic for "Restrict access to CLIENT routes"
          # If the user is a backend user, we restrict them from routes 
          # that are specifically designated for regular clients (customers).
          if is_backend_user && client_only_route?(request.path, request)
            return [403, { 'Content-Type' => 'application/json' }, [{ 
              status: 'error',
              message: 'Access Restricted: Backend users cannot access client-only routes',
              code: 'RESTRICTED_TO_CLIENT'
            }.to_json]]
          end

          # Conversely, if it's a backend route, ensure they are backend users
          if backend_route?(request.path) && !is_backend_user
             return [403, { 'Content-Type' => 'application/json' }, [{ 
              status: 'error',
              message: 'Access Restricted: Backend role required',
              code: 'BACKEND_ROLE_REQUIRED'
            }.to_json]]
          end

        rescue JWT::DecodeError => e
          return [401, { 'Content-Type' => 'application/json' }, [{ 
            status: 'error',
            message: 'Invalid token',
            errors: [e.message]
          }.to_json]]
        rescue ActiveRecord::RecordNotFound => e
          return [401, { 'Content-Type' => 'application/json' }, [{ 
            status: 'error',
            message: 'User not found',
            errors: [e.message]
          }.to_json]]
        end
      end

      @app.call(env)
    end

    private

    # Routes that are considered "Backend" (Admin/Artist territory)
    def backend_route?(path)
      path.include?('/admin/') || 
      path.include?('/dashboard/artist') || 
      path.include?('/dashboard/admin') ||
      path.include?('/artist_bookings')
    end

    # Routes that are strictly for regular clients (customers)
    # Examples might include booking a new service (from customer side)
    def client_only_route?(path, request)
      # For now, let's assume specific "customer" dashboard or profile management paths
      # might be client-only. This can be expanded as needed.
      path.include?('/dashboard/customer') || 
      (path.include?('/bookings') && !path.include?('/artist_bookings') && ['POST', 'DELETE'].include?(request.request_method))
    end
  end
end
