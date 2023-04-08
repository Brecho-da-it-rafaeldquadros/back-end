import { reverse } from "dns";
import { paginate } from "../../util/pagination.util";
import Repository from "../../util/repository.util";
import {
  verificationTimeProducMyOrders,
  verificationTimeProductMyBag,
} from "../../util/verificationutil";

const listRecentsProductsService = async () => {
  await verificationTimeProductMyBag({});
  await verificationTimeProducMyOrders({});

  const time = new Date().toISOString();
  const timeMile = Date.parse(time);

  const twentyLatestProducts2 = await Repository.product
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category")
    .leftJoinAndSelect("product.brand", "brand")
    .leftJoinAndSelect("product.order", "order")
    .leftJoinAndSelect("product.cart", "cart")
    .where("product.cart IS NULL")
    .where("product.order IS NULL")
    .where("product.launchTime <= :now", { now: timeMile })
    .orderBy("product.createdAt", "DESC")
    .take(20)
    .getMany();

  twentyLatestProducts2.reverse();

  const twentyLatestProducts = twentyLatestProducts2.filter((product: any) => {
    return (
      +product.launchTime < +timeMile &&
      product.cart == null &&
      product.order == null
    );
  });

  return {
    message: "Produtos listados com sucesso",
    twentyLatestProducts,
  };
};

export default listRecentsProductsService;
