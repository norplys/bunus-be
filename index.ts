import express from "express";
import { google } from "googleapis";
import {
  validateRegisterBody,
  validateLogin,
  validateJwt,
  validateAdmin,
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

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
});

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Ping Successfully!");
});
// google auth
app.get("/auth/google", (req, res) => {
  res.redirect(authUrl);
});
app.get("/api/sessions/oauth/google", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const { data } = await oauth2.userinfo.get();
    if (!data) {
      return res.status(400).send("Error");
    }
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
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
app.get("/v1/cart", validateJwt, getUserCartService, getCart);
app.delete("/v1/cart", validateJwt, getUserCartService, deleteCart);
// order
app.get("/v1/orders", validateJwt, getAllUserOrderController);
app.post("/v1/orders", validateJwt, validateOrderBody, createOrderController);
app.delete("/v1/orders/:id", validateJwt, deleteOrderController);

app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`),
);
