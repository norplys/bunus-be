import { createOrder } from "../repositories/order";
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

export { createOrderController };
