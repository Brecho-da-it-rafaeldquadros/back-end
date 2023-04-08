import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import AppError from "../../error/appError";

const uploadOneImage = async (file: any) => {
  let img = "";
  if (file !== undefined) {
    try {
      const res = await cloudinary.uploader.upload(file.path, {
        public_id: file.filename,
      });
      img = res.secure_url;
    } catch (error) {
      throw new AppError(error.message);
    }
  }
  return img;
};
export default uploadOneImage;
