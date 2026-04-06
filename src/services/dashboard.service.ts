import { pool } from "../config/db";

export const getSummary = async (user_id: number) => {
  const result = await pool.query(
    `
    SELECT 
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses
    FROM financial_records
    WHERE user_id = $1
    `,
    [user_id],
  );
  const { total_income, total_expenses } = result.rows[0];
  const net_balance = total_income - total_expenses;

  return { total_income, total_expenses, net_balance };
};

export const getCategoryTotals = async (user_id: number) => {
  const result = await pool.query(
    `
    SELECT category, SUM(amount) as total
    FROM financial_records
    WHERE user_id = $1
    GROUP BY category
    `,
    [user_id],
  );
  return result.rows;
};

export const getMonthlyTrends = async (user_id: number) => {
  const result = await pool.query(
    `
    Select EXTRACT(MONTH FROM date) as month, 
    EXTRACT(YEAR FROM date) as year,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
    FROM financial_records
    WHERE user_id = $1
    group by month , year 
    order by year , month 
    `,
    [user_id],
  );
  return result.rows;
};
