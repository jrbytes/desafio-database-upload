import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

import Category from './Category'

export type TransactionType = 'income' | 'outcome'

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ type: 'decimal', precision: 17, scale: 2 })
  value: number

  @Column({
    type: 'enum',
    enum: ['income', 'outcome'],
    default: 'income',
  })
  type: TransactionType

  @Column()
  category_id: string

  @ManyToOne(() => Category, category => category.id, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category

  @CreateDateColumn({ select: false })
  created_at: Date

  @UpdateDateColumn({ select: false })
  updated_at: Date
}

export default Transaction
