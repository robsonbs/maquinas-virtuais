import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'

describe('Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a new gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    const gymResponse = await request(app.server)
      .post('/gyms')
      .send({
        title: 'JavaScript Gym',
        description: null,
        phone: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
      .set('Authorization', `Bearer ${token}`)

    expect(gymResponse.statusCode).toEqual(201)
  }) // should be able to create a new gym (400ms)
})
