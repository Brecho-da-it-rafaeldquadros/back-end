import * as yup from "yup"

export const schemaAuth = yup.object().shape({
    password:yup
        .string()
        .transform( pwd => pwd.trim() )
        .required("Senha é obrigatoria")
})

export const schemaCreateUserLevelAll = yup.object().shape({
    fullName: yup
        .string()
        .transform( (code:string) => code.trim() )
        .required("Deve conter um nome completo"),
    email: yup
        .string()
        .transform( (code:string) => code.trim() )
        .email("Email inválido")
        .required("Deve conter um email"),
    isTermsAccepted: yup
        .boolean()
        .oneOf([true], "Deve aceitar os termos")
        .required("Deve aceitar os termos"),
    password: yup
        .string()
        .transform( (code:string) => code.trim() )
        .required("Deve conter um senha"),
    phone: yup
        .string()
        .transform( (code:string) => code.trim() )
        .min(11, "Deve conter 11 numeros no minimo")
        .max(11, "Deve conter 11 numeros no máximo")
        .required("Deve conter um numero de telefone ex: 'DDD 0 0000-0000'  ")
})

export const schemaCreateUserLevelOne = yup.object().shape({
    fullName: yup
        .string()
        .transform( (code:string) => code.trim() )
        .required("Deve conter um nome completo"),
    email: yup
        .string()
        .transform( (code:string) => code.trim() )
        .email("Email inválido")
        .required("Deve conter um email"),
    isTermsAccepted: yup
        .boolean()
        .oneOf([true], "Deve aceitar os termos")
        .required("Deve aceitar os termos"),
    password: yup
        .string()
        .transform( (code:string) => code.trim() )
        .required("Deve conter um senha"),
    phone: yup
        .string()
        .transform( (code:string) => code.trim() )
        .min(11, "Deve conter 11 numeros no minimo")
        .max(11, "Deve conter 11 numeros no máximo")
        .required("Deve conter um numero de telefone ex: 'DDD 0 0000-0000'  "),
    authorizationLevel: yup
        .number()
        .notRequired()
})

export const schemaUpdateUserLevelAll = yup.object().shape({
    fullName: yup
        .string()
        .transform( (code:string) => code.trim() )
        .notRequired(),
    email: yup
        .string()
        .transform( (code:string) => code.trim() )
        .email("Email inválido")
        .notRequired(),
    password: yup
        .string()
        .transform( (code:string) => code.trim() )
        .notRequired(),
    phone: yup
        .string()
        .transform( (code:string) => code.trim() )
        .min(11, "Deve conter 11 numeros no minimo")
        .max(11, "Deve conter 11 numeros no máximo")
        .notRequired(),
    auth:schemaAuth
})
export const schemaUpdateUserLevelOne = yup.object().shape({
    fullName: yup
        .string()
        .transform( (code:string) => code.trim() )
        .notRequired(),
    email: yup
        .string()
        .transform( (code:string) => code.trim() )
        .email("Email inválido")
        .notRequired(),
    password: yup
        .string()
        .transform( (code:string) => code.trim() )
        .notRequired(),
    isActive: yup
        .boolean()
        .notRequired(),
    authorizationLevel: yup
        .number()
        .notRequired(),
    phone: yup
        .string()
        .transform( (code:string) => code.trim() )
        .min(11, "Deve conter 11 numeros no minimo")
        .max(11, "Deve conter 11 numeros no máximo")
        .notRequired(),
    auth:schemaAuth
})

export const schemaRetrieveAccountUser = yup.object().shape({
    email: yup
        .string()
        .transform( (code:string) => code.trim() )
        .required("Deve conter o email da conta a ser recuperada"),
    newPassword: yup
        .string()
        .transform( (code:string) => code.trim() )
        .required("Deve conter uma senha")
})

export const schemaInitSessionUser = yup.object().shape({
    email: yup
        .string()
        .transform( (code:string) => code.trim() )
        .required("Deve conter um email"),
    password: yup
        .string()
        .transform( (code:string) => code.trim() )
        .required("Deve conter uma senha"),
})

export const confirmCodeUser = yup.object().shape({
    code: yup
        .string()
        .min(6, "Deve conter 6 dígitos")
        .max(6, "Deve conter 6 dígitos")
        .transform( (code:string) => code.trim() )
        .required("Deve conter um código de confirmação"),
})


export const serializerUser = yup.object().shape({
    isConfirmedEmail: yup
        .boolean()
        .notRequired(),
    isConfirmedPhone: yup
        .boolean()
        .notRequired(),
    isActive: yup
        .boolean()
        .notRequired(),
    updatedAt: yup
        .date()
        .notRequired(),
    createdAt: yup
        .date()
        .notRequired(),
    authorizationLevel: yup
        .number()
        .notRequired(),
    phone: yup
        .string()
        .notRequired(),
    email: yup
        .string()
        .notRequired(),
    fullName: yup
        .string()
        .notRequired(),
    id: yup
        .string()
        .notRequired()
})

export const serializerManyUsers = yup.array(serializerUser)