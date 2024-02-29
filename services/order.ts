import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { errorMap } from "../helper/zError";

const orderBodySchema = z.object({
  total: z.number(),
  items: z.array(
    z.object({
      quantity: z.number(),
      total: z.number(),
    }),
  ),
});

const validateOrderBody = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { total, items } = req.body;
    orderBodySchema.parse({ total, items });
    if (!items?.length) {
      return res.status(400).json({
        status: "Failed",
        message: "Items is required",
      });
    }
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

const notifBodySchema = z.object({
  order_id: z.string(),
  transaction_status: z.string(),
  payment_type: z.string(),
});

const validateNotifBody = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order_id, transaction_status, payment_type } = req.body;
    notifBodySchema.parse({ order_id, transaction_status, payment_type });
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
export { validateOrderBody, validateNotifBody };
