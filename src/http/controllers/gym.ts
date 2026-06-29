import { prisma } from '@/lib/prisma'
import { makeCreateGymUseCase } from '@/use-cases/gyms/factories/make-create-gym-use-case'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/gyms/factories/make-fetch-nearby-gyms-use-case'
import { makeSearchGymsUseCase } from '@/use-cases/gyms/factories/make-search-gyms-use-case'
import { makeCheckInUseCase } from '@/use-cases/users/factories/make-check-in-use-case'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.get('/', async (req, res) => {
    const gyms = await prisma.gym.findMany()
    res.send(gyms)
  })

  //   app.get('/:id', async (request, reply) => {})

  //   app.put('/:id', async (request, reply) => {})

  //   app.delete('/:id', async (request, reply) => {})

  //   app.patch('/:id', async (request, reply) => {})

  app.get('/search', async (request, reply) => {
    const searchGymsQuerySchema = z.object({
      q: z.string(),
      page: z.coerce.number().int().positive().default(1),
    })

    const { q: query, page } = searchGymsQuerySchema.parse(request.query)

    const searchUseCase = makeSearchGymsUseCase()

    const { gyms } = await searchUseCase.execute({ query, page })

    return reply.status(200).send({ gyms })
  })
  app.get('/nearby', async (request, reply) => {
    const searchGymsQuerySchema = z.object({
      latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
      longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
    })

    const { latitude: userLatitude, longitude: userLongitude } =
      searchGymsQuerySchema.parse(request.query)

    const featchNearbyUseCase = makeFetchNearbyGymsUseCase()

    const { gyms } = await featchNearbyUseCase.execute({
      userLatitude,
      userLongitude,
    })

    return reply.status(200).send({ gyms })
  })

  app.post(
    '/',
    { onRequest: [verifyUserRole('ADMIN')] },
    async (request, reply) => {
      const createGymBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine((value) => Math.abs(value) <= 90),
        longitude: z.number().refine((value) => Math.abs(value) <= 180),
      })

      const { title, description, phone, latitude, longitude } =
        createGymBodySchema.parse(request.body)

      const registerUserUseCase = makeCreateGymUseCase()
      await registerUserUseCase.execute({
        title,
        description,
        phone,
        latitude,
        longitude,
      })
      return reply.status(201).send()
    },
  )

  app.post('/:gymId/check-ins', async (request, reply) => {
    const createCheckInParams = z.object({
      gymId: z.string().uuid(),
    })
    const { gymId } = createCheckInParams.parse(request.params)
    const createCheckInBodySchema = z.object({
      latitude: z.number().refine((value) => Math.abs(value) <= 90),
      longitude: z.number().refine((value) => Math.abs(value) <= 180),
    })

    const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

    const checkInUseCase = makeCheckInUseCase()
    await checkInUseCase.execute({
      gymId,
      userId: request.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    })
    return reply.status(201).send()
  })
}
