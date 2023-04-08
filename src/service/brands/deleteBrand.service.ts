import Repository from "../../util/repository.util";

const deleteBrandService = async (id: string) => {
  await Repository.brand.delete({ id: id });
  return { message: "A marca foi deletada com sucesso!" };
};
export default deleteBrandService;
