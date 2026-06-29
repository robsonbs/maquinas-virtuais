import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from '@/use-cases/users/get-user-metrics'
import { beforeEach, describe, expect, it } from 'vitest'

// create a new suite of tests for the GetUserMetricsUseCase class
describe('GetUserMetricsUseCase', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: GetUserMetricsUseCase

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get the user metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
      latitude: -23.123,
      longitude: -46.123,
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
      latitude: -23.123,
      longitude: -46.123,
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toBe(2)
  })

  it('should return 0 when there are no check-ins for the user', async () => {
    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toBe(0)
  })

  it('should return 0 when the user id is invalid', async () => {
    const { checkInsCount } = await sut.execute({
      userId: 'invalid-user-id',
    })

    expect(checkInsCount).toBe(0)
  })

  it('should return 0 when the user id is not provided', async () => {
    const { checkInsCount } = await sut.execute({
      userId: '',
    })

    expect(checkInsCount).toBe(0)
  })
})
