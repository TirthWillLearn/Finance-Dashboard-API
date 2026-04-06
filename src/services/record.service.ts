import { pool } from "../config/db";
import { FinancialRecord } from "../types";

type CreateRecord = Omit<FinancialRecord, "id" | "created_at" | "updated_at">;

export const createRecord = async (data: CreateRecord) => {
  const result = await pool.query(
    `INSERT INTO financial_records 
     (user_id,amount,type,category,date,notes) 
     VALUES ($1,$2,$3,$4,$5,$6) 
     RETURNING *`,
    [
      data.user_id,
      data.amount,
      data.type,
      data.category,
      data.date,
      data.notes,
    ],
  );
  return result.rows[0];
};

export const getRecords = async (
  user_id: number,
  category?: string,
  type?: string,
) => {
  let query = `SELECT * FROM financial_records WHERE user_id = $1`;
  const values: any[] = [user_id];
  let count = 2;

  if (category) {
    query += ` AND category = $${count}`;
    values.push(category);
    count++;
  }

  if (type) {
    query += ` AND type = $${count}`;
    values.push(type);
    count++;
  }

  const result = await pool.query(query, values);

  return result.rows;
};

export const updateRecord = async (
  id: number,
  amount?: number,
  type?: string,
  category?: string,
  date?: number,
  notes?: string,
) => {
  let query = `UPDATE financial_records SET `;
  const values: any[] = [];
  let count = 1;

  const setClauses: string[] = [];

  if (amount) {
    setClauses.push(`amount = $${count}`);
    values.push(amount);
    count++;
  }

  if (type) {
    setClauses.push(`type = $${count}`);
    values.push(type);
    count++;
  }

  if (category) {
    setClauses.push(`category = $${count}`);
    values.push(category);
    count++;
  }

  if (date) {
    setClauses.push(`date = $${count}`);
    values.push(date);
    count++;
  }

  if (notes) {
    setClauses.push(`notes = $${count}`);
    values.push(notes);
    count++;
  }

  query += setClauses.join(", ");
  query += ` WHERE id = $${count} RETURNING *`;
  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteRecord = async (id: number) => {
  //   const result = await pool.query(
  await pool.query(
    `
        DELETE FROM financial_records 
        WHERE id = $1
        `,
    [id],
  );
  //   return result.rows[0];
};
