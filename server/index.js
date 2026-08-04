import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import { authenticate } from "./routes/authMiddleware.js";
import authRouter from "./routes/auth.js";
import eventsRouter from "./routes/events.js";
import goalsRouter from "./routes/goals.js";
import habitsRouter from "./routes/habits.js";
import timetableRouter from "./routes/timetable.js";
import weeklyTasksRouter from "./routes/weeklytasks.js";
import resourcesRouter from "./routes/resources.js";
import todosRouter from "./routes/todos.js";
import focusRouter from "./routes/focus.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/events", authenticate, eventsRouter);
app.use("/api/goals", authenticate, goalsRouter);
app.use("/api/habits", authenticate, habitsRouter);
app.use("/api/timetable", authenticate, timetableRouter);
app.use("/api/weeklytasks", authenticate, weeklyTasksRouter);
app.use("/api/resources", authenticate, resourcesRouter);
app.use("/api/todos", authenticate, todosRouter);
app.use("/api/focus", authenticate, focusRouter);

const distPath = path.join(__dirname, "../client/dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Planner server running at ${PORT}`);
});
