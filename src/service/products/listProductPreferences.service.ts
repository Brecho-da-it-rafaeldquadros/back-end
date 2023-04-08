import { paginate } from "../../util/pagination.util";
import Repository from "../../util/repository.util";

const listProductsPreferencesService = async (
  query: object,
  userId: string
) => {
  const user = await Repository.users.findOne({
    where: { id: userId },
    relations: { preference: true },
  });

  const products = await Repository.product.find({
    relations: { category: true, brand: true, order: true, cart: true },
  });

  const time = new Date().toISOString();
  const timeMile = Date.parse(time);
  const productsLaunched = products.filter((product) => {
    return (
      +product.launchTime < +timeMile &&
      product.cart == null &&
      product.order == null
    );
  });

  if (user.preference == null) {
    return {
      message:
        "Você não cadastrou preferencias ainda, cadastresse para receber produtos com a sua cara",
      ...paginate({
        list: productsLaunched.reverse(),
        query,
      }),
    };
  }
  if (user.preference.isActive == false) {
    return {
      message:
        "Você não cadastrou preferencias ainda, cadastresse para receber produtos com a sua cara",
      ...paginate({
        list: productsLaunched.reverse(),
        query,
      }),
    };
  }

  const favoriteProducts = productsLaunched.filter((product) => {
    return (
      (user.preference.clothingSize.toLocaleLowerCase() ==
        product.size.toLocaleLowerCase() &&
        user.preference.color.toLocaleLowerCase() ==
          product.color.toLocaleLowerCase()) ||
      (user.preference.shoeSize.toLocaleLowerCase() ==
        product.size.toLocaleLowerCase() &&
        user.preference.color.toLocaleLowerCase() ==
          product.color.toLocaleLowerCase() &&
        user.preference.category.name.toLocaleLowerCase() ==
          product.category.name.toLocaleLowerCase())
    );
  });

  return {
    message: "Produtos preferidos listados com sucesso",
    ...paginate({
      list: favoriteProducts.reverse(),
      query,
    }),
  };
};

export default listProductsPreferencesService;
