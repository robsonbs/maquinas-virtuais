import { InvalidCredentialsError } from '@/use-cases/users/errors/invalid-credentials-error'
import { makeAuthenticateUserUseCase } from '@/use-cases/users/factories/make-authenticate-use-case'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function authenticateRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const authenticateBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)
    try {
      const autenticateUserUseCase = makeAuthenticateUserUseCase()
      const { user } = await autenticateUserUseCase.execute({ email, password })
      const token = await reply.jwtSign(
        {
          role: user.role,
        },
        {
          sign: {
            sub: user.id,
          },
        },
      )
      const refreshToken = await reply.jwtSign(
        {
          role: user.role,
        },
        {
          sign: {
            sub: user.id,
            expiresIn: '7d',
          },
        },
      )

      return reply
        .setCookie('refreshToken', refreshToken, {
          path: '/',
          secure: true,
          sameSite: true,
          httpOnly: true,
        })
        .status(200)
        .send({
          token,
        })
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        return reply.status(err.statusCode).send({ message: err.message })
      }

      throw err
    }
  })
}
