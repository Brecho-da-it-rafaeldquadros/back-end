import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { MyCrypto } from "../helpers/crypto"
import Users from "./users.entity"

@Entity("bankData")
export default class BankData {
    @PrimaryGeneratedColumn("uuid")
        readonly id:string
    @Column( { transformer:MyCrypto, nullable:true  } )
        cpf:string
    @Column( { transformer:MyCrypto, nullable:true  } )
        accountNumber:string
    @Column( { transformer:MyCrypto, nullable:true  } )
        agency:string
    @Column( { transformer:MyCrypto, nullable:true } )
        pix:string
    @OneToOne(()=> Users, user => user.bankData, { onDelete:"CASCADE" })
    @JoinColumn()
        user: Users
}