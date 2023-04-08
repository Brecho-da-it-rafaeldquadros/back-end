import AppError from "../../error/appError";
import { calculatePorcent } from "../../util/calculatePorcent.util";
import Repository from "../../util/repository.util";

const updateProductService = async (productId: string, data: any) => {
  if (
    data.id ||
    data.createdAt ||
    data.updatedAt ||
    data.priceAll ||
    data.priceService
  ) {
    throw new AppError("Não é possivel atualizar este campo");
  }

  console.log(data);
  const categories = await Repository.categories.findOne({
    where: { name: data.category },
  });

  const brand = await Repository.brand.findOne({
    where: {
      name: data.brand,
    },
  });

  if (!categories) {
    throw new AppError("A categoria não existe");
  }

  if (!brand) {
    throw new AppError("A marca não existe");
  }

  if (brand) {
    data.brand = brand;
  }

  if (categories) {
    data.category = categories;
  }

  if (data.isSale == "true") {
    data.isSale = true;
  }

  if (data.percentageService) {
    const prices = await calculatePorcent(
      data.priceSeller,
      data.percentageService
    );
    const productData = { ...data, ...prices };
    await Repository.product.update(productId, productData);
  } else if (data.priceSeller) {
    const prices = await calculatePorcent(data.priceSeller, null);
    const productData = { ...data, ...prices };
    await Repository.product.update(productId, productData);
  }

  await Repository.product.update(productId, data);
  const updatedProduct = await Repository.product.findOne({
    where: { id: productId },
    relations: { category: true, brand: true, order: true, cart: true },
  });

  return { message: "Produto atualizado com sucesso", updatedProduct };
};
export default updateProductService;
