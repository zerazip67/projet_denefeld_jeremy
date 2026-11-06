import { DataTypes, Model, ModelStatic, Optional, Sequelize } from "sequelize";

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

export type UserModel = ModelStatic<UserInstance>;

export default function defineUsers(sequelize: Sequelize): UserModel {
  return sequelize.define<UserInstance>(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "password_hash"
      }
    },
    {
      tableName: "users",
      freezeTableName: true,
      timestamps: false
    }
  );
}
