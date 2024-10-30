import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_profile')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { unique: true })
  @Generated('uuid')
  profile_id: string;

  @Column()
  image: string;

  @Column({ type: 'date' })
  dateRegistered: Date;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;


  @Column({ default: '' })
  phoneNumber: string;

  @Column({ default: '' })
  streetAddress: string;

  @Column({ default: '' })
  city: string;

  @Column({ default: '' })
  state: string;

  @Column({ default: '' })
  zipCode: string;

  @Column({ default: '' })
  country: string;

  @OneToOne(() => User)
  user: User;
}
