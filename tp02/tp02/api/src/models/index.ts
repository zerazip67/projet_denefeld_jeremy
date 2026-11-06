import { Sequelize } from "sequelize";
import { databaseUrl } from "../config";
import definePollutions, { PollutionModel } from "./pollutions.model";
import defineSignalements, { SignalementModel } from "./signalements.model";
import defineUsers, { UserModel } from "./users.model";

const isLocalHost = databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1");
const useSsl =
  process.env.DB_SSL === "true" ||
  (process.env.DB_SSL !== "false" && !isLocalHost);

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : {},
  define: {
    timestamps: false
  }
});

export interface Database {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  pollutions: PollutionModel;
  signalements: SignalementModel;
  users: UserModel;
}

export const db: Database = {
  Sequelize,
  sequelize,
  pollutions: definePollutions(sequelize, Sequelize),
  signalements: defineSignalements(sequelize),
  users: defineUsers(sequelize)
};

export default db;
