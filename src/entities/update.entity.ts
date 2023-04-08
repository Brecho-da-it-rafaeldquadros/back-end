import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm"
import { MyCrypto } from "../helpers/crypto"
import Users from "./users.entity"

@Entity("update")
export default class Update {
    @PrimaryGeneratedColumn("uuid")
        readonly id:string
    @Column( { transformer:MyCrypto } )
        json:string
    @Column( { nullable:true } )
        isConfirmedPhone:boolean
    @Column( { nullable:true } )
        isConfirmedEmail:boolean
    @CreateDateColumn()
        readonly createdAt: string
    @Column( { transformer:MyCrypto } )
        validAt: string
    @OneToOne(()=> Users, user => user.myAccountUpdate, { onDelete:"CASCADE" })
    @JoinColumn()
        alterUser: Users
    @ManyToOne(()=>Users, { onDelete:"CASCADE" })
        solicitationUser:Users
}