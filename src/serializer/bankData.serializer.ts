import * as yup from "yup"

export const schemaBankData = yup.object().shape({
    cpf: yup
        .string()
        .min(11, "CPF deve conter 11 digitos")
        .max(11, "CPF deve conter 11 digitos")
        .notRequired(),
    accountNumber: yup
        .string()
        .notRequired(),
    agency: yup
        .string()
        .notRequired(),
    pix: yup
        .string()
        .notRequired(),
})