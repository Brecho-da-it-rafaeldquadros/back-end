import Repository from "../../util/repository.util";
import uploadOneImage from "../../util/api/uploadOneImage";

const updateImageProductService = async (
  productId: string,
  file: any,
  query: any
) => {
  const imgUrl = await uploadOneImage(file);
  let data = {};
  if (query.image == "image_1") {
    data = {
      image_1: imgUrl,
    };
  } else if (query.image == "image_2") {
    data = {
      image_2: imgUrl,
    };
  } else if (query.image == "image_3") {
    data = {
      image_3: imgUrl,
    };
  }

  await Repository.product.update(productId, data);

  const updatedProduct = await Repository.product.findOne({
    where: { id: productId },
    relations: { category: true, brand: true, order: true, cart: true },
  });

  return { message: "Produto atualizado com sucesso", updatedProduct };
};
export default updateImageProductService;
