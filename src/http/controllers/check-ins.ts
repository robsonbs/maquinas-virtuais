import { makeValidateCheckInUseCase } from '@/use-cases/check-ins/factories/make-validate-check-ins-use-case'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/users/factories/make-fetch-user-check-ins-history-use-case'
import { makeGetUserMetricsUseCase } from '@/use-cases/users/factories/make-get-user-metrics-use-case'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { verifyJwt } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.get('/history', async (request, reply) => {
    const checkInHistoryQuerySchema = z.object({
      page: z.coerce.number().min(1).default(1),
    })

    const { page } = checkInHistoryQuerySchema.parse(request.query)

    const fetchUserCheckInsHistoryUseCase =
      makeFetchUserCheckInsHistoryUseCase()

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      page,
      userId: request.user.sub,
    })

    return reply.status(200).send({
      checkIns,
    })
  })

  app.get('/metrics', async (request, reply) => {
    const getUserMetricsUseCase = makeGetUserMetricsUseCase()

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: request.user.sub,
    })

    return reply.status(200).send({
      checkInsCount,
    })
  })

  app.patch(
    '/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    async (request, reply) => {
      const validateCheckInParamsSchema = z.object({
        checkInId: z.string().uuid(),
      })
      const { checkInId } = validateCheckInParamsSchema.parse(request.params)

      const validateCheckInUseCase = makeValidateCheckInUseCase()

      await validateCheckInUseCase.execute({
        checkInId,
      })

      return reply.status(204).send()
    },
  )
  //   app.get('/:id', async (request, reply) => {})

  //   app.put('/:id', async (request, reply) => {})

  //   app.delete('/:id', async (request, reply) => {})

  //   app.patch('/:id', async (request, reply) => {})
}
