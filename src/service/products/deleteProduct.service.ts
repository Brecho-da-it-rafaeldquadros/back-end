import Repository from "../../util/repository.util";

const deleteProductService = async (id: string) => {
  await Repository.product.delete({ id: id });
  return { message: "O produto foi deletado com sucesso!" };
};
export default deleteProductService;
