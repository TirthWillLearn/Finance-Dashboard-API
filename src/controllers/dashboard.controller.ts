import { Request, Response } from "express";
import {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
} from "../services/dashboard.service";

export const summary = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;

    const dashboard = await getSummary(user_id);
    res.status(200).json({ message: "Records Summary!  ", dashboard });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const category = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;

    const dashboard = await getCategoryTotals(user_id);
    res.status(200).json({ message: "Records Category Totals!  ", dashboard });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const monthly = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;

    const dashboard = await getMonthlyTrends(user_id);
    res.status(200).json({ message: "Records Monthly Trends!  ", dashboard });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
