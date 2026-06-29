import { FastifyInstance } from 'fastify'

import { profile } from '@/http/controllers/profile'
import { usersRoutes } from './controllers/users'
import { authenticateRoutes } from './controllers/authenticate'
import { verifyJwt } from './middlewares/verify-jwt'
import { gymsRoutes } from './controllers/gym'
import { checkInsRoutes } from './controllers/check-ins'
import { refreshTokenRoutes } from './controllers/refresh'

export async function appRoutes(app: FastifyInstance) {
  app.register(usersRoutes, { prefix: 'users' })
  app.register(authenticateRoutes, { prefix: 'sessions' })
  app.register(refreshTokenRoutes, { prefix: 'token' })
  app.register(gymsRoutes, { prefix: 'gyms' })
  app.register(checkInsRoutes, { prefix: 'check-ins' })

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
