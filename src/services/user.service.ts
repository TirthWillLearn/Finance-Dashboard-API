import { pool } from "../config/db";
import bcrypt from "bcryptjs";
import { User } from "../types";
import jwt from "jsonwebtoken";

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: User["role"],
) => {
  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
        INSERT INTO users
        (name,email,password,role)
        VALUES ($1,$2,$3,$4)
        RETURNING *
        `,
    [name, email, hashed, role],
  );
  return result.rows[0];
};

export const getUserByEmail = async (email: string) => {
  const result = await pool.query(
    `
        SELECT * from users
        WHERE email = $1
        `,
    [email],
  );

  return result.rows[0];
};

export const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email);

  if (!user) throw new Error("Invalid Credential (Email)");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid Credential (Password)");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" },
  );

  return token;
};
