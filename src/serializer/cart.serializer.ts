import * as yup from "yup"

export const schemaResponseProductBrandOrCategory = yup.object().shape({
    name: yup
        .string()
        .notRequired(),
})


export const schemaResponseProduct = yup.object().shape({
    brand:schemaResponseProductBrandOrCategory,
	category:schemaResponseProductBrandOrCategory,
	image_1: yup
        .string()
        .notRequired(),
    salePrice: yup
        .number()
        .nullable()
        .notRequired(),
    isSale: yup
        .boolean()
        .notRequired(),
    priceAll: yup
        .number()
        .notRequired(),
    name: yup
        .string()
        .notRequired(),
    id: yup
        .string()
        .notRequired()
})

export const schemaResponseBag = yup.object().shape({
    products:yup.array( schemaResponseProduct ),
    createdAt: yup
        .date()
        .notRequired(),
    updatedAt: yup
        .date()
        .notRequired(),
    validAt: yup
        .date()
        .notRequired(),
    id: yup
        .string()
        .notRequired()
})