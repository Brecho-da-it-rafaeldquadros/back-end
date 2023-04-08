import * as yup from "yup"

export const schemaValidIdParams = yup.object().shape({
    id:yup
        .string()
        .matches(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, "Deve ser um UUID")
        .required("Id no parâmetro é obrigatorio")
})