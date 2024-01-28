import { Request, Response } from "express";
import { createCartItem } from "../repositories/cart";

const createCartItemController = async (req: Request, res: Response) => {
  try {
    const { menuId, quantity } = req.body;
    const cartId = res.locals.cartId;
    const total = res.locals.total;
    const cartItem = await createCartItem(cartId, menuId, quantity, total);
    res.status(201).json({
      status: "Success",
      message: "Cart item successfully created",
      data: cartItem,
    });
  } catch (err) {
    console.log(err);
  }
};

export { createCartItemController };
