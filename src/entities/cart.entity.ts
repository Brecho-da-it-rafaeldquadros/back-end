import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { MyCrypto } from "../helpers/crypto"
import { Date } from "./index.entity"
import Products from "./products.entity"
import Users from "./users.entity"

@Entity("cart")
export default class Cart  extends Date {
    @PrimaryGeneratedColumn("uuid")
        readonly id:string
    @Column()
        validAt: string
    @OneToOne(()=> Users, user => user.code, { onDelete:"CASCADE" })
    @JoinColumn()
        user: Users
    @OneToMany(()=>Products, products => products.cart )
        products: Products[]
}