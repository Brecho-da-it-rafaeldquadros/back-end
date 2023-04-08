import { Request, Response } from "express";
import teste from "../../util/api/uploadImages";
import { v2 as cloudinary } from "cloudinary";
import { Any, Index } from "typeorm";

const uploadImageController = async (req: Request, resp: Response) => {
  const imagens = [req.files[0], req.files[1], req.files[2]];
  const test = [];
  imagens.forEach((file) => {
    cloudinary.config({
      cloud_name: "djrarfriv",
      api_key: "952546334526536",
      api_secret: "20OTidRr0xRjAyXteCIebfbGS_4",
    });
    imagens.forEach((element, index) => {});

    const res = cloudinary.uploader.upload(file.path, {
      public_id: file.originalname,
    });

    res
      .then((data) => {
        console.log(data);
        console.log(data.secure_url);
      })
      .catch((err) => {
        console.log(err);
      });

    const url = cloudinary.url(file.fie, {
      width: 100,
      height: 150,
      Crop: "fill",
    });
    test.push({ imagem: url });
  });

  return resp.status(200).json({ image: req.file, rest: test });
};
export default uploadImageController;
