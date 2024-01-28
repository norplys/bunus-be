import { Request, Response, NextFunction } from "express";
import { getUserCart } from "../repositories/cart";
import { z } from "zod";
import { errorMap } from "../helper/zError";
import { getDetailMenu } from "../repositories/menu";

const cartBodySchema = z.object({
  menuId: z.string(),
  quantity: z.number(),
});

const getUserCartService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = res.locals.user;
    const userCart = await getUserCart(id);
    res.locals.cartId = userCart?.id;
    next();
  } catch (err) {
    console.log(err);
  }
};

const validateCartBody = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { menuId, quantity } = req.body;
    cartBodySchema.parse({ menuId, quantity });
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = errorMap(err);
      return res.status(400).json({
        status: "Failed",
        message: errors,
      });
    }
  }
};

const countTotal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { menuId, quantity } = req.body;
    const menu = await getDetailMenu(menuId);
    const total = quantity * Number(menu?.price);
    res.locals.total = total;
    next();
  } catch (err) {
    console.log(err);
  }
};
export { getUserCartService, validateCartBody, countTotal };
