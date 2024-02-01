import { Request, Response, NextFunction } from "express";

const validateOrderBody = (req: Request, res: Response, next: NextFunction) => {
  const { items } = req.body;
  if (!items?.length) {
    return res.status(400).json({
      status: "Failed",
      message: "Items is required",
    });
  }
  next();
};

export { validateOrderBody };
