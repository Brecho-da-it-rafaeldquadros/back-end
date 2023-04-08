import * as yup from "yup"

export const addressUserLevelAll = yup.object().shape({
    name:yup
        .string()
        .required("Deve conter um nome"),
    cep: yup
        .string()
        .required("Deve conter um CEP"),
    number: yup
        .string()
        .required("Deve conter o numero da casa"),
    complement: yup
        .string()
        .notRequired(),
    isDefault: yup
        .boolean()
        .notRequired()
})

export const addressUserLevelOne = yup.object().shape({
    name:yup
        .string()
        .required("Deve conter um nome"),
    cep: yup
        .string()
        .required("Deve conter o numero da casa"),
    number: yup
        .string()
        .required("Deve conter um CEP"),
    complement: yup
        .string()
        .notRequired(),
    isCompanyAddress: yup
        .boolean()
        .notRequired(),
    isDefault: yup
        .boolean()
        .notRequired()
})

export const addressUpdateUserLevelAll = yup.object().shape({
    name:yup
        .string()
        .notRequired(),
    cep: yup
        .string()
        .notRequired(),
    number: yup
        .string()
        .notRequired(),
    complement: yup
        .string()
        .notRequired(),
    isDefault: yup
        .boolean()
        .notRequired()
})

export const addressUpdateUserLevelOne = yup.object().shape({
    name:yup
        .string()
        .notRequired(),
    cep: yup
        .string()
        .notRequired(),
    number: yup
        .string()
        .notRequired(),
    complement: yup
        .string()
        .notRequired(),
    isCompanyAddress: yup
        .boolean()
        .notRequired(),
    isDefault: yup
        .boolean()
        .notRequired()
})

export const addressDelivery = yup.object().shape({
    EntregaSabado: yup
        .string()
        .notRequired(),
    EntregaDomiciliar: yup
        .string()
        .notRequired(),
    PrazoEntrega: yup
        .string()
        .notRequired(),
    Valor: yup
        .string()
        .notRequired(),
    Codigo: yup
        .number()
        .notRequired(),
    Description: yup
        .string()
        .default(()=>null)
        .notRequired(),
    type: yup
        .string()
        .default(()=>"Correios Brasil")
        .notRequired()
})

export const addressDeliveryArray = yup.array(addressDelivery)