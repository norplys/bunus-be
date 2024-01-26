import { Request, Response, NextFunction } from "express";
import { cloudinary } from "../helper/cloudinary";
import multer from "multer";
import { z } from "zod";
import { errorMap } from "../helper/zError";
import { category } from "../controller/category";

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

const menuSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  categoryId: z.string(),
});

const createMenuValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, price, description, categoryId } = req.body;
    const image = res.locals.image;
    if (!image) {
      res.locals.image =
        "https://res.cloudinary.com/dpg0tbbot/image/upload/v1704978359/bunus/ntqqtbkh2zme9tpo3zcn.svg";
    }
    const newPrice = Number(price);
    menuSchema.parse({ name, price: newPrice, description, categoryId });
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = errorMap(err);
      return res.status(400).json({
        status: "error",
        message: errors,
      });
    }
  }
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

const uploadToCloudinary = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const fileBase64 = req.file?.buffer.toString("base64");
  if (!fileBase64) {
    next();
    return;
  }
  const file = `data:${req.file?.mimetype};base64,${fileBase64}`;
  cloudinary.uploader.upload(file, (err, result) => {
    if (err) {
      return res.status(400).json({
        status: "Failed",
        message: "Cant upload image please try again",
      });
    }
    res.locals.image = result?.url;
    next();
  });
};

export { uploadImageToLocal, uploadToCloudinary, createMenuValidation };
