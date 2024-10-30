import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Company } from '../company/entities/company.entity';
import { UserProfile } from './entities/user-profile.entity';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { ActivityLog } from '../company-teams/entity/user-activity-logs.entity';
import { PrivateNotes } from '../private-notes/entity/private-notes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Company,
      UserProfile,
      ActivityLog,
      PrivateNotes,
    ]),
    forwardRef(() => AuthModule),
    CommonModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
