import { Request, Response } from "express";
import { db } from "../index";
import * as admin from 'firebase-admin';

interface SectionUpdate {
    coachNotes?: string;
    displayText?: string;
    finishTime?: number;
    name?: string;
    startTime?: number;
}

interface ClassData {
    id: string;
    date: string; 
    createdAt: string;
    name: string;
    duration: number;
}

export class ClassController {
    static async createClass(req: Request, res: Response) {
        try {
            const { user_id, class_name, class_duration, class_date } = req.body;
        
            // Validate class data (add more validation as needed)
        
            // Generate a new classId
            const classId = db.collection('users').doc(user_id).collection('classes').doc().id;     

            // Create class document
            await db.collection('users').doc(user_id).collection('classes').doc(classId).set({
              name: class_name,
              duration: class_duration,
              date: class_date,
              createdAt: admin.firestore.Timestamp.now(),
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
                section_coach_notes, count_direction_up, interval, prep, timer, timer_enabled, interval_enabled,
                prep_enabled } = req.body;
        
            // Validate section data (add more validation as needed)
        
            // Generate a new sectionId
            const sectionId = db.collection('users').doc(user_id).collection('classes').doc(class_id).collection('sections').doc().id;
        
            // Create section document
            await db.collection('users').doc(user_id).collection('classes').doc(class_id).collection('sections').doc(sectionId).set({
              name: section_name,
              startTime: section_start_time,
              finishTime: section_finish_time,
              displayText: section_display_text,
              coachNotes: section_coach_notes,
              countDirectionUp: count_direction_up,
              intervalTime: interval,
              prepTime: prep,
              timer: timer,
              timerEnabled: timer_enabled,
              intervalEnabled: interval_enabled,
              prepEnabled: prep_enabled,
              createdAt: admin.firestore.Timestamp.now(),
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
            const sectionsQuery = db.collection('users').doc(user_id).collection('classes').doc(class_id).collection('sections');
            
            // Retrieve the sections
            const sectionsSnapshot = await sectionsQuery.get();
            
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
        
            const sectionRef = db.collection('users').doc(user_id).collection('classes').doc(class_id).collection('sections').doc(section_id);
            await sectionRef.delete();

            return res.status(204).send();
        } catch (error: any) {
            console.error(`Error deleting section: ${error.message}`);
            return res.status(500).send(`Error deleting section: ${error.message}`);
        }
    }

    static async editSection(req: Request, res: Response) {
        try {
            const { section_id } = req.params;
            const { user_id, class_id, coach_notes, display_text, finish_time, name, start_time } = req.body;
          
            const sectionRef = db.collection('users').doc(user_id).collection('classes').doc(class_id).collection('sections').doc(section_id);
                
            // Create an object with the fields to update
            const updatedData: SectionUpdate = {};

            // Add fields to updatedData only if they are truthy
            if (coach_notes) updatedData.coachNotes = coach_notes;
            if (display_text) updatedData.displayText = display_text;
            if (finish_time) updatedData.finishTime = finish_time;
            if (name) updatedData.name = name;
            if (start_time) updatedData.startTime = start_time;
        
            // Use updateDoc to edit the section data
            await sectionRef.update(updatedData as { [key: string]: any });
        
            return res.status(204).send();
          } catch (error: any) {
            console.error(`Error editing section: ${error.message}`);
            return res.status(500).send(`Error editing section: ${error.message}`);
          }
    }

    static async getAllClasses(req: Request, res: Response) {
        try {
            const { user_id } = req.params;
        
            // Query for all sections in the specified class
            const classesQuery = db.collection('users').doc(user_id).collection('classes');
        
            // Retrieve the sections
            const classesSnapshot = await classesQuery.get();
        
            // Extract section data
            const classesData = classesSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
        
            return res.status(200).json(classesData);
        } catch (error: any) {
            console.error(`Error getting classes: ${error.message}`);
            return res.status(500).send(`Error getting classes: ${error.message}`);
        }
    }

    static async getClassForToday(req: Request, res: Response) {
        try {
            var { user_id } = req.params;
        
            // Get today's date in the format YYYY-MM-DD
            const todayDate = new Date().toISOString().split('T')[0];

            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
            const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
            console.log("TODAY DATE", todayDate);
            console.log("START OF DAY", startOfDay);
            console.log("END OF DAY", endOfDay);

            const classesQuery = db.collection('users').doc(user_id).collection('classes');
        
            // Retrieve the sections
            // const classesSnapshot = await classesQuery.where('date', '==', todayDate).get();
            const classesSnapshot = await classesQuery
            .where('date', '>=', startOfDay)
            .where('date', '<=', endOfDay)
            .get();
            console.log("CLASSES NEW QUERY DATE RANGE", classesSnapshot);
            console.log("COMMENTING USER ID");
        
            // Extract section data
            const classesData = classesSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            console.log("CLASSES DATA", classesData);
        
            return res.status(200).json(classesData);
        } catch (error: any) {
            console.error(`Error getting classes for today: ${error.message}`);
            return res.status(500).send(`Error getting classes for today: ${error.message}`);
        }
    }

    static async getPastClasses(req: Request, res: Response) {
        try {
            const { user_id } = req.params;
        
            // Get today's date in the format YYYY-MM-DD
            const today = new Date();
            const startOfToday = new Date(today.setHours(0, 0, 0, 0)).toISOString();
            
            console.log("Start of Today:", startOfToday);

            const classesQuery = admin.firestore()
                .collection('users')
                .doc(user_id)
                .collection('classes')
                .where('date', '<', startOfToday);
                        
            // Retrieve the classes
            const classesSnapshot = await classesQuery.get();
        
            // Extract class data
            const classesData = classesSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as ClassData[];
        
            return res.status(200).json(classesData);
        } catch (error: any) {
            console.error(`Error getting past classes: ${error.message}`);
            return res.status(500).send(`Error getting past classes: ${error.message}`);
        }
    }

    static async saveRating(req: Request, res: Response) {
        try {
            const { class_id } = req.params;
            const { user_id, rating } = req.body;
              
            const classRef = db.collection('users').doc(user_id).collection('classes').doc(class_id);   
  
            await classRef.set({ rating: rating }, { merge: true });
        
            return res.status(201).json({ 
                class_id: class_id 
            });
        } catch (error: any) {
            console.error(`Error saving rating: ${error.message}`);
            return res.status(500).send(`Error saving rating: ${error.message}`);
        }
    }  

    static async getClassRating(req: Request, res: Response) {
        try {
          const { class_id } = req.params;
          const { user_id } = req.body;
            
          const classRef = db.collection('users').doc(user_id).collection('classes').doc(class_id);   
  
          const classSnapshot = await classRef.get();
      
          if (classSnapshot.exists) {
            const classData = classSnapshot.data();
            if (classData && classData.rating !== undefined) {
                const rating = classData.rating;
                console.log("Rating:", rating);
                return res.status(200).json({ 
                    class_id: class_id,
                    rating: rating
                });
            } else {
                console.log("No rating found for this class.");
                return res.status(404).send("No rating found for this class.");
            }
        } else {
            console.log("Class document does not exist.");
            return res.status(404).send("Class document does not exist.");
        }
        } catch (error: any) {
            console.error(`Error getting class rating: ${error.message}`);
            return res.status(500).send(`Error getting class rating: ${error.message}`);
        }
    }
}