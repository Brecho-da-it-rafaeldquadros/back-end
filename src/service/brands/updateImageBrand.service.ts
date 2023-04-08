import AppError from "../../error/appError";
import Repository from "../../util/repository.util";
import uploadOneImage from "../../util/api/uploadOneImage";

const updateImageBrandService = async (brandId: string, file: any) => {
  const imgUrl = await uploadOneImage(file);
  if (!imgUrl) {
    throw new AppError("Não foi possivel enviar a imagem");
  }
  let data = {
    sizeTable: imgUrl,
  };

  await Repository.brand.update(brandId, data);

  const updatedBrand = await Repository.brand.findOne({
    where: { id: brandId },
  });

  return { message: "Produto atualizado com sucesso", updatedBrand };
};
export default updateImageBrandService;
