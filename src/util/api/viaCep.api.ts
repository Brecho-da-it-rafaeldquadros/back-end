import axios from "axios"
import AppError from "../../error/appError"

interface ISolicitationInformationsCEP {
    cep:string
}

interface IResponseSolicitaionInformationCEP {
    cep: string,
	logradouro: string,
	bairro: string,
	localidade: string,
	uf: string,
    erro?:boolean
}

export const solicitationInformationsCEP = async ( { cep }:ISolicitationInformationsCEP ):Promise<IResponseSolicitaionInformationCEP> => {
    
    const baseURL = axios.create({
        baseURL:`https://viacep.com.br/ws/`,
        timeout:7000
    })


    try {
        const initialAddress = await baseURL.get( `${cep}/json/` )

        return initialAddress.data
    } catch (error) {
        throw new AppError("CEP não encontrado", 404)
    }
}