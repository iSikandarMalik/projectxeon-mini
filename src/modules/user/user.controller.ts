import {
  Controller,
  Request,
  Get,
  Req,
  Patch,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AllowApiCall } from '../../common/decorators/allow-api-call.decorator';
import { UpdateUserWithProfileDto } from './dto/update-user-with-profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @AllowApiCall()
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  async findAll(@Req() req: Request): Promise<User> {
    const userId = req['user'].id;
    return this.userService.findOne(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  @Get('/company/:company_id')
  async getUserByCompanyId(@Param('company_id') companyId: string) {
    return this.userService.findByCompanyId(companyId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(+id);
  }

  @Patch('update')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    const userId = req['user'].id;
    const user = this.userService.updateUser(userId, updateUserDto);
    if (user) {
      return {
        status: 'success',
        message: 'Profile successfully udpated',
      };
    }
  }

  @Patch('/update-user/:userId')
  async updateUserWithProfile(
    @Param('userId') id: number,
    @Body() updateUserWithPRofileDto: UpdateUserWithProfileDto,
  ) {
    return this.userService.updateUserAndUserProfile(
      updateUserWithPRofileDto,
      id,
    );
  }

  @Get('/company/:company_id')
  getTeamMemberByCompanyId(@Param('company_id') companyId: string) {
    return this.userService.getUsersForCompany(companyId);
  }

  @Get('/user/:userId')
  async getUserByUserId(@Param('userId') userId: string) {
    return this.userService.findUserByUserId(userId);
  }
}
