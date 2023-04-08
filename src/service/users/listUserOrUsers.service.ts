import AppError from "../../error/appError"
import { IToken } from "../../interface/users.interface"
import { serializerManyUsers, serializerUser } from "../../serializer/user.serializer"
import { paginate } from "../../util/pagination.util"
import Repository from "../../util/repository.util"

const listUserOrUsersService = async ( userId:string, token:IToken, URL:string, query:object ) => {

    const adm = token.authorizationLevel === 1
    const isAll = URL.includes("all")

    if( userId && !adm || isAll && !adm ){
        throw new AppError("Usuario pode listar apenas a propia conta", 401)
    }

    const id = userId ? userId : token.id

    if( !isAll || !adm ){
        const hasUser = await Repository.users.findOneBy({ id })

        if( !hasUser ){
            throw new AppError("Usuario não encontrado", 404)
        }

        const serializer = await serializerUser.validate(hasUser, { stripUnknown:true })

        return {
            message: userId && userId !== token.id ? "Listando perfil de outro usuario" : "Meu perfil",
            user:serializer
        }
    }

    const users = await Repository.users.find()

    const serializer = await serializerManyUsers.validate(users, { stripUnknown:true })

    return {
        message:"Todos os usuarios",
        ...paginate({
            list: serializer.reverse(),
            query,
        }),
    }
}

export default listUserOrUsersService