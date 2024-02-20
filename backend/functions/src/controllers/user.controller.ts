import { Request, Response } from "express";
import * as logger from 'firebase-functions/logger';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBR06evXooU_y85weKKega5SHeC5LJDOY",
  authDomain: "gocoachbackend.firebaseapp.com",
  projectId: "gocoachbackend",
  storageBucket: "gocoachbackend.appspot.com",
  messagingSenderId: "724440528273",
  appId: "1:724440528273:web:fe9c1027786f33f33d9630"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export class UserController {
    static async signup(req: Request, res: Response) {
        try {
            const { username, password, email } = req.body;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
        
            await setDoc(doc(db, "users", user.uid), {
              email: user.email,
              displayName: username,
            });

  
            return res.status(200).json({
              user_id: user.uid,
              user_name: user.displayName
            });
          } catch (error: any) {
            logger.error(`Error during signup: ${error.message}`, { structuredData: true });
            return res.status(500).send(`Error during signup: ${error.message}`);
          }
    }

    static async login(req: Request, res: Response) {
      try {
        const { email, password } = req.body;
        
          // Check if email and password are provided
        if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required.' });
        }
          // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
          
          // Access the signed-in user information
        const user = userCredential.user;
        console.log("USER IN LOGIN", user);

        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { displayName } = userDoc.data();
          
        console.log('User signed in:', user.email);
        return res.status(200).json({
          user_id: user.uid,
          user_name: displayName
        });
          // Handle success or redirect
          // You can redirect or send a success response to the client
        } catch (error: any) {
          // Handle errors
          console.error('Error during login:', error.message);
          return res.status(500).json({ error: 'Something went wrong.' });
        }
    }
}