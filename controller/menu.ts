import {
  getAllMenu,
  getDetailMenu,
  createMenu,
  deleteMenu,
} from "../repositories/menu";
import { Request, Response } from "express";
import { exclude } from "../helper/exclude";

const getMenus = async (req: Request, res: Response) => {
  const { id } = <{ id: string | undefined }>req.query;
  const menus = await getAllMenu(id);
  res.status(200).json({
    status: "Success",
    message: "Successfully Retrieve Menus",
    data: menus,
  });
};

const getDetailMenuController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const menu = await getDetailMenu(id);
  const excludeMenu = exclude(menu, ["createdAt", "updatedAt", "categoryId"]);
  res.status(200).json({
    status: "Success",
    message: "Successfully Retrieve Data",
    data: excludeMenu,
  });
};

const createMenuContoller = async (req: Request, res: Response) => {
  const { name, price, description, categoryId } = req.body;
  const image = res.locals.image;
  await createMenu({ name, price, description, image, categoryId });
  res.status(201).json({
    status: "Success",
    message: "Menu created successfully",
    data: {
      name,
      price,
      description,
      image,
    },
  });
};

const deleteMenuController = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteMenu(id);
  res.status(200).json({
    status: "Success",
    message: "Menu deleted successfully",
  });
};

export {
  getMenus,
  getDetailMenuController,
  createMenuContoller,
  deleteMenuController,
};
