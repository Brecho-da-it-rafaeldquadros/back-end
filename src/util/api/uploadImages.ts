import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import AppError from "../../error/appError";

const uploadImage = async (images: any) => {
  if (images) {
    const imagens = [images[0], images[1], images[2]];
    const urlImagens = [];

    for (let i = 0; i < imagens.length; i++) {
      const file = imagens[i];
      if (file !== undefined) {
        try {
          const res = await cloudinary.uploader.upload(file.path, {
            public_id: file.filename,
          });
          urlImagens.push(res.secure_url);
        } catch (error) {
          throw new AppError(error.message);
        }
      }
    }
    return urlImagens;
  }
  return [];
};
export default uploadImage;
