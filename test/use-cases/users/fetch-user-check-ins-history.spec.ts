import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '@/use-cases/users/fetch-user-check-ins-history'

describe('Fetch User Check-ins History Use Case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: FetchUserCheckInsHistoryUseCase

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch check-in history', async () => {
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

    const { checkIns } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  // Add test case for when there are no check-ins for the user
  it('should return an empty array when there are no check-ins for the user', async () => {
    const { checkIns } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkIns).toHaveLength(0)
  })
  // Add test case for when the user id is invalid
  it('should return an empty array when the user id is invalid', async () => {
    const { checkIns } = await sut.execute({
      userId: 'invalid-user-id',
    })

    expect(checkIns).toHaveLength(0)
  })
  // Add test case for when the user id is not provided
  it('should return an empty array when the user id is not provided', async () => {
    const { checkIns } = await sut.execute({
      userId: '',
    })

    expect(checkIns).toHaveLength(0)
  })
  // Add test case for when user has more than 20 check-ins but only 20 should be returned
  it('should return only the last 20 check-ins when the user has more than 20 check-ins', async () => {
    for (let i = 0; i < 25; i++) {
      const checkin = await checkInsRepository.create({
        gym_id: `gym-${String(i).padStart(2, '0')}`,
        user_id: 'user-01',
        latitude: -23.123,
        longitude: -46.123,
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkIns).toHaveLength(20)
  })

  // Add test case for when user selected page 2 and there are more than 20 check-ins
  it('should return check-ins for the selected page when there are more than 20 check-ins', async () => {
    for (let i = 0; i < 25; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${String(i).padStart(2, '0')}`,
        user_id: 'user-01',
        latitude: -23.123,
        longitude: -46.123,
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(5)
  })

  // Add test case for when user selected page 3 and there are less than 50 check-ins (20 on the previous page)
  it('should return check-ins for the selected page when there are less than 50 check-ins', async () => {
    for (let i = 0; i < 25; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${String(i).padStart(2, '0')}`,
        user_id: 'user-01',
        latitude: -23.123,
        longitude: -46.123,
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 3,
    })

    expect(checkIns).toHaveLength(0)
  })
})
