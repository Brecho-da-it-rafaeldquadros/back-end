import { ICreateCategory } from "../../interface/categories.interface";

export const mockedCreateCategory: ICreateCategory = {
  name: "first category",
};

export const mockedCreateCategoryWithoutAuthorization: ICreateCategory = {
  name: "error",
};

export const mockedCreateCategoryForDelete: ICreateCategory = {
  name: "Delete Category",
};
