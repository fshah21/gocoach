import { Router } from "express";
import { ClassController } from "../controllers/class.controller";

export const classRoutes = Router();

classRoutes.post("/classes/createClass", ClassController.createClass);
classRoutes.post("/classes/addSection/:class_id", ClassController.addSection);