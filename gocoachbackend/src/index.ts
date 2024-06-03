const express = require("express");
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as userController from './controllers/usercontroller';
import { ClassController } from './controllers/classcontroller';
import cors from "cors";
import { json } from "body-parser";
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccountKey = process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  throw new Error('Missing GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY environment variable');
}

const serviceAccount = JSON.parse(serviceAccountKey);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

// Create Express app
const app = express();
app.use(json());
app.use(cors());

export const db = admin.firestore();

// Define routes
app.post('/api/users/signup', userController.createUser);
app.post('/api/users/login', userController.loginUser);
app.post("/api/classes/createClass", ClassController.createClass);
app.post("/api/classes/addSection/:class_id", ClassController.addSection);
app.get("/api/users/:user_id/classes/getAllSectionsInClass/:class_id", ClassController.getAllSectionsInClass);
app.post("/api/sections/deleteSection/:section_id", ClassController.deleteSection);
app.put("/api/sections/editSection/:section_id", ClassController.editSection);
app.get("/api/classes/:user_id", ClassController.getAllClasses);
app.get("/api/classes/:user_id/getClassForToday", ClassController.getClassForToday);
app.get("/api/classes/:user_id/getPastClasses", ClassController.getPastClasses);
app.post("/api/classes/saveRating/:class_id", ClassController.saveRating);
app.post("/api/classes/:class_id/getClassRating", ClassController.getClassRating);

// Export the Express app as a Cloud Function
export const api = functions.https.onRequest(app);