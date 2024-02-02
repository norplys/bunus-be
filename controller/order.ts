import {
  createOrder,
  getAllUserOrder,
  deleteOrder,
} from "../repositories/order";
import { Request, Response } from "express";

const createOrderController = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    const { id } = res.locals.user;
    const order = await createOrder(items, id);
    res.status(201).json({
      status: "Success",
      data: order,
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
