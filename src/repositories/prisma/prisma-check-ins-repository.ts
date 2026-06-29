import { prisma } from '@/lib/prisma'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'
import { CheckIn, Prisma } from '@prisma/client'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
    return prisma.checkIn.findUnique({ where: { id } })
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    return prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })
  }

  async findManyByUserId(userId: string, page: number) {
    return prisma.checkIn.findMany({
      where: { user_id: userId },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async countByUserId(userId: string) {
    return prisma.checkIn.count({ where: { user_id: userId } })
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    return prisma.checkIn.create({ data })
  }

  async save(checkIn: CheckIn) {
    return prisma.checkIn.update({ where: { id: checkIn.id }, data: checkIn })
  }
}
