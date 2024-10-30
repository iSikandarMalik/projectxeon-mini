import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Generated,
} from 'typeorm';
import { Company } from 'src/modules/company/entities/company.entity';

@Entity('wallet_users')
export class WalletUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { unique: true })
  @Generated('uuid')
  wallet_user_id: string;

  @Column()
  email: string;

  @Column()
  mobileNumber: string;

  @Column()
  walletName: string;

  @Column()
  passcode: string;

  @Column()
  userName: string;

  @ManyToOne(() => Company, (company) => company.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
