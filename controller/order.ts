import {
  createOrder,
  getAllUserOrder,
  deleteOrder,
} from "../repositories/order";
import { Request, Response } from "express";
import { midtrans } from "../helper/midtrans";
import { randomUUID } from "crypto";

const createOrderController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const { total, items } = req.body;
    const { id } = res.locals.user;
    const transaction_id = randomUUID();
    const { token, redirect_url } = await midtrans(
      transaction_id,
      total,
      items,
      user.name,
      user.email,
    );
    const order = await createOrder(total, items, id, token, redirect_url);
    res.status(201).json({
      status: "Success",
      data: {
        order,
        snap_token: token,
        snap_redirect_url: redirect_url,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const getAllUserOrderController = async (req: Request, res: Response) => {
  try {
    const { id } = res.locals.user;
    const order = await getAllUserOrder(id);
    res.status(200).json({
      status: "Success",
      data: order,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteOrderController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId } = res.locals.user;
    const order = await deleteOrder(userId, id);
    res.status(200).json({
      status: "Success",
      data: order,
    });
  } catch (err) {
    console.log(err);
  }
};

export {
  createOrderController,
  getAllUserOrderController,
  deleteOrderController,
};
