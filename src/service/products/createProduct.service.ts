import Repository from "../../util/repository.util";
import AppError from "../../error/appError";

const createProductService = async (
  data: any,
  userId: string,
  images: string
) => {
  const categories = await Repository.categories.findOne({
    where: { name: data.category },
  });

  const brand = await Repository.brand.findOneBy({
    name: data.brand,
  });

  const user = await Repository.users.findOneBy({
    id: userId,
  });

  if (!categories) {
    throw new AppError("A categoria não existe");
  }

  if (!brand) {
    throw new AppError("A marca não existe");
  }

  const launchTime = Date.parse(data.launchTime);
  data.launchTime = launchTime;
  data.image_1 = images;

  const productCreated: any = Repository.product.create({
    ...data,
    category: categories,
    user: user,
    brand: brand,
  });

  await Repository.product.save(productCreated);

  const product = await Repository.product.findOne({
    where: { id: productCreated.id },
    relations: { brand: true, category: true, cart: true, order: true },
  });

  return { message: "Produto criada com sucesso", product };
};

export default createProductService;
