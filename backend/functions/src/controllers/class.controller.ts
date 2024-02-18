import { Request, Response } from "express";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { setDoc, doc, collection, Timestamp, getDocs, query, deleteDoc, updateDoc } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDBR06evXooU_y85weKKega5SHeC5LJDOY",
  authDomain: "gocoachbackend.firebaseapp.com",
  projectId: "gocoachbackend",
  storageBucket: "gocoachbackend.appspot.com",
  messagingSenderId: "724440528273",
  appId: "1:724440528273:web:fe9c1027786f33f33d9630"
};

interface SectionUpdate {
    coachNotes?: string;
    displayText?: string;
    finishTime?: number;
    name?: string;
    startTime?: number;
}

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
              createdAt: Timestamp.now(),
            });
        
            return res.status(201).json({ 
                class_id: classId
            });
        } catch (error: any) {
            console.error(`Error creating class: ${error.message}`);
            return res.status(500).send(`Error creating class: ${error.message}`);
        }
    }

    static async addSection(req: Request, res: Response) {
        try {
            const { class_id } = req.params;
            const { user_id, section_name, section_start_time, section_finish_time, section_display_text, 
                section_coach_notes } = req.body;
        
            // Validate section data (add more validation as needed)
        
            // Generate a new sectionId
            const sectionId = doc(collection(db, 'users', user_id, 'classes', class_id, 'sections')).id;
        
            // Create section document
            await setDoc(doc(db, 'users', user_id, 'classes', class_id, 'sections', sectionId), {
              name: section_name,
              startTime: section_start_time,
              finishTime: section_finish_time,
              displayText: section_display_text,
              coachNotes: section_coach_notes,
              createdAt: Timestamp.now(),
            });
        
            return res.status(201).json({ 
                section_id: sectionId 
            });
        } catch (error: any) {
            console.error(`Error adding section: ${error.message}`);
            return res.status(500).send(`Error adding section: ${error.message}`);
        }
    }

    static async getAllSectionsInClass(req: Request, res: Response) {
        try {
            const { user_id, class_id } = req.params;
        
            // Query for all sections in the specified class
            const sectionsQuery = query(
              collection(db, 'users', user_id, 'classes', class_id, 'sections')
            );
        
            // Retrieve the sections
            const sectionsSnapshot = await getDocs(sectionsQuery);
        
            // Extract section data
            const sectionsData = sectionsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
        
            return res.status(200).json(sectionsData);
        } catch (error: any) {
            console.error(`Error getting sections: ${error.message}`);
            return res.status(500).send(`Error getting sections: ${error.message}`);
        }
    }

    static async deleteSection(req: Request, res: Response) {
        try {
            const { section_id } = req.params;
            const { user_id, class_id } = req.body;
        
            const sectionRef = doc(db, 'users', user_id, 'classes', class_id, 'sections', section_id);
            await deleteDoc(sectionRef);

            return res.status(204).send();
        } catch (error: any) {
            console.error(`Error getting sections: ${error.message}`);
            return res.status(500).send(`Error getting sections: ${error.message}`);
        }
    }

    static async editSection(req: Request, res: Response) {
        try {
            const { section_id } = req.params;
            const { user_id, class_id, coach_notes, display_text, finish_time, name, start_time } = req.body;
          
            const sectionRef = doc(db, 'users', user_id, 'classes', class_id, 'sections', section_id);
                
            // Create an object with the fields to update
            const updatedData: SectionUpdate = {};

            // Add fields to updatedData only if they are truthy
            if (coach_notes) updatedData.coachNotes = coach_notes;
            if (display_text) updatedData.displayText = display_text;
            if (finish_time) updatedData.finishTime = finish_time;
            if (name) updatedData.name = name;
            if (start_time) updatedData.startTime = start_time;
        
            // Use updateDoc to edit the section data
            await updateDoc(sectionRef, updatedData as { [x: string]: any; });
        
            return res.status(204).send();
          } catch (error: any) {
            console.error(`Error editing section: ${error.message}`);
            return res.status(500).send(`Error editing section: ${error.message}`);
          }
    }

}