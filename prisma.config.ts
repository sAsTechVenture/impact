import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL || "mysql://root:root@localhost:3306/impact_db?schema=public";

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
});
