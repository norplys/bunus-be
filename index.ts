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

const app = express();
const port = 3000;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Ping Successfully!");
});

app.post("/v1/register", validateRegisterBody, register);
app.post("/v1/login", validateLogin, login);
app.get("/v1/get-me", validateJwt, getMe);

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

app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`),
);
