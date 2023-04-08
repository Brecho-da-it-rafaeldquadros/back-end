import { paginate } from "../../util/pagination.util";
import Repository from "../../util/repository.util";

const listProductsAdminService = async (query: object) => {
  const products = await Repository.product
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category")
    .leftJoinAndSelect("product.brand", "brand")
    .leftJoinAndSelect("product.order", "order")
    .leftJoinAndSelect("product.cart", "cart")
    .orderBy("product.createdAt", "ASC")
    .getMany();

  return {
    message: "Produtos listados com sucesso",
    ...paginate({
      list: products,
      query,
    }),
  };
};

export default listProductsAdminService;
