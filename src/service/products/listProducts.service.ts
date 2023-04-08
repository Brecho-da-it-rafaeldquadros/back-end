import { paginate } from "../../util/pagination.util";
import Repository from "../../util/repository.util";
import {
  verificationTimeProducMyOrders,
  verificationTimeProductMyBag,
} from "../../util/verificationutil";

const listProductsService = async (query: object) => {
  await verificationTimeProductMyBag({});
  await verificationTimeProducMyOrders({});

  const time = new Date().toISOString();
  const timeMile = Date.parse(time);
  // const products: any = Repository.product.find();

  const productsLaunched2 = await Repository.product
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category")
    .leftJoinAndSelect("product.brand", "brand")
    .leftJoinAndSelect("product.order", "order")
    .leftJoinAndSelect("product.cart", "cart")
    .where("product.cart IS NULL")
    .where("product.order IS NULL")
    .where("product.launchTime <= :now", { now: timeMile })
    .orderBy("product.createdAt", "ASC")
    .getMany();

  const productsLaunched = productsLaunched2.filter((product: any) => {
    return (
      +product.launchTime < +timeMile &&
      product.cart == null &&
      product.order == null
    );
  });

  return {
    message: "Produtos listados com sucesso",
    ...paginate({
      list: productsLaunched.reverse(),
      query,
    }),
  };
};

export default listProductsService;
