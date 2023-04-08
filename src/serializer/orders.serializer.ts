import * as yup from "yup"

export const schemaTransport = yup.object().shape({
    code: yup
        .string()
        .required("Deve enviar o código de entrega"),
    price: yup
        .number()
        .required("Deve enviar o preço da entrega"),
    delivery_time: yup
        .number()
        .required("Deve enviar os dias para entrega")
})

export const schemaUpdateOrder = yup.object().shape({
    trackingCode: yup
        .string()
        .notRequired(),
    companyTrackingAreaLink: yup
        .string()
        .url("Deve enviar uma URL valida")
        .notRequired()
})

export const schemaWebHookData = yup.object().shape({
    id: yup
        .string()
        .required("Dados inválidos"),
})

export const schemaWebHook = yup.object().shape({
    action: yup
        .string()
        .notRequired(),
    api_version: yup
        .string()
        .notRequired(),
    data: schemaWebHookData,
    date_created: yup
        .date()
        .notRequired(),
    id: yup
        .number()
        .notRequired(),
    live_mode: yup
        .boolean()
        .notRequired(),
    type: yup
        .string()
        .notRequired(),
    user_id: yup
        .string()
        .notRequired(),
})


export const schemaSerializerOrderReduced = yup.object().shape({
    createdAt: yup
        .date()
        .notRequired(),
    updatedAt: yup
        .date()
        .notRequired(),
    id: yup
        .string()
        .notRequired(),
    validAt: yup
        .date()
        .notRequired(),
    deliveryStowageAt: yup
        .string()
        .notRequired(),
    deliveryMethodCode: yup
        .string()
        .notRequired(),
    companyAddress:yup
        .string()
        .notRequired(),
    trackingCode: yup
        .string()
        .notRequired(),
    companyTrackingAreaLink: yup
        .string()
        .notRequired(),
    status: yup
        .string()
        .notRequired(),
    method: yup
        .string()
        .notRequired(),
    methodType:yup
        .string()
        .notRequired(),
    address:yup
        .string()
        .notRequired(),
    paymentURL: yup
        .string()
        .notRequired(),
    simpleProducts:yup
        .array(yup.string())
        .notRequired(),
    priceAll: yup
        .number()
        .notRequired(),
    priceTransport: yup
        .number()
        .notRequired(),
    priceProducts: yup
        .number()
        .notRequired(),
    paymentId: yup
        .string()
        .notRequired(),
    preferenceId: yup
        .string()
        .notRequired(),
})

export const schemaSerializerOrderArray = yup.array(schemaSerializerOrderReduced)