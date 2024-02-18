import { Router } from "express";
import { ClassController } from "../controllers/class.controller";

export const classRoutes = Router();

classRoutes.post("/classes/createClass", ClassController.createClass);
classRoutes.post("/classes/addSection/:class_id", ClassController.addSection);
classRoutes.get("/users/:user_id/classes/getAllSectionsInClass/:class_id", ClassController.getAllSectionsInClass);
classRoutes.post("/sections/deleteSection/:section_id", ClassController.deleteSection);
classRoutes.put("/sections/editSection/:section_id", ClassController.editSection);