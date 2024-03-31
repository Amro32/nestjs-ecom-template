import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.user.findMany({
      select: this.selectWithoutPassword(),
    });
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      select: this.selectWithoutPassword(),
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prismaService.user.delete({
      where: {
        id: id,
      },
    });
  }

  private selectWithoutPassword() {
    return {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}
