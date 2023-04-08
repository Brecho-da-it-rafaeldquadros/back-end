import Repository from "../../util/repository.util";

const listBrandsService = async () => {
  const brands = await Repository.brand.find();

  return { message: "Marcas listadas com sucesso", brands };
};

export default listBrandsService;
