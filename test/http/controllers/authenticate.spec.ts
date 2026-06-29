import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to authenticate user', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
    })
    const response = await request(app.server).post('/sessions').send({
      email: 'john@example.com',
      password: 'password',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('token')
    expect(typeof response.body.token).toBe('string')
  }) // should be able to authenticate user (400ms)
})
