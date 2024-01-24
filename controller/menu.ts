import { getAllMenu } from "../repositories/menu";
import { Request, Response } from "express";

const getMenus = async (req: Request, res: Response) => {
  const { id } = <{ id: string | undefined }>req.query;
  const menus = await getAllMenu(id);
  res.status(200).json({
    status: "Success",
    message: "Successfully Retrieve Menus",
    data: menus,
  });
};

export { getMenus };
