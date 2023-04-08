import AppError from "../../error/appError";
import Repository from "../../util/repository.util";

const listProductByIdService = async (productId: string) => {
  const product = await Repository.product.findOne({
    where: { id: productId },
    relations: {
      brand: true,
      cart: true,
      order: true,
      category: true,
    },
  });

  if (!product) {
    throw new AppError("O produto não existe");
  }

  return {
    message: "Produto listado com sucesso",
    product,
  };
};
export default listProductByIdService;
