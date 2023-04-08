import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { MyCrypto } from "../helpers/crypto"
import { Date } from "./index.entity"
import Users from "./users.entity"

@Entity("address")
export default class Address extends Date{
    @PrimaryGeneratedColumn("uuid")
        id:string
    @Column( { transformer:MyCrypto } )
        name: string
    @Column( { default:false } )
        isSameTown: boolean
    @Column( { default:false } )
        isDefault: boolean
    @Column( { default:false } )
        isCompanyAddress: boolean
    @Column( { transformer:MyCrypto  } )
        cep: string
    @Column( { transformer:MyCrypto  } )
        street:string
    @Column( { transformer:MyCrypto  } )
        number: string
    @Column( { transformer:MyCrypto  } )
        city: string
    @Column( { transformer:MyCrypto  } )
        uf: string
    @Column( { transformer:MyCrypto  } )
        neighborhood: string
    @Column( { transformer:MyCrypto  } )
        complement:string
    @ManyToOne(()=> Users, { onDelete:"CASCADE" })
        user:Users
}