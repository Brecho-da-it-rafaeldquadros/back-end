import Repository from "../../util/repository.util";

const listCategoriesService = async () => {
  const categories = await Repository.categories.find();

  return { message: "Categorias listadas com sucesso", categories };
};

export default listCategoriesService;
