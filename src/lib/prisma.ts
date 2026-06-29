import { env } from '@/env'
import { PrismaClient } from '../../generated/prisma'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : [],
  // debug: true,
})
