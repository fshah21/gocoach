import { Request, Response } from "express";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { setDoc, doc, collection } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDBR06evXooU_y85weKKega5SHeC5LJDOY",
  authDomain: "gocoachbackend.firebaseapp.com",
  projectId: "gocoachbackend",
  storageBucket: "gocoachbackend.appspot.com",
  messagingSenderId: "724440528273",
  appId: "1:724440528273:web:fe9c1027786f33f33d9630"
};

// interface Section {
//     name: string;
//     startTime: string;
//     finishTime: string;
// }

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export class ClassController {
    static async createClass(req: Request, res: Response) {
        try {
            const { user_id, class_name, class_duration, class_date } = req.body;
        
            // Validate class data (add more validation as needed)
        
            // Generate a new classId
            const classId = doc(collection(db, 'users', user_id, 'classes')).id;     

            // Create class document
            await setDoc(doc(db, 'users', user_id, 'classes', classId), {
              name: class_name,
              duration: class_duration,
              date: class_date,
            });
        
            return res.status(201).json({ 
                class_id: classId
            });
          } catch (error: any) {
            console.error(`Error creating class: ${error.message}`);
            return res.status(500).send(`Error creating class: ${error.message}`);
          }
    }
}