import AppError from "../../error/appError";
import Repository from "../../util/repository.util";

const updateCategoryService = async (categoryId: string, data: any) => {
  if (data.id) {
    throw new AppError("Não é possivel atualizar o campo id");
  }

  const findCategory = await Repository.categories.findOneBy({
    name: data.name,
  });

  if (findCategory) {
    throw new AppError("Esta categoria já existe");
  }

  await Repository.categories.update(categoryId, data);

  const updatedCategory = await Repository.categories.findOneBy({
    id: categoryId,
  });

  return { message: "Categoria atualizada com sucesso", updatedCategory };
};
export default updateCategoryService;
