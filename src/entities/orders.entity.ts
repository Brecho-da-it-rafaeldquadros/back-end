import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { MyCrypto } from "../helpers/crypto";
import { Date } from "./index.entity";
import Products from "./products.entity";
import Users from "./users.entity";

@Entity("orders")
export default class Orders extends Date {
  @PrimaryGeneratedColumn("uuid")
    readonly id: string;
  @Column( { transformer:MyCrypto } )
    readonly validAt: string
  @Column( { transformer:MyCrypto } )
    readonly deliveryStowageAt: string
  @Column( { transformer:MyCrypto } )
    readonly deliveryMethodCode: string
  @Column()
    companyAddress: string
  @Column( { default:"AGUARDANDO RASTREIO" } )
    trackingCode: string
  @Column( { default:"AGUARDANDO RASTREIO" } )
    companyTrackingAreaLink: string
  @Column({
    default:"AGUARDANDO PAGAMENTO"
  })
    status: string;
  @Column({ nullable:true })
    method: string;
  @Column({ nullable:true })
    methodType: string;
  @Column( { transformer:MyCrypto } )
    address: string;
  @Column( { nullable:true } )
    paymentURL: string;
  @Column("simple-array")
    simpleProducts: string[];
  @Column({ type:"float" })
    priceAll: number;
  @Column({ type:"float" })
    priceTransport: number;
  @Column({ type:"float" })
    priceProducts: number;
  @Column( { nullable:true } )
    paymentId: string;
  @Column( { nullable:true } )
    preferenceId: string;
  @ManyToOne(() => Users, { onDelete: "CASCADE" })
    readonly user: Users;
  @OneToMany(() => Products, product => product.order )
    products: Products[];
}
