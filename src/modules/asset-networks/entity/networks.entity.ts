import { AssetFeeScheme } from 'src/modules/asset-fee-scheme/entity/asset-fee-scheme.entity';
import { AssetInformation } from 'src/modules/asset/entities/asset-information.entity';
import { AssetFeePolicy } from 'src/modules/asset/entities/asset-policy.entity';
import { Asset } from 'src/modules/asset/entities/asset.entity';
import { Node } from 'src/modules/asset-node/entity/node.entity';
import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('networks')
export class Network {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { unique: true })
  @Generated('uuid')
  network_id: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @ManyToOne(() => Asset, (asset) => asset.networks, { onDelete: 'CASCADE' })
  asset: Asset;

  @OneToMany(() => Node, (node) => node.network)
  nodes: Node[];

  @OneToMany(() => AssetInformation, (assetInfo) => assetInfo.network)
  assetInformation: AssetInformation[];

  @OneToMany(() => AssetFeePolicy, (assetPolicy) => assetPolicy.network)
  assetFeePolicy: AssetFeePolicy[];

  @OneToMany(() => AssetFeeScheme, (feeScheme) => feeScheme.network)
  feeSchemes: AssetFeeScheme[];
}
