import { Application } from "express";
import mesuresRoutes from "./mesures.routes";
import pollutionRoutes from "./pollution.routes";
import signalementsRoutes from "./signalements.routes";
import usersRoutes from "./users.routes";

export default (app: Application): void => {
  pollutionRoutes(app);
  signalementsRoutes(app);
  mesuresRoutes(app);
  usersRoutes(app);
};
