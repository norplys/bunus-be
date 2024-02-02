import express from "express";
import {
  validateRegisterBody,
  validateLogin,
  validateJwt,
} from "./services/auth";
import { register, login, getMe } from "./controller/auth";
import { category } from "./controller/category";
import {
  getMenus,
  getDetailMenuController,
  createMenuContoller,
  deleteMenuController,
} from "./controller/menu";
import {
  uploadImageToLocal,
  uploadToCloudinary,
  createMenuValidation,
} from "./services/menu";
import {
  createCartItemController,
  getCart,
  deleteCart,
  updateCart,
} from "./controller/cart";
import {
  getUserCartService,
  validateCartBody,
  countTotal,
  checkCartItem,
  checkCartUpdate,
} from "./services/cart";
import {
  createOrderController,
  getAllUserOrderController,
  deleteOrderController,
} from "./controller/order";
import { validateOrderBody } from "./services/order";

const app = express();
const port = 3000;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Ping Successfully!");
});
// auth
app.post("/v1/register", validateRegisterBody, register);
app.post("/v1/login", validateLogin, login);
app.get("/v1/get-me", validateJwt, getMe);
// menu
app.get("/v1/categories", category);
app.get("/v1/menus", getMenus);
app.get("/v1/menus/:id", getDetailMenuController);
app.post(
  "/v1/menus",
  uploadImageToLocal,
  uploadToCloudinary,
  createMenuValidation,
  createMenuContoller,
);
app.delete("/v1/menus/:id", deleteMenuController);
// cart
app.post(
  "/v1/cart-item",
  validateJwt,
  validateCartBody,
  getUserCartService,
  countTotal,
  checkCartItem,
  createCartItemController,
);
app.put(
  "/v1/cart-item",
  validateJwt,
  validateCartBody,
  getUserCartService,
  countTotal,
  checkCartUpdate,
  updateCart,
);
app.get("/v1/cart", validateJwt, getUserCartService, getCart);
app.delete("/v1/cart", validateJwt, getUserCartService, deleteCart);
// order
app.get("/v1/orders", validateJwt, getAllUserOrderController);
app.post("/v1/orders", validateJwt, validateOrderBody, createOrderController);
app.delete("/v1/orders/:id", validateJwt, deleteOrderController);

app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`),
);
