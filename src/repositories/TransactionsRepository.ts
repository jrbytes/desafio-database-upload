import { EntityRepository, Repository } from 'typeorm'

import Transaction from '../models/Transaction'

interface Balance {
  income: number
  outcome: number
  total: number
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transaction = await this.find()

    const income = transaction
      .map(i => (i.type === 'income' ? i.value : 0))
      .reduce((acc, item) => acc + item, 0)

    const outcome = transaction
      .map(i => (i.type === 'outcome' ? i.value : 0))
      .reduce((acc, item) => acc + item, 0)

    return { income, outcome, total: income - outcome }
  }
}

export default TransactionsRepository
