import { getCategory } from "../repositories/category";
import { Request, Response } from "express";

const category = async (req: Request, res: Response) => {
  try {
    const categories = await getCategory();
    res.status(200).json({
      status: "Success",
      message: "Succesfully Retrieve Data",
      data: categories,
    });
  } catch (err) {
    console.log(err);
  }
};

export { category };
