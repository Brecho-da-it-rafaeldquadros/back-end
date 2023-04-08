import multer from "multer";
import crypto from "crypto";

const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: "upload",
    filename: (request, file, callback) => {
      // console.log(file);
      crypto.randomBytes(16, (err, hash) => {
        if (err) callback(err, "Error");

        const fileName = `${hash.toString("hex")} - ${file.originalname}`;

        console.log(fileName);
        console.log(file.originalname);

        callback(null, fileName);
      });
    },
  }),
});

export default uploadMiddleware;
