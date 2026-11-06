import { randomBytes, scryptSync } from "crypto";
import { Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";
import db from "../models";

const Users = db.users;

interface UserInput {
  name: string;
  email: string;
  password: string;
}

const validatePayload = (body: unknown): UserInput | null => {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  const payload = body as Record<string, unknown>;
  if (
    typeof payload.name !== "string" ||
    !payload.name.trim() ||
    typeof payload.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim()) ||
    typeof payload.password !== "string" ||
    payload.password.length < 8
  ) {
    return null;
  }

  return {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password
  };
};

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email"],
      order: [["id", "ASC"]]
    });
    res.status(200).json(users);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs: " + message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const input = validatePayload(req.body);
  if (!input) {
    res.status(400).json({
      message: "Fournissez un nom, une adresse e-mail valide et un mot de passe d'au moins 8 caractères."
    });
    return;
  }

  try {
    const salt = randomBytes(16).toString("hex");
    const passwordHash = `${salt}:${scryptSync(input.password, salt, 64).toString("hex")}`;
    const user = await Users.create({
      name: input.name,
      email: input.email,
      passwordHash
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (err: unknown) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({ message: "Un compte utilise déjà cette adresse e-mail." });
      return;
    }

    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur: " + message });
  }
};

export default { getAll, create };
