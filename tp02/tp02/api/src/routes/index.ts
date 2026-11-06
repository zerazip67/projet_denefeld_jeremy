import { Application } from "express";
import pollutionRoutes from "./pollution.routes";
import signalementsRoutes from "./signalements.routes";

export default (app: Application): void => {
  pollutionRoutes(app);
  signalementsRoutes(app);
};
