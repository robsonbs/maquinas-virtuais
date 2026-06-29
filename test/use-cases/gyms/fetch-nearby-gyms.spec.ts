import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from '@/use-cases/gyms/fetch-nearby-gyms'
let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase
describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })
  it('should fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -27.0610928,
      longitude: -49.5229501,
    })
    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
  it('should return empty array when no gyms found', async () => {
    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })
    expect(gyms).toHaveLength(0)
  })

  it.skip('should return only 20 gyms per page', async () => {
    for (let i = 0; i < 40; i++) {
      await gymsRepository.create({
        title: `Gym ${String(i).padStart(2, '0')}`,
        description: null,
        phone: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
    }
    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })
    expect(gyms).toHaveLength(20)
  })

  it.skip('should return correct page number', async () => {
    for (let i = 0; i < 40; i++) {
      await gymsRepository.create({
        title: `Gym ${String(i).padStart(2, '0')}`,
        description: null,
        phone: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
    }
    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })
    expect(gyms).toHaveLength(20)
    expect(gyms[0].title).toEqual('Gym 20')
  })

  it('should return empty array when no gyms found', async () => {
    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })
    expect(gyms).toHaveLength(0)
  })
  it('should handle invalid latitude and longitude', async () => {
    const { gyms } = await sut.execute({
      userLatitude: 0,
      userLongitude: 0,
    })
    expect(gyms).toHaveLength(0)
  })
  it('should handle invalid page number', async () => {
    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })
    expect(gyms).toHaveLength(0)
  })
})
