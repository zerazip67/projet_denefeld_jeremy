import { Application, Router } from "express";
import pollutionController from "../controllers/pollution.controllers";

export default (app: Application): void => {
  const router = Router();

  // Route GET /api/pollutions
  router.get("/", pollutionController.getAll);

  // Route GET /api/pollutions/:id
  router.get("/:id", pollutionController.getById);

  // Routes CRUD /api/pollutions
  router.post("/", pollutionController.create);
  router.put("/:id", pollutionController.update);
  router.patch("/:id", pollutionController.patch);
  router.delete("/:id", pollutionController.remove);

  // Exposition sous /api/pollutions et /api/pollution (singulier et pluriel)
  app.use("/api/pollutions", router);
  app.use("/api/pollution", router);
};
