import { getCustomRepository, getRepository } from 'typeorm'
import AppError from '../errors/AppError'

import Transaction from '../models/Transaction'
import TransactionsRepository from '../repositories/TransactionsRepository'
import Category from '../models/Category'

interface Request {
  title: string
  value: number
  type: 'income' | 'outcome'
  category: string
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)

    const { total } = await transactionsRepository.getBalance()

    const testIfIsIncomeOrSufficientBalance =
      type === 'income' || (type === 'outcome' && total > value)

    if (!testIfIsIncomeOrSufficientBalance) {
      throw new AppError('Insufficient balance', 400)
    }

    if (typeof value !== 'number') {
      throw new AppError('The value is not a number')
    }

    const categoryRepository = getRepository(Category)
    let existsCategory = await categoryRepository.findOne({
      where: { title: category },
    })

    if (!existsCategory) {
      existsCategory = categoryRepository.create({ title: category })
      await categoryRepository.save(existsCategory)
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: existsCategory,
    })

    await transactionsRepository.save(transaction)

    return transaction
  }
}

export default CreateTransactionService
