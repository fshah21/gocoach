const express = require("express");
import * as admin from 'firebase-admin';
import { onRequest } from 'firebase-functions/v2/https';
import { userRoutes } from './routes/user.routes';
import cors from "cors";
import { json } from "body-parser";

admin.initializeApp();
const app = express();

// Define the signup route
app.use(json());

app.use(cors());

app.use(userRoutes);

// Define other routes as needed...

// Define the main backend function
export const backend = onRequest((req, res) => {
  app(req, res);
});