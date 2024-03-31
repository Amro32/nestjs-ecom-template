import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserData } from 'src/common/interceptors/user.interceptor';
import { CartService } from './cart.service';
import { UserRole } from '../users/entities/user.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/my-cart')
  getMyCart() {
    return this.cartService.getMyCart();
  }

  @Roles(UserRole.USER)
  @Post('/add-to-cart/:productId')
  addToCart(@Param('productId') productId: number, @User() user: UserData) {
    return this.cartService.addToCart(+productId, user.id);
  }

  @Roles(UserRole.USER)
  @Post('/deduct-from-cart/:productId')
  deductFromCart(
    @Param('productId') productId: number,
    @User() user: UserData,
  ) {
    return this.cartService.deductFromCart(+productId, user.id);
  }

  @Roles(UserRole.USER)
  @Delete('/remove-from-cart/:productId')
  removeFromCart(
    @Param('productId') productId: number,
    @User() user: UserData,
  ) {
    return this.cartService.removeFromCart(+productId, user.id);
  }
}
