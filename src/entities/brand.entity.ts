import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import Preferences from "./preferences.entity";
import Products from "./products.entity";

@Entity("brand")
export default class Brand {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;
  @Column({ unique:true })
  name: string;
  @Column()
  sizeTable: string;
  @OneToMany(() => Products, (product) => product.brand)
  product: Products[];
  @OneToMany(() => Preferences, (preference) => preference.brand)
  preferences: Preferences[];
}
