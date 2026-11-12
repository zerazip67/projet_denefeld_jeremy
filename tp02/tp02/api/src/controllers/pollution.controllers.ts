import { Request, Response } from "express";
import db from "../models";
import { PollutionAttributes } from "../models/pollutions.model";

const Pollutions = db.pollutions;
type PollutionInput = Omit<PollutionAttributes, "id">;
type PollutionPatch = Partial<PollutionInput>;
type ValidationResult<T> = { data: T } | { error: string };

const parseId = (value: string | string[]): number | null => {
  const rawId = Array.isArray(value) ? value[0] : value;
  if (!/^[1-9]\d*$/.test(rawId)) {
    return null;
  }

  const id = Number(rawId);
  return Number.isSafeInteger(id) ? id : null;
};

function validatePayload(body: unknown): ValidationResult<PollutionInput>;
function validatePayload(
  body: unknown,
  partial: true
): ValidationResult<PollutionPatch>;
function validatePayload(
  body: unknown,
  partial = false
): ValidationResult<PollutionInput | PollutionPatch> {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { error: "Le corps de la requête doit être un objet JSON." };
  }

  const payload = body as Record<string, unknown>;
  const data: PollutionPatch = {};

  if (!partial || "ville" in payload) {
    if (typeof payload.ville !== "string" || !payload.ville.trim()) {
      return { error: "Le champ ville doit être une chaîne non vide." };
    }
    data.ville = payload.ville.trim();
  }

  if (!partial || "valeur" in payload) {
    if (typeof payload.valeur !== "number" || !Number.isFinite(payload.valeur)) {
      return { error: "Le champ valeur doit être un nombre fini." };
    }
    data.valeur = payload.valeur;
  }

  if (!partial || "polluant" in payload) {
    if (typeof payload.polluant !== "string" || !payload.polluant.trim()) {
      return { error: "Le champ polluant doit être une chaîne non vide." };
    }
    data.polluant = payload.polluant.trim();
  }

  if (!partial || "date" in payload) {
    if (typeof payload.date !== "string" || !payload.date.trim()) {
      return { error: "Le champ date doit être une chaîne non vide." };
    }
    data.date = payload.date.trim();
  }

  if ("description" in payload) {
    if (payload.description !== null && typeof payload.description !== "string") {
      return { error: "Le champ description doit être une chaîne ou null." };
    }
    data.description = payload.description;
  }

  if (partial) {
    if (Object.keys(data).length === 0) {
      return { error: "Fournissez au moins un champ à modifier." };
    }
    return { data };
  }

  if (
    data.ville === undefined ||
    data.valeur === undefined ||
    data.polluant === undefined ||
    data.date === undefined
  ) {
    return { error: "Les champs ville, valeur, polluant et date sont obligatoires." };
  }

  return {
    data: {
      ville: data.ville,
      valeur: data.valeur,
      polluant: data.polluant,
      date: data.date,
      ...(data.description !== undefined ? { description: data.description } : {})
    }
  };
}

/**
 * Récupère la liste de toutes les mesures de pollution depuis la base PostgreSQL.
 */
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Pollutions.findAll({
      order: [["id", "ASC"]]
    });
    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: "Erreur lors de la récupération des données de pollution: " + message
    });
  }
};

/**
 * Récupère une mesure de pollution par son identifiant.
 */
export const getById = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant doit être un entier positif." });
    return;
  }

  try {
    const data = await Pollutions.findByPk(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({
        message: `Aucune pollution trouvée avec l'id=${id}.`
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la récupération de la pollution id=${id}: ` + message
    });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const validation = validatePayload(req.body);
  if ("error" in validation) {
    res.status(400).json({ message: validation.error });
    return;
  }

  try {
    const data = await Pollutions.create(validation.data);
    res.location(`/api/pollutions/${data.id}`).status(201).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: "Erreur lors de la création de la pollution: " + message
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant doit être un entier positif." });
    return;
  }

  const validation = validatePayload(req.body);
  if ("error" in validation) {
    res.status(400).json({ message: validation.error });
    return;
  }

  try {
    const data = await Pollutions.findByPk(id);
    if (!data) {
      res.status(404).json({ message: `Aucune pollution trouvée avec l'id=${id}.` });
      return;
    }

    await data.update({
      ...validation.data,
      description: validation.data.description ?? null
    });
    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la mise à jour de la pollution id=${id}: ` + message
    });
  }
};

export const patch = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant doit être un entier positif." });
    return;
  }

  const validation = validatePayload(req.body, true);
  if ("error" in validation) {
    res.status(400).json({ message: validation.error });
    return;
  }

  try {
    const data = await Pollutions.findByPk(id);
    if (!data) {
      res.status(404).json({ message: `Aucune pollution trouvée avec l'id=${id}.` });
      return;
    }

    await data.update(validation.data);
    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la mise à jour de la pollution id=${id}: ` + message
    });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant doit être un entier positif." });
    return;
  }

  try {
    const data = await Pollutions.findByPk(id);
    if (!data) {
      res.status(404).json({ message: `Aucune pollution trouvée avec l'id=${id}.` });
      return;
    }

    await data.destroy();
    res.status(204).end();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la suppression de la pollution id=${id}: ` + message
    });
  }
};

export default { getAll, getById, create, update, patch, remove };
