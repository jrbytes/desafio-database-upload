import { getCustomRepository } from 'typeorm'
import AppError from '../errors/AppError'
import TransactionsRepository from '../repositories/TransactionsRepository'

interface Response {
  id: string
}
class DeleteTransactionService {
  public async execute({ id }: Response): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)

    const transaction = await transactionsRepository.findOne({ where: { id } })

    if (!transaction) {
      throw new AppError('Certify your transaction ID.', 400)
    }

    await transactionsRepository.delete(transaction)
  }
}

export default DeleteTransactionService
