import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export const userRoutes = Router();

userRoutes.post("/users/signup", UserController.signup);
userRoutes.post("/users/login", UserController.login);
userRoutes.post("/users/:user_id/addPaymentMethod", UserController.addPaymentMethod);
userRoutes.get("/users/:user_id/getPaymentMethod", UserController.getPaymentMethod);