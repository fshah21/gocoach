import { Request, Response } from "express";
import * as logger from 'firebase-functions/logger';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, Timestamp } from "firebase/firestore"; 

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

    static async saveCard(req: Request, res: Response) {
      try {
        const { user_id } = req.body; // Assuming you're sending the user ID along with card details
        const { card_number, expiry_date, cvv, card_name } = req.body;

        // Check if all required fields are provided
        if (!user_id || !card_number || !expiry_date || !cvv || !card_name) {
          return res.status(400).json({ error: 'All fields are required.' });
        }

        // Create a reference to the "payments" collection for the user
        const paymentRef = doc(collection(db, 'users', user_id, 'payments')).id;     

        // Add the card details to the "payments" collection
        await setDoc(doc(db, 'users', user_id, 'payments', paymentRef), {
          card_number: card_number,
          expiry_date: expiry_date,
          cvv: cvv,
          card_name: card_name,
          createdAt: Timestamp.now(),
        });

        return res.status(200).json({ message: 'Card details saved successfully.' });
      } catch (error: any) {
        console.error('Error saving card details:', error.message);
        return res.status(500).json({ error: 'Something went wrong.' });
      }

    }
}