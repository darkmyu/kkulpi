import {
  Body,
  Controller,
  Delete,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { MultiFileTypeValidator } from '~/common/validator/multi-file-type.validator';
import { AuthUser } from '../auth/decorator/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserUpdateRequestDto } from './dto/user-update-request.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(@AuthUser() user: User, @Body() request: UserUpdateRequestDto) {
    return this.userService.updateUser(user, request);
  }

  @Delete('picture')
  @UseGuards(JwtAuthGuard)
  async deleteProfileImage(@AuthUser() user: User) {
    return this.userService.deleteProfileImage(user);
  }

  @Patch('picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateProfileImage(
    @AuthUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new MultiFileTypeValidator({ fileTypes: ['jpg', 'jpeg', 'png'] }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.userService.updateProfileImage(user, image);
  }
}
