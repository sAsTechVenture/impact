/**
 * Script to create a super_admin user in the database
 * 
 * Usage:
 *   npm run create-super-admin
 *   or
 *   tsx scripts/create-super-admin.ts
 * 
 * Environment variables (required):
 *   DATABASE_URL - MySQL connection string (e.g., mysql://user:password@host:port/database)
 * 
 * Environment variables (optional):
 *   SUPER_ADMIN_EMAIL - Email for super admin (default: superadmin@impact.com)
 *   SUPER_ADMIN_PASSWORD - Password for super admin (default: SuperAdmin@123)
 *   SUPER_ADMIN_NAME - Name for super admin (default: Super Admin)
 */

import bcrypt from "bcryptjs";
import * as readline from "readline";
import mysql from "mysql2/promise";
import { createId } from "@paralleldrive/cuid2";
import "dotenv/config";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

/**
 * Parse DATABASE_URL and return MySQL connection config
 */
function parseDatabaseUrl(url: string): mysql.ConnectionOptions {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port) : 3306,
      user: parsed.username,
      password: parsed.password,
      database: parsed.pathname.slice(1), // Remove leading '/'
    };
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL format: ${url}`);
  }
}

async function createSuperAdmin() {
  let connection: mysql.Connection | null = null;

  try {
    console.log("🔐 Create Super Admin User\n");

    // Validate DATABASE_URL
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL environment variable is required. Please set it in your .env file."
      );
    }

    // Parse and create database connection
    const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
    connection = await mysql.createConnection(dbConfig);

    // Get user input
    const email =
      process.env.SUPER_ADMIN_EMAIL ||
      (await question("Enter email (default: superadmin@impact.com): ")) ||
      "superadmin@impact.com";

    const password =
      process.env.SUPER_ADMIN_PASSWORD ||
      (await question("Enter password (default: SuperAdmin@123): ")) ||
      "SuperAdmin@123";

    const name =
      process.env.SUPER_ADMIN_NAME ||
      (await question("Enter name (default: Super Admin): ")) ||
      "Super Admin";

    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      "SELECT id, email, name, role, password FROM users WHERE email = ?",
      [normalizedEmail]
    );

    const existingUser = Array.isArray(existingUsers)
      ? (existingUsers[0] as any)
      : null;

    if (existingUser) {
      console.log(`\n⚠️  User with email ${email} already exists.`);
      const update = await question(
        "Do you want to update this user to super_admin? (y/n): "
      );

      if (update.toLowerCase() === "y" || update.toLowerCase() === "yes") {
        // Hash password if it's different from the stored one
        let hashedPassword = existingUser.password;
        const shouldUpdatePassword =
          password && password !== process.env.SUPER_ADMIN_PASSWORD;

        if (shouldUpdatePassword) {
          hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update user
        await connection.execute(
          `UPDATE users 
           SET role = ?, isActive = ?, password = ?, name = ?, updatedAt = NOW() 
           WHERE email = ?`,
          ["super_admin", true, hashedPassword, name, normalizedEmail]
        );

        console.log("✅ User updated to super_admin successfully!");
        console.log(`   Email: ${email}`);
        console.log(`   Name: ${name}`);
        console.log(`   Role: super_admin`);
      } else {
        console.log("❌ Operation cancelled.");
      }
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate CUID for ID
      const userId = createId();

      // Create super_admin user
      await connection.execute(
        `INSERT INTO users (id, email, password, name, role, isActive, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [userId, normalizedEmail, hashedPassword, name, "super_admin", true]
      );

      console.log("\n✅ Super admin user created successfully!");
      console.log(`   Email: ${normalizedEmail}`);
      console.log(`   Name: ${name}`);
      console.log(`   Role: super_admin`);
      console.log(`   ID: ${userId}`);
    }
  } catch (error) {
    console.error("❌ Error creating super admin:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
    if (connection) {
      await connection.end();
    }
  }
}

createSuperAdmin();

