import { IsEmail } from 'class-validator';
import { Session } from 'src/modules/session/entities/session.entity';
import { Company } from 'src/modules/company/entities/company.entity'; // Import the Company entity
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile } from './user-profile.entity';
import { Permission } from 'src/modules/company-teams/entity/user-permission.entity';
import { ActivityLog } from 'src/modules/company-teams/entity/user-activity-logs.entity';
import { PrivateNotes } from 'src/modules/private-notes/entity/private-notes.entity';

@Entity('user')
@Unique(['email', 'company'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { unique: true, nullable: true })
  user_id: string;

  @BeforeInsert()
  generateId() {
    this.user_id = uuidv4();
  }

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  created_at: Date;

  @BeforeInsert()
  setCreationDate() {
    this.created_at = new Date();
  }

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated_at: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }

  @Column({ default: false })
  status: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  role: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  authenticator_secret: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  // Use company_id as an integer foreign key
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToOne(() => UserProfile, { nullable: true })
  @JoinColumn()
  userProfile: UserProfile;

  @OneToOne(() => Permission, (permission) => permission.user, {
    nullable: true,
  })
  @JoinColumn()
  permission: Permission;

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.user)
  activityLogs: ActivityLog[];

  @OneToMany(() => PrivateNotes, (privateNotes) => privateNotes.user)
  privateNotes: PrivateNotes[];
}
