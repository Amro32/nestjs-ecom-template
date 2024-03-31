import { Cart } from "src/models/cart/entities/cart.entity";

export class User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  cartItems: Cart[];
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}