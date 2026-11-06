import { DataTypes, Model, ModelStatic, Optional, Sequelize } from "sequelize";

export interface SignalementAttributes {
  id: number;
  titre: string;
  type: string;
  description: string;
  date: string;
  lieu: string;
  latitude: number;
  longitude: number;
  photo: string;
}

export interface SignalementCreationAttributes
  extends Optional<SignalementAttributes, "id"> {}

export interface SignalementInstance
  extends Model<SignalementAttributes, SignalementCreationAttributes>,
    SignalementAttributes {}

export type SignalementModel = ModelStatic<SignalementInstance>;

export default function defineSignalements(sequelize: Sequelize): SignalementModel {
  return sequelize.define<SignalementInstance>(
    "signalement",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      titre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      lieu: {
        type: DataTypes.STRING,
        allowNull: false
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      photo: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ""
      }
    },
    {
      tableName: "signalement",
      freezeTableName: true,
      timestamps: false
    }
  );
}
