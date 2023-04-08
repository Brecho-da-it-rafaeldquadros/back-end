import Repository from "../../util/repository.util";

const listCategoryProductsService = async (categoryId: string) => {
  const category = await Repository.categories.findOne({
    where: { id: categoryId },
    relations: {
      products: {
        brand: true,
        category: true,
        cart: true,
        order: true,
      },
    },
  });

  const time = new Date().toISOString();
  const timeMile = Date.parse(time);

  const products = category.products.filter((product) => {
    return (
      +product.launchTime < +timeMile &&
      product.cart == null &&
      product.order == null
    );
  });

  return {
    message: `Produtos da categoria ${category.name}`,
    products,
  };
};

export default listCategoryProductsService;
