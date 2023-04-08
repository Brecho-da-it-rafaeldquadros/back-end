import { maxLength } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from "typeorm";
import Brand from "./brand.entity";
import Cart from "./cart.entity";
import Categories from "./categories.entity";
import { Date } from "./index.entity";
import Orders from "./orders.entity";
import Users from "./users.entity";

@Entity("products")
export default class Products extends Date {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;
  @Column()
  name: string;
  @Column({ type: "text" })
  description: string;
  @Column()
  color: string;
  @Column()
  size: string;
  @Column()
  launchTime: string;
  @Column({ type: "float" })
  priceAll: number;
  @Column({ type: "float" })
  priceSeller: number;
  @Column({ type: "float" })
  priceService: number;
  @Column({ type: "float", nullable: true })
  percentageService: number;
  @Column({ default: false })
  isSale: boolean;
  @Column({ nullable: true })
  salePrice: string;
  @Column({ default: "Disponivel" })
  status: string;
  @Column({ nullable: true })
  image_1: string;
  @Column({ nullable: true })
  image_2: string;
  @Column({ nullable: true })
  image_3: string;
  @ManyToOne(() => Cart, { nullable: true })
  cart: Cart;
  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  user: Users;
  @ManyToOne(() => Orders, { nullable: true })
  order: Orders;
  @ManyToOne(() => Categories, (categories) => categories.products, {
    nullable: true,
  })
  category: Categories;
  @ManyToOne(() => Brand, (brand) => brand.product, {
    onDelete: "CASCADE",
    nullable: true,
  })
  brand: Brand;
}
