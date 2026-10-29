const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`La variable d'environnement ${name} est obligatoire.`);
  }
  return value;
};

export const databaseUrl =
  process.env.DATABASE_URL ??
  `postgres://${encodeURIComponent(requiredEnv("DB_USER"))}:${encodeURIComponent(
    requiredEnv("DB_PASSWORD")
  )}@${requiredEnv("DB_HOST")}:${process.env.DB_PORT || "5432"}/${encodeURIComponent(
    requiredEnv("DB_NAME")
  )}`;
