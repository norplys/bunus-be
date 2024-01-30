import { Request, Response, NextFunction } from "express";
import { getUserCart, getCartItem, updateCartItem } from "../repositories/cart";
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
    if (!userCart) {
      res.status(404).json({
        status: "Failed",
        message: "Cart not found",
      });
    }
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

const checkCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { menuId, quantity } = req.body;
    const cartId = res.locals.cartId;
    const total = res.locals.total;
    const cartItem = await getCartItem(cartId, menuId);
    if (cartItem) {
      const data = {
        quantity,
        total,
      };
      const update = await updateCartItem(cartItem.id, data);
      return res.status(200).json({
        status: "Success",
        message: "Cart data exist, updating data",
        data: update,
      });
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

const checkCartUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { menuId } = req.body;
    const cartId = res.locals.cartId;
    const cartItem = await getCartItem(cartId, menuId);
    if (!cartItem) {
      return res.status(404).json({
        status: "Failed",
        message: "Cart data not found",
      });
    }
    res.locals.cartItemId = cartItem?.id;
    next();
  } catch (err) {
    console.log(err);
  }
};

const countTotal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { menuId, quantity } = req.body;
    const menu = await getDetailMenu(menuId);
    if (!menu) {
      return res.status(404).json({
        status: "Failed",
        message: "Menu not found",
      });
    }
    const total = quantity * +menu!.price;
    res.locals.total = total;
    next();
  } catch (err) {
    console.log(err);
  }
};
export {
  getUserCartService,
  validateCartBody,
  countTotal,
  checkCartItem,
  checkCartUpdate,
};
