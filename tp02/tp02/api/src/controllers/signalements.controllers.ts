import { Request, Response } from "express";
import db from "../models";
import { SignalementAttributes } from "../models/signalements.model";

const Signalements = db.signalements;
type SignalementInput = Omit<SignalementAttributes, "id">;

const parseId = (value: string | string[]): number | null => {
  const rawId = Array.isArray(value) ? value[0] : value;
  if (!/^[1-9]\d*$/.test(rawId)) {
    return null;
  }

  const id = Number(rawId);
  return Number.isSafeInteger(id) ? id : null;
};

const validatePayload = (body: unknown): SignalementInput | null => {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  const payload = body as Record<string, unknown>;
  if (
    typeof payload.niveau !== "number" ||
    !Number.isInteger(payload.niveau) ||
    payload.niveau < 0 ||
    typeof payload.titre !== "string" ||
    !payload.titre.trim() ||
    typeof payload.type !== "string" ||
    !payload.type.trim() ||
    typeof payload.description !== "string" ||
    typeof payload.date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(payload.date) ||
    typeof payload.lieu !== "string" ||
    !payload.lieu.trim() ||
    typeof payload.latitude !== "number" ||
    !Number.isFinite(payload.latitude) ||
    payload.latitude < -90 ||
    payload.latitude > 90 ||
    typeof payload.longitude !== "number" ||
    !Number.isFinite(payload.longitude) ||
    payload.longitude < -180 ||
    payload.longitude > 180 ||
    (payload.photo !== undefined && typeof payload.photo !== "string")
  ) {
    return null;
  }

  return {
    niveau: payload.niveau,
    titre: payload.titre.trim(),
    type: payload.type.trim(),
    description: payload.description,
    date: payload.date,
    lieu: payload.lieu.trim(),
    latitude: payload.latitude,
    longitude: payload.longitude,
    photo: typeof payload.photo === "string" ? payload.photo : ""
  };
};

const invalidPayload = (res: Response): void => {
  res.status(400).json({
    message:
      "Fournissez un niveau entier positif ou nul, un titre, type, description, date (AAAA-MM-JJ), lieu, latitude (-90 à 90), longitude (-180 à 180) et une URL de photo facultative."
  });
};

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Signalements.findAll({ order: [["id", "DESC"]] });
    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la récupération des signalements: " + message });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant doit être un entier positif." });
    return;
  }

  try {
    const data = await Signalements.findByPk(id);
    if (!data) {
      res.status(404).json({ message: `Aucun signalement trouvé avec l'id=${id}.` });
      return;
    }
    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: `Erreur lors de la récupération du signalement id=${id}: ` + message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const input = validatePayload(req.body);
  if (!input) {
    invalidPayload(res);
    return;
  }

  try {
    const data = await Signalements.create(input);
    res.location(`/api/signalements/${data.id}`).status(201).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la création du signalement: " + message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant doit être un entier positif." });
    return;
  }

  const input = validatePayload(req.body);
  if (!input) {
    invalidPayload(res);
    return;
  }

  try {
    const data = await Signalements.findByPk(id);
    if (!data) {
      res.status(404).json({ message: `Aucun signalement trouvé avec l'id=${id}.` });
      return;
    }

    await data.update(input);
    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: `Erreur lors de la mise à jour du signalement id=${id}: ` + message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant doit être un entier positif." });
    return;
  }

  try {
    const data = await Signalements.findByPk(id);
    if (!data) {
      res.status(404).json({ message: `Aucun signalement trouvé avec l'id=${id}.` });
      return;
    }

    await data.destroy();
    res.status(204).end();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: `Erreur lors de la suppression du signalement id=${id}: ` + message });
  }
};

export default { getAll, getById, create, update, remove };
