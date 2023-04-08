import Repository from "./repository.util"

import "dotenv/config"

export const initializationUserDefault = async () => {

    const user = await Repository.users.findOneBy({ authorizationLevel:1 })

    if( user ){
        return
    }

    const defaultADM = {
        fullName: process.env.DEFAULT_USER_FULLNAME,
        email: process.env.DEFAULT_USER_EMAIL,
        authorizationLevel: 1,
        password: process.env.DEFAULT_USER_PASS,
        phone: "55" + process.env.DEFAULT_USER_PHONE,
        isConfirmedEmail:true,
        isConfirmedPhone:true,
        isActive:true,
        isSolicitationCode:false
    }

    const createdDefaultUser = Repository.users.create(defaultADM)
    await Repository.users.save(createdDefaultUser)

    return createdDefaultUser.id
}
