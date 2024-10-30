import { Asset } from 'src/modules/asset/entities/asset.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  ManyToOne,
} from 'typeorm';

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { unique: true })
  @Generated('uuid')
  account_id: string;

  @Column({ default: 0 })
  balance: number;

  @ManyToOne(() => Company, (company) => company.accounts)
  company: Company;

  @ManyToOne(() => Asset, (asset) => asset.accounts)
  asset: Asset;
}
