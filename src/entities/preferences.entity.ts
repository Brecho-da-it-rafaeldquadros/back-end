import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { MyCrypto } from "../helpers/crypto"
import Brand from "./brand.entity"
import Categories from "./categories.entity"
import Users from "./users.entity"

@Entity("preferences")
export default class Preferences {
    @PrimaryGeneratedColumn("uuid")
        readonly id:string
    @Column( { default:false } )
        isActive: boolean
    @Column( { transformer:MyCrypto } )
        shoeSize:string
    @Column( { transformer:MyCrypto } )
        clothingSize:string
    @Column( { transformer:MyCrypto } )
        handBagSize:string
    @Column( { transformer:MyCrypto } )
        color:string
    @ManyToOne(() => Categories, (categories) => categories.preferences)
        category: Categories;
    @ManyToOne(() => Brand, (categories) => categories.preferences)
        brand: Brand;
    @OneToOne(()=> Users, user => user.preference, { onDelete:"CASCADE" })
    @JoinColumn()
        user: Users
}