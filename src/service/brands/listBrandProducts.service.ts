import Repository from "../../util/repository.util";

const listBrandProductsService = async (brandId: string) => {
  const brand = await Repository.brand.findOne({
    where: { id: brandId },
    relations: {
      product: {
        brand: true,
        category: true,
        cart: true,
        order: true,
      },
    },
  });

  const time = new Date().toISOString();
  const timeMile = Date.parse(time);

  const productsDisponible = brand.product.filter((product) => {
    return (
      +product.launchTime < +timeMile &&
      product.cart == null &&
      product.order == null
    );
  });

  return { message: `Produtos da marca ${brand.name}`, productsDisponible };
};

export default listBrandProductsService;
