import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, BeforeInsert, BeforeUpdate } from "typeorm"
import Logs from "./logs.entity";
import Code from "./code.entity";
import BankData from "./bankData.entity";
import Preferences from "./preferences.entity";
import Address from "./address.entity";
import Cart from "./cart.entity";
import Orders from "./orders.entity";
import { Date } from "./index.entity";
import { hashSync } from "bcryptjs";
import Products from "./products.entity";
import { MyCrypto } from "../helpers/crypto";
import Update from "./update.entity";

@Entity("users")
export default class Users extends Date {
    @PrimaryGeneratedColumn("uuid")
        readonly id:string
    @Column( { transformer:MyCrypto } )
        fullName:string
    @Column( { unique:true, transformer:MyCrypto } )
        email:string
    @Column()
        password:string
    @Column( { transformer:MyCrypto } )
        phone:string
    @Column( { default:3 } )
        authorizationLevel: number
    @Column( { default:false } )
        isActive:boolean
    @Column( { default:false } )
        isConfirmedPhone:boolean
    @Column( { default:false } )
        isConfirmedEmail:boolean
    @Column( { default:false } )
        isTermsAccepted:boolean
    @Column( { default:true } )
        isSolicitationCode:boolean
    @Column( { nullable:true } )
        lastUserIdUpdated:string
    @OneToMany(()=>Logs, logs => logs.user )
        logs: Logs[]
    @OneToMany(()=>Address, address => address.user )
        address: Address[]
    @OneToMany(()=>Orders, address => address.user )
        orders: Orders[]
    @OneToMany(()=>Products, address => address.user )
        products: Products[]
    @OneToOne(()=>Code, code => code.user )
        code:Code
    @OneToOne(()=>Update, update => update.alterUser )
        myAccountUpdate:Update
    @OneToMany(()=>Update, update => update.solicitationUser )
        otherAccountUpdate:Update[]
    @OneToOne(()=>BankData, bankData => bankData.user )
        bankData:BankData
    @OneToOne(()=>Preferences, bankData => bankData.user )
        preference:Preferences
    @OneToOne(()=>Cart, cart => cart.user )
        cart:Cart

    @BeforeInsert()
        hashPassword() {
            this.password = hashSync(this.password, 10);
        }
}