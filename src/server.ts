import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import variables from "./variables";

import { router } from "./routes";

const app = express();

const corseOptions = { credentials: true, origin: process.env.URL || "*" };
const port = variables.app.port || 5132;

app.use(express.json());
app.use(cors(corseOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
