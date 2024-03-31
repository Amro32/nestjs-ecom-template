import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface loginParams {
  email: string;
  password: string;
}

interface registerParams {
  email: string;
  password: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async register(body: registerParams) {
    //check if user with email already exists
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (userExists) {
      throw new HttpException('User with this email already exists', 400);
    }

    //hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
      },
    });

    const token = await this.generateJWT(user.id);

    return { token };
  }

  async login({ email, password }: loginParams) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException('Invalid Credentials', 400);
    }

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException('Invalid Credentials', 400);
    }

    const token = await this.generateJWT(user.id);

    return { token };
  }

  async generateJWT(id: number) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '3600000',
    });
  }

  async me(userId: number) {
    return this.prismaService.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        cartItems: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }
}
