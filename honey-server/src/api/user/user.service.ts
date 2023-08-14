import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as mimeTypes from 'mime-types';
import { FileService } from '~/common/file/file.service';
import { PrismaService } from '~/common/prisma/prisma.service';
import { UserUpdateDto } from './dto/user-update.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async updateUser(user: User, request: UserUpdateDto) {
    if (request.handle) {
      const exist = await this.prismaService.user.findUnique({
        where: {
          handle: request.handle,
        },
      });

      if (exist) {
        throw new ConflictException('handle already exists');
      }
    }

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        username: request.username,
        handle: request.handle,
      },
    });
  }

  async updateProfileImage(user: User, image: Express.Multer.File) {
    const key = await this.fileService.generateKey({
      id: user.id,
      type: 'avatar',
      extension: mimeTypes.extension(image.mimetype) || 'png',
    });

    await this.fileService.uploadFile(key, image.buffer);
    const imagePath = await this.fileService.generateUrl(key);

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        picture: imagePath,
      },
    });

    return { imagePath };
  }
}
