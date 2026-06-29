import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const registerUserUseCase = new RegisterUseCase(usersRepository)

  return registerUserUseCase
}
