import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Company } from '../company/entities/company.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserWithProfileDto } from './dto/create-user-with-profile.dto';
import { UserProfile } from './entities/user-profile.entity';
import { AuthService } from '../auth/auth.service';
import { UtilityService } from '../common/utility/utility.service';
import { UpdateUserWithProfileDto } from './dto/update-user-with-profile.dto';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
// This should be a real class/interface representing a user entity

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,

    private readonly authService: AuthService,

    private readonly utilityService: UtilityService,
  ) {}

  async check(email: string, company_id: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        email: email,
        company: { company_id: company_id },
      },
      relations: ['company'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const company = await this.companyRepository.findOne({
      where: { company_id: createUserDto.company_id },
    });

    if (!company) {
      throw new Error('Company not found');
    }

    const user = this.userRepository.create({
      ...createUserDto,
      company,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByUserId(user_id: string, company_id: string) {
    const company = await this.companyRepository.findOne({
      where: { company_id: company_id },
    });

    return this.userRepository.findOne({
      where: {
        user_id: user_id,
        company: { company_id: company.company_id },
      },
      relations: ['company'],
    });
  }

  async findOneByCompanyId(company_id: string) {
    const company = await this.companyRepository.findOne({
      where: { company_id: company_id },
    });

    return this.userRepository.findOne({
      where: {
        company: { company_id: company.company_id },
      },
      relations: ['company'],
    });
  }

  async findByCompanyId(company_id: string) {
    const company = await this.companyRepository.findOne({
      where: { company_id: company_id },
    });

    const users = await this.userRepository.find({
      where: {
        company: { company_id: company.company_id },
      },
      relations: ['company'],
    });

    users.forEach((user) => {
      delete user.password;
      delete user.refresh_token;
      delete user.authenticator_secret;
    });

    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['sessions', 'company'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findUserByUserId(userId: string, seperate: boolean = false) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: userId,
      },
      relations: {
        userProfile: true,
        permission: true,
        activityLogs: true,
        company: true,
      },
    });

    if (seperate) {
      return user;
    }
    const userProfile = user.userProfile;
    const userProfileId = userProfile?.id;
    userProfile && delete userProfile.id;
    const data = {
      ...user,
      userProfileId,
      ...userProfile,
    };
    delete data.userProfile;
    return data;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updatePassword(user_id: number, hashedPassword: string): Promise<void> {
    await this.userRepository.update(user_id, { password: hashedPassword });
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async getUsersForCompany(companyId: string) {
    const company = await this.companyRepository.findOne({
      where: { company_id: companyId },
    });

    if (!company) {
      throw new NotFoundException(
        `company with id ${companyId} doesnot exists`,
      );
    }

    const teamMembers = await this.userRepository.find({
      where: {
        company: {
          company_id: companyId,
        },
      },
    });

    teamMembers.forEach((member) => {
      delete member.password;
      delete member.refresh_token;
      delete member.authenticator_secret;
    });

    return teamMembers;
  }

  async createUserProfile(
    profileData: CreateUserProfileDto | UpdateUserProfileDto,
    user: User,
  ) {
    if (profileData.image) {
      const image = profileData.image;
      const extensionMatch = image.match(/\/(.*?);base64,/);
      const extension = extensionMatch ? extensionMatch[1] : 'png';
      const fileName = `${user.first_name}_${user.last_name}_${Date.now()}.${extension}`;
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const path = await this.utilityService.uploadToS3(
        'watpay',
        `assets/${fileName}`,
        buffer,
      );

      profileData.image = path.Location;
    }
    console.log('saved image');
    // Create profile
    const profile = this.userProfileRepository.create({
      ...profileData,
    });

    console.log('created profile', profile);
    await this.userProfileRepository.save(profile);
    return profile;
  }

  async createUserWithProfile(
    createUserWithProfileDto: CreateUserWithProfileDto,
  ) {
    const { user: userData, profile: profileData } = createUserWithProfileDto;

    const company = await this.companyRepository.findOne({
      where: {
        company_id: userData.company_id,
      },
    });

    if (!company) {
      throw new NotFoundException(
        `Company with id ${userData.company_id} cannot be found`,
      );
    }

    // Create user
    const user = await this.authService.registerTeamMember(userData);
    console.log('saved user');
    //upload image
    const profile = await this.createUserProfile(profileData, user);
    console.log('saved profile');

    // Associate profile and company with user
    user.userProfile = profile;
    user.company = company;
    await this.userRepository.save(user);

    return { user, profile };
  }

  async updateUserAndUserProfile(
    updateUserWithProfileDto: UpdateUserWithProfileDto,
    userNumericId: number,
  ) {
    let updatedUser: User;
    if (updateUserWithProfileDto.user) {
      updatedUser = await this.update(
        userNumericId,
        updateUserWithProfileDto.user,
      );
    } else {
      updatedUser = await this.userRepository.findOne({
        where: {
          id: userNumericId,
        },
      });
    }

    if (!updatedUser) {
      throw new NotFoundException(`user with id ${userNumericId} is not found`);
    }

    console.dir({ updatedUser }, { depth: null });

    const userWithProfile = await this.userRepository.findOne({
      where: {
        id: updatedUser.id,
      },
      relations: {
        userProfile: true,
      },
    });

    if (updateUserWithProfileDto.profile) {
      const profile = userWithProfile.userProfile;

      if (updateUserWithProfileDto.user?.company_id) {
        const company = await this.companyRepository.findOne({
          where: {
            company_id: updateUserWithProfileDto.user.company_id,
          },
        });

        if (!company) {
          throw new NotFoundException(
            `company with company id ${updateUserWithProfileDto.user.company_id} does not exists`,
          );
        }
        updatedUser.company = company;
      }

      //if profile doesnot exists then create one and assign it to the user
      if (!profile && updateUserWithProfileDto.profile) {
        const userProfile = await this.createUserProfile(
          updateUserWithProfileDto.profile,
          updatedUser,
        );

        updatedUser.userProfile = userProfile;
      } else {
        //if profile does exists then update the image and other values
        if (
          updateUserWithProfileDto.profile.image &&
          profile.image !== updateUserWithProfileDto.profile.image
        ) {
          profile.image &&
            (await this.utilityService.deleteImageByUrl(profile.image));

          const image = profile.image;
          const extensionMatch = image.match(/\/(.*?);base64,/);
          const extension = extensionMatch ? extensionMatch[1] : 'png';
          const fileName = `${updatedUser.first_name}_${updatedUser.last_name}_${Date.now()}.${extension}`;
          const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');

          const path = await this.utilityService.uploadToS3(
            'watpay',
            `assets/${fileName}`,
            buffer,
          );

          updateUserWithProfileDto.profile.image = path.Location;
        }

        Object.assign(profile, updateUserWithProfileDto.profile);
        await this.userProfileRepository.save(profile);
      }
    }

    return this.userRepository.save(updatedUser);
  }
}
