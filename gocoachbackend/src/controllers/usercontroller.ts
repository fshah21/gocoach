import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
// import * as bcrypt from 'bcrypt'; 

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body;
    const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: displayName,
    });

    // Save user details to Firestore
    await admin.firestore().collection("users").doc(userRecord.uid).set({
        email: userRecord.email,
        displayName: displayName,
    });

    return res.status(200).json({
        user_id: userRecord.uid,
        user_name: displayName
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    console.log("Both are present");
    // Sign in with email and password
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log("User record", userRecord);
    const user = userRecord.toJSON() as admin.auth.UserRecord;
    console.log("User", user);

    // Validate password
    // const passwordMatch = await bcrypt.compare(password, user.passwordHash || '');
    // console.log("PASSWORD MATCH", passwordMatch);
    // if (!passwordMatch) {
    //   return res.status(401).json({ error: 'Invalid email or password.' });
    // }

    if(!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    console.log('User signed in:', email);
    return res.status(200).json({
      user_id: user.uid,
      email: user.email
      // Add other user data as needed
    });

    // // Check if user exists in Firestore
    // const userDoc = await admin.firestore().collection('users').doc(user?.uid).get();

    // if (!userDoc.exists) {
    //   return res.status(404).json({ error: 'User not found' });
    // }

    // const userData = userDoc.data() as User | undefined;

    // if (!userData) {
    //   return res.status(404).json({ error: 'User data not found' });
    // }

    // console.log('User signed in:', user?.email);
    // return res.status(200).json({
    //   user_id: user?.uid,
    //   user_name: userData
    // });
  } catch (error: any) {
    console.error('Error during login:', error.message);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};