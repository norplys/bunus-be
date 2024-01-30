import { Request, Response } from "express";
import {
  createCartItem,
  getCartData,
  deleteCartData,
  updateCartItem,
} from "../repositories/cart";

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

const getCart = async (req: Request, res: Response) => {
  try {
    const id = res.locals.cartId;
    const data = await getCartData(id);
    if (!data?.items.length) {
      return res.status(200).json({
        status: "Success",
        message: "Successfully Retrieve Data",
        data: {
          ...data,
          total: 0,
        },
      });
    }
    const total = data?.items
      .map((each) => each.total || 0)
      .reduce((acc, current) => acc + current);
    res.status(200).json({
      status: "Success",
      message: "Successfully Retrieve Data",
      data: {
        ...data,
        total,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const updateCart = async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    const cartId = res.locals.cartItemId;
    const total = res.locals.total;
    const data = {
      quantity,
      total,
    };
    const cartItem = await updateCartItem(cartId, data);
    res.status(200).json({
      status: "Success",
      message: "Cart item successfully updated",
      data: cartItem,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteCart = async (req: Request, res: Response) => {
  try {
    const id = res.locals.cartId;
    await deleteCartData(id);
    res.status(200).json({
      status: "Success",
      message: `Successfully Delete Data with id ${id}`,
    });
  } catch (err) {
    console.log(err);
  }
};

export { createCartItemController, getCart, deleteCart, updateCart };
