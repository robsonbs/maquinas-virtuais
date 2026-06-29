import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from '../users/errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
interface ValidateCheckInUseCaseRequest {
  checkInId: string
}
interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}
export class ValidateCheckInUseCase {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}
  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn || checkIn.validated_at) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs().diff(
      checkIn.created_at,
      'minute',
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)
    return {
      checkIn,
    }
  }
}
