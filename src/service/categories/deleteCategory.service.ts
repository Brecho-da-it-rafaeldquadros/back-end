import Repository from "../../util/repository.util";

const deleteCategoryService = async (id: string) => {
  await Repository.categories.delete({ id: id });
  return { message: "A categoria foi deletada com sucesso!" };
};
export default deleteCategoryService;
