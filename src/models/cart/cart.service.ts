import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

  getMyCart() {
    return this.prismaService.cartItem.findMany({
      where: {
        userId: 1,
      },
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
    });
  }

  addToCart = async (productId: number, userId: number) => {
    // Check if the product is already in the cart
    return this.prismaService.cartItem
      .findFirst({
        where: {
          userId,
          productId,
        },
      })
      .then((cartItem) => {
        if (cartItem) {
          return this.prismaService.cartItem.update({
            where: {
              id: cartItem.id,
            },
            data: {
              quantity: cartItem.quantity + 1,
            },
          });
        }
        return this.prismaService.cartItem.create({
          data: {
            quantity: 1,
            userId,
            productId,
          },
        });
      });
  };

  deductFromCart = async (productId: number, userId: number) => {
    return this.prismaService.cartItem
      .findFirst({
        where: {
          userId,
          productId,
        },
      })
      .then((cartItem) => {
        if (cartItem) {
          if (cartItem.quantity === 1) {
            return this.prismaService.cartItem.delete({
              where: {
                id: cartItem.id,
              },
            });
          }
          return this.prismaService.cartItem.update({
            where: {
              id: cartItem.id,
            },
            data: {
              quantity: cartItem.quantity - 1,
            },
          });
        }
        return null;
      });
  };

  removeFromCart = async (productId: number, userId: number) => {
    return this.prismaService.cartItem.deleteMany({
      where: {
        userId,
        productId,
      },
    });
  };
}
