import { Application, Router } from "express";
import signalementsController from "../controllers/signalements.controllers";

export default (app: Application): void => {
  const router = Router();

  router.get("/", signalementsController.getAll);
  router.get("/:id", signalementsController.getById);
  router.post("/", signalementsController.create);
  router.put("/:id", signalementsController.update);
  router.delete("/:id", signalementsController.remove);

  app.use("/api/pollutions", router);
};
