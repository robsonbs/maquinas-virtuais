import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { UserAlreadyExistsError } from '@/use-cases/users/errors/user-already-exists-error'

import { RegisterUseCase } from '@/use-cases/users/register'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase
describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should register a new user', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    }

    // Act
    const { user } = await sut.execute(userData)

    // Assert
    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'
    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })
    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
