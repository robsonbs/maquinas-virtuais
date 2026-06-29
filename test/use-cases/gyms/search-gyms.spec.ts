import { SearchGymsUseCase } from '@/use-cases/gyms/search-gyms'
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase
describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })
  it('should to search gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    await gymsRepository.create({
      title: 'Node.js Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms[0].title).toEqual('JavaScript Gym')
  })
  it('should to return empty array when no gyms found', async () => {
    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })
    expect(gyms).toHaveLength(0)
  })
  it('should to return only 20 gyms per page', async () => {
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
      query: '',
      page: 1,
    })
    expect(gyms).toHaveLength(20)

    const { gyms: gyms2 } = await sut.execute({
      query: '',
      page: 2,
    })
    expect(gyms2).toHaveLength(20)
  })
  it('should to return correct page number', async () => {
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
      query: '',
      page: 3,
    })
    expect(gyms).toHaveLength(0)

    const { gyms: gyms2 } = await sut.execute({
      query: '',
      page: 4,
    })
    expect(gyms2).toHaveLength(0)
  })

  it('should to return empty array when no gyms found', async () => {
    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })
    expect(gyms).toHaveLength(0)
  })
  it('should to return only 20 gyms per page', async () => {
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
      query: '',
      page: 1,
    })
    expect(gyms).toHaveLength(20)
    const { gyms: gyms2 } = await sut.execute({
      query: '',
      page: 2,
    })
    expect(gyms2).toHaveLength(20)
  })
  it('should to return correct page number', async () => {
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
      query: '',
      page: 3,
    })
    expect(gyms).toHaveLength(0)
    const { gyms: gyms2 } = await sut.execute({
      query: '',
      page: 4,
    })
    expect(gyms2).toHaveLength(0)
  })
})
