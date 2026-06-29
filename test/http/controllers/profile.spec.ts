import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toHaveProperty('name')
    expect(profileResponse.body.user).toHaveProperty('email')
    expect(typeof profileResponse.body.user.name).toBe('string')
    expect(typeof profileResponse.body.user.email).toBe('string')
    expect(profileResponse.body.user.id).toEqual(expect.any(String))

    const { name, email, id } = profileResponse.body.user
    expect(name).toEqual('John Doe')
    expect(email).toEqual('john@example.com')
    expect(id).toEqual(expect.any(String))
  }) // should be able to get user profile (400ms)
})
