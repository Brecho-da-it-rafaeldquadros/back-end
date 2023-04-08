import AppError from "../../error/appError";
import { ICreateCategory } from "../../interface/categories.interface";
import Repository from "../../util/repository.util";

const createCategoriesService = async (data: ICreateCategory) => {
  const hasName = await Repository.categories.findOneBy({ name: data.name });

  if (hasName) {
    throw new AppError("Categoria já existe", 409);
  }

  const category = Repository.categories.create(data);
  await Repository.categories.save(category);

  return { message: "Categoria criada com sucesso", category };
};

export default createCategoriesService;
