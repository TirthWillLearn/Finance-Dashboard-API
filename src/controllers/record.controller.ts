import { Request, Response } from "express";
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} from "../services/record.service";

export const create = async (req: Request, res: Response) => {
  try {
    const { user_id, amount, type, category, date, notes } = req.body;

    const records = await createRecord({
      user_id,
      amount,
      type,
      category,
      date,
      notes,
    });

    res.status(201).json({ message: "Records  created Succesfully ", records });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;

    const category = req.query.category as string | undefined;
    const type = req.query.type as string | undefined;

    const records = await getRecords(user_id, category, type);

    res.status(200).json({ message: "Records!  ", records });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const { amount, type, category, date, notes } = req.body;

    const records = await updateRecord(id, amount, type, category, date, notes);

    res.status(200).json({ message: "Updated Records!  ", records });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const records = await deleteRecord(id);

    res.status(200).json({ message: "Records Deleted Succesfully!  " });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
