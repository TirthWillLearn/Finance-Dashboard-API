import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/user.routes";
import recRoutes from "./routes/record.routes";
import dashRoutes from "./routes/dashboard.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Finance Dashboard API" });
});

app.use("/api/auth", authRoutes);

app.use("/api/records", recRoutes);

app.use("/api/dashboard", dashRoutes);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
