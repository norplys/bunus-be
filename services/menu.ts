import { Request, Response, NextFunction } from "express";
import { cloudinary } from "../helper/cloudinary";
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage }).single("image");

const createMenuValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, price, description } = req.body;
  if (!name || !price || !description) {
    res.status(400).json({
      status: "Failed",
      message: "name or price or description is required",
    });
  }
  next();
};

const uploadImageToLocal = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({
        status: "Failed",
        message: err.message,
      });
      return;
    }
    next();
  });
};

const uploadToCloudinary = (req: Request, res: Response) => {
  const fileBase64 = req.file?.buffer.toString("base64");
  const file = `data:${req.file?.mimetype};base64,${fileBase64}`;
  console.log(req.body);

  cloudinary.uploader.upload(file, (err, result) => {
    if (err) {
      return res.status(400).json({
        status: "Failed",
        message: "Cant upload image please try again",
      });
    }
    res.status(201).json({
      status: "Success",
      link: result?.url,
    });
  });
};

export { uploadImageToLocal, uploadToCloudinary };
