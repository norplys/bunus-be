import {
  createOrder,
  getAllUserOrder,
  deleteOrder,
  updatePaymentOrder,
} from "../repositories/order";
import { Request, Response } from "express";
import { midtrans } from "../helper/midtrans";
import { randomUUID } from "crypto";

const createOrderController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const { total, items } = req.body;
    const transaction_id = randomUUID();
    const { token, redirect_url } = await midtrans(
      transaction_id,
      total,
      items,
      user.name,
      user.email,
    );
    const [order, deleteCart] = await createOrder(
      transaction_id,
      total,
      items,
      user.id,
      token,
      redirect_url,
    );
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
    const order = await deleteOrder(id);
    res.status(200).json({
      status: "Success",
      data: order,
    });
  } catch (err) {
    console.log(err);
  }
};

const midtransNotification = async (req: Request, res: Response) => {
  try {
    const { order_id, transaction_status, payment_type } = req.body;
    if (transaction_status) {
      await updatePaymentOrder(order_id, {
        status: transaction_status,
        method: payment_type,
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Notification received",
    });
  } catch (err) {
    console.log(err);
  }
};

export {
  createOrderController,
  getAllUserOrderController,
  deleteOrderController,
  midtransNotification,
};
