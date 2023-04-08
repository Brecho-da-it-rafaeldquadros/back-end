import AppError from "../../error/appError";
import { ICreateCategory } from "../../interface/categories.interface";
import Repository from "../../util/repository.util";

const createBrandService = async (data: ICreateCategory) => {
  const hasName = await Repository.brand.findOneBy({ name: data.name });

  if (hasName) {
    throw new AppError("A marca já existe", 409);
  }

  const brand = Repository.brand.create(data);
  await Repository.brand.save(brand);

  return { message: "A marca foi criada com sucesso", brand };
};

export default createBrandService;
