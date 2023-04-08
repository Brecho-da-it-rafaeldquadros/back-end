import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Preferences from "./preferences.entity";
import Products from "./products.entity";

@Entity("categories")
export default class Categories {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;
  @Column({ unique: true })
  name: string;
  @OneToMany(() => Products, (product) => product.category)
  products: Products[];
  @OneToMany(() => Preferences, (preference) => preference.category)
  preferences: Preferences[];
}
