import { prisma } from '@/lib/prisma'
import { UserAlreadyExistsError } from '@/use-cases/users/errors/user-already-exists-error'
import { makeRegisterUserUseCase } from '@/use-cases/users/factories/make-register-use-case'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async (req, res) => {
    const users = await prisma.user.findMany()
    res.send(users)
  })

  app.get('/:id', async (request, reply) => {})

  app.put('/:id', async (request, reply) => {})
  app.delete('/:id', async (request, reply) => {})
  app.patch('/:id', async (request, reply) => {})
  // Register a new user
  app.post('/', async (request, reply) => {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { name, email, password } = registerBodySchema.parse(request.body)
    try {
      const registerUserUseCase = makeRegisterUserUseCase()
      await registerUserUseCase.execute({ name, email, password })
      return reply.status(201).send()
    } catch (err: unknown) {
      if (err instanceof UserAlreadyExistsError) {
        return reply.status(err.statusCode).send({ message: err.message })
      }

      throw err
    }
  })
}
