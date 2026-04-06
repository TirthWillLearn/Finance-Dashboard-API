export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "viewer" | "analyst" | "admin";
  status: "active" | "inactive";
  created_at: Date;
  updated_at: Date;
}

export interface FinancialRecord {
  id: number;
  user_id: number;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date;
  notes: string;
  created_at: Date;
  updated_at: Date;
}
