import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import issueRoutes from "./routes/issue.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import bodyParser from 'body-parser';
import cors from 'cors';
import { google } from 'googleapis';



dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();



const app = express();

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});



app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/issues', issueRoutes);



app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(bodyParser.json());

// app.use(express.static(path.join(__dirname, "../refaa-client/dist")));




app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../refaa-client/dist/index.html"));
// });



