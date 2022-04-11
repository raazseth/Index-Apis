require("dotenv").config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import apicache from "apicache";

const app = express();
const PORT = 8080;
const cache = apicache.middleware;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(cache("10 minutes"));

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 1000,
  standardHeaders: false,
  legacyHeaders: false,
  skipFailedRequests: true,
  keyGenerator: (request, response) => request.ip,
});

app.use(limiter);
app.set("trust proxy", 1);

mongoose.connect(process.env["ATLAS_URI"] || "");
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB connection established succesfully 😎");
});

const AuthRoutes = require("./Routes/AuthRoutes");
const TodoRoutes = require("./Routes/index");

app.use("/api", AuthRoutes);
app.use("/api", TodoRoutes);


app.listen(PORT, () => console.log(`Server is listening at ${PORT} 🤡`));
