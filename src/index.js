import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.port || 3000, "0.0.0.0", () => {
      console.log(`Server is running at port : ${process.env.port}`);
    });
  })
  .catch((err) => {
    console.log("mongoDB connection failed", err);
  });
