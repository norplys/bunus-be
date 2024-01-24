import { getAllMenu, getDetailMenu } from "../repositories/menu";
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

export { getMenus, getDetailMenuController };
