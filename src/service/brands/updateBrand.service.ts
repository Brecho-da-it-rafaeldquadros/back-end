import AppError from "../../error/appError";
import Repository from "../../util/repository.util";

const updateBrandService = async (brandId: string, data: any) => {
  if (data.id) {
    throw new AppError("Não é possivel atualizar o campo id");
  }

  const findBrand = await Repository.brand.findOneBy({
    name: data.name,
  });

  if (findBrand) {
    throw new AppError("Esta marca já existe");
  }

  await Repository.brand.update(brandId, data);

  const updatedBrand = await Repository.brand.findOneBy({
    id: brandId,
  });

  return { message: "A marca foi atualizada com sucesso", updatedBrand };
};
export default updateBrandService;
