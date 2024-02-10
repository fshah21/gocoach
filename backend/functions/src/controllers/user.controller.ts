import { Request, Response } from "express";
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';

export class UserController {
    static async signup(req: Request, res: Response) {
        try {
            // Extract user data from request body
            const { username, email, password } = req.body;
        
            // Validate input data
            if (!username || !email || !password) {
              throw new Error('Username, email, and password are required.');
            }
                
            // Create user in Firebase Authentication
            const userRecord = await admin.auth().createUser({
              displayName: username,
              email,
              password,
            });
        
            // Store additional user data in Firestore
            const userUid = userRecord.uid;
            const userData = { username, email, uid: userUid };

            await admin.firestore().collection('users').doc(userUid).set(userData);
        
            logger.info('User signed up successfully!', { structuredData: true });
            res.send('User signed up successfully!');
          } catch (error: any) {
            logger.error(`Error during signup: ${error.message}`, { structuredData: true });
            res.status(500).send(`Error during signup: ${error.message}`);
          }
    }
}