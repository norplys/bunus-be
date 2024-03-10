import express from "express";
import cors from "cors";
import {
  validateRegisterBody,
  validateLogin,
  validateJwt,
  validateAdmin,
  checkTokenExist,
  checkExpiredToken,
  validateForgotPassword,
  checkIsForgotTokenExist,
} from "./services/auth";
import {
  register,
  login,
  getMe,
  validateEmail,
  forgotPasswordController,
} from "./controller/auth";
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
  deleteCartItemController,
  cartNotifController,
} from "./controller/cart";
import {
  getUserCartService,
  validateCartBody,
  countTotal,
  checkCartItem,
  checkCartUpdate,
  getSingleCart,
} from "./services/cart";
import {
  createOrderController,
  getAllUserOrderController,
  deleteOrderController,
  midtransNotification,
} from "./controller/order";
import { validateOrderBody } from "./services/order";
import { redirect, oAuthExist, findAndCreateUser } from "./services/oAuth2";
import { googleController } from "./controller/oAuth2";

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Ping Successfully!");
});

// google auth
app.get("/auth/google", redirect);
app.get(
  "/api/sessions/oauth/google",
  oAuthExist,
  findAndCreateUser,
  googleController,
);

// auth
app.post("/v1/register", validateRegisterBody, register);
app.post("/v1/login", validateLogin, login);
app.get("/v1/get-me", validateJwt, getMe);
app.put(
  "/v1/validate-email/:token",
  checkTokenExist,
  checkExpiredToken,
  validateEmail,
);
app.post(
  "/v1/forgot-password",
  validateForgotPassword,
  checkIsForgotTokenExist,
  forgotPasswordController,
);

// menu
app.get("/v1/categories", category);
app.get("/v1/menus", getMenus);
app.get("/v1/menus/:id", getDetailMenuController);
app.post(
  "/v1/menus",
  validateJwt,
  validateAdmin,
  uploadImageToLocal,
  uploadToCloudinary,
  createMenuValidation,
  createMenuContoller,
);
app.delete("/v1/menus/:id", validateJwt, validateAdmin, deleteMenuController);
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
app.get("/v1/cart-notif", validateJwt, getUserCartService, cartNotifController);
app.get("/v1/cart", validateJwt, getUserCartService, getCart);
app.delete("/v1/cart", validateJwt, getUserCartService, deleteCart);
app.delete(
  "/v1/cart-item/:id",
  validateJwt,
  getSingleCart,
  deleteCartItemController,
);
// order
app.get("/v1/orders", validateJwt, getAllUserOrderController);
app.post("/v1/orders", validateJwt, validateOrderBody, createOrderController);
app.delete("/v1/orders/:id", validateJwt, deleteOrderController);
// midtrans
app.post("/v1/midtrans-notification", midtransNotification);

app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`),
);
