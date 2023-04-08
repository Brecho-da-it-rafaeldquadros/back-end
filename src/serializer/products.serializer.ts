import * as yup from "yup";

export const schemaCreateProducts = yup.object().shape({
  name: yup.string().required("Deve conter o nome do produto"),
  description: yup.string().required("Deve conter o campo description"),
  color: yup.string().required("Deve conter o campo color"),
  launchTime: yup.string().required("Deve conter o campo launchTime"),
  priceSeller: yup.number().required("Deve conter o campo priceSeller"),
  percentageService: yup.number().notRequired(),
  size: yup.string().required("Deve conter o campo size"),
  category: yup.string().required("Deve conter o campo category"),
  brand: yup.string().required("Deve conter o campo brand"),
});

export const schemaUpdateProducts = yup.object().shape({
  name: yup.string().notRequired(),
  description: yup.string().notRequired(),
  color: yup.string().notRequired(),
  launchTime: yup.string().notRequired(),
  priceSeller: yup.number().notRequired(),
  percentageService: yup.number().notRequired(),
  size: yup.string().notRequired(),
  category: yup.string().notRequired(),
  brand: yup.string().notRequired(),
  isSale: yup.string().notRequired(),
  salePrice: yup.string().notRequired(),
});
