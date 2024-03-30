import { Request, Response } from "express";
import { initializeApp } from "firebase/app";
import { getDoc, getFirestore } from "firebase/firestore";
import { setDoc, doc, collection, Timestamp, getDocs, query, deleteDoc, updateDoc, orderBy, where } from "firebase/firestore"; 

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

interface ClassData {
    id: string;
    date: string; 
    createdAt: string;
    name: string;
    duration: number;
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
                section_coach_notes, count_direction_up, interval, prep, timer, timer_enabled, interval_enabled,
                prep_enabled } = req.body;
        
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
              countDirectionUp: count_direction_up,
              intervalTime: interval,
              prepTime: prep,
              timer: timer,
              timerEnabled: timer_enabled,
              intervalEnabled: interval_enabled,
              prepEnabled: prep_enabled,
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

    static async getAllClasses(req: Request, res: Response) {
        try {
            const { user_id } = req.params;
        
            // Query for all sections in the specified class
            const classesQuery = query(
              collection(db, 'users', user_id, 'classes'),
              orderBy('createdAt', 'desc')
            );
        
            // Retrieve the sections
            const classesSnapshot = await getDocs(classesQuery);
        
            // Extract section data
            const classesData = classesSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
        
            return res.status(200).json(classesData);
        } catch (error: any) {
            console.error(`Error getting sections: ${error.message}`);
            return res.status(500).send(`Error getting sections: ${error.message}`);
        }
    }

    static async getClassForToday(req: Request, res: Response) {
        try {
          const { user_id } = req.params;
      
          // Get today's date in the format YYYY-MM-DD
          const todayDate = new Date().toISOString().split('T')[0];

          const classesQuery = query(
            collection(db, 'users', user_id, 'classes'),
            orderBy('createdAt', 'desc')
          );
      
          // Retrieve the sections
          const classesSnapshot = await getDocs(classesQuery);
      
          // Extract section data
          const classesData = classesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ClassData[];

          const filteredClassesData = classesData
            .filter((classData) => {
                const classDate = new Date(classData.date).toISOString().split('T')[0];
                console.log("CLASS DATE", classDate);
                return classDate === todayDate;
            });

            filteredClassesData.forEach((classData) => {
            // Process each class for today
            console.log(classData);
            });
          
      
          return res.status(200).json(filteredClassesData);
        } catch (error: any) {
          console.error(`Error getting classes for today: ${error.message}`);
          return res.status(500).send(`Error getting classes for today: ${error.message}`);
        }
    }

    static async getPastClasses(req: Request, res: Response) {
        try {
            const { user_id } = req.params;
        
            // Get today's date in the format YYYY-MM-DD
            const todayDate = new Date().toISOString().split('T')[0];
        
            const classesQuery = query(
              collection(db, 'users', user_id, 'classes'),
              where('date', '<', todayDate + 'T00:00:00.000Z'), // Include all classes before today
              orderBy('date', 'desc')
            );
        
            // Retrieve the classes
            const classesSnapshot = await getDocs(classesQuery);
        
            // Extract class data
            const classesData = classesSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as ClassData[];
        
            return res.status(200).json(classesData);
        } catch (error: any) {
            console.error(`Error getting classes in the past: ${error.message}`);
            return res.status(500).send(`Error getting classes in the past: ${error.message}`);
        }
    }

    static async saveRating(req: Request, res: Response) {
      try {
          const { class_id } = req.params;
          const { user_id, rating } = req.body;
            
          const classRef = doc(db, 'users', user_id, 'classes', class_id);   

          await setDoc(classRef, { rating: rating }, { merge: true });
      
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
          
        const classRef = doc(db, 'users', user_id, 'classes', class_id);   

        const classSnapshot = await getDoc(classRef);
    
        if (classSnapshot.exists()) {
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
          console.error(`Error saving rating: ${error.message}`);
          return res.status(500).send(`Error saving rating: ${error.message}`);
      }
    }

    static async addPaymentMethod(req: Request, res: Response) {
      try {
        const { class_id } = req.params;
        const { user_id, card_number, expiry_date, cvv } = req.body;
    
        // Reference to the payment methods collection under the user document
        const paymentMethodsCollectionRef = collection(db, `users/${user_id}/classes/${class_id}/payment_methods`);
        
        // Add the payment method data to Firestore
        const newPaymentMethodRef = doc(paymentMethodsCollectionRef);
        await setDoc(newPaymentMethodRef, {
          card_number: card_number,
          expiry_date: expiry_date,
          cvv: cvv
        });
    
        return res.status(201).json({ success: true, message: 'Payment method added successfully', paymentMethodId: newPaymentMethodRef.id });
      } catch (error: any) {
        console.error(`Error adding payment method: ${error.message}`);
        return res.status(500).send(`Error adding payment method: ${error.message}`);
      }
    }
}