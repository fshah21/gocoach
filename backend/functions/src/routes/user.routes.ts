import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export const userRoutes = Router();

userRoutes.post("/users/signup", UserController.signup);
userRoutes.post("/users/login", UserController.login);
userRoutes.post("/saveCard", UserController.saveCard);