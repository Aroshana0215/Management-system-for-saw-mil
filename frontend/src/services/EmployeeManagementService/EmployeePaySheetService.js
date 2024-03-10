import { getFirestore, collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where , limit , orderBy } from "firebase/firestore";


const db = getFirestore();

export const newPaySheet = async (employeePaySheetData) => {
    console.log("employeePaySheetData:",employeePaySheetData.eid_fk);
    try {
        const querySnapshot = await getDocs(query(
            collection(db, "employeePaySheet"),
            where("eid_fk", "==", employeePaySheetData.eid_fk),
            where("status", "==", "A"),
        ));

        if (!querySnapshot.empty && querySnapshot.docs.length > 0) {
            console.log("in",);

        const querySnapshot = await getDocs(query(
            collection(db, "employeePaySheet"),
            where("eid_fk", "==", employeePaySheetData.eid_fk),
            where("status", "==", "A"),
            orderBy("createdDate", "desc"), // Then order by createdDate descending
            limit(1) // Limit the result to 1 document
        ));

        console.log("querySnapshot:",querySnapshot.docs[0].data());

        if (!querySnapshot.empty ) {
            console.log("in2",);
            const firstDoc = querySnapshot.docs[0].data();
            let filteredDate = "";

            if(firstDoc.toDate != null){
                console.log("in");
                const date = new Date(firstDoc.toDate.seconds * 1000);
                const options = {
                    weekday: "short",
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    timeZoneName: "short"
                };
                filteredDate = date.toLocaleString("en-US", options);
            }
            const fromDate = new Date(employeePaySheetData.fromDate);
            const toDate = new Date(employeePaySheetData.toDate);
            const parsedFilteredDate = new Date(filteredDate)
            if (toDate <= parsedFilteredDate || fromDate <= parsedFilteredDate ) {
                throw new Error("Cannot enter Pay sheet record for paid date.");
            }
        }
    }

        const docRef = await addDoc(collection(db, "employeePaySheet"), employeePaySheetData);
        console.log("New employeePaySheet entered into the system with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error Entering New employeePaySheet: ", error.message);
        throw error;
    }
};



export const getPaysheetDetailsByEmployee = async (eid) => {
    try {
        const q = query(
            collection(db, "employeePaySheet"),
            where("eid_fk", "==", eid),
            where("status", "==", "A")
        );

        const querySnapshot = await getDocs(q);
        const employeePaySheets = []; // Initialize an array to store employeePaySheet objects

        querySnapshot.forEach((docSnapshot) => {
            // Create an object containing the id and data() for each document
            const employeePaySheet = { id: docSnapshot.id, ...docSnapshot.data() };
            employeePaySheets.push(employeePaySheet); // Push the object to the array
        });

        return employeePaySheets; // Return the array of employeePaySheet objects
    } catch (error) {
        console.error("Error getting employeePaySheets: ", error.message);
        throw error;
    }
};


// Update employeePaySheet
export const updateemployeePaySheet = async (employeePaySheetId, employeePaySheetData ) => {
    try {
        const employeePaySheetRef = doc(db, "employeePaySheet", employeePaySheetId);
        await updateDoc(employeePaySheetRef, employeePaySheetData);
        console.log("Price Card employeePaySheet updated successfully");
    } catch (error) {
        console.error("Error updating Price Card employeePaySheet: ", error.message);
        throw error;
    }
};

// Get One employeePaySheet by ID
export const getemployeePaySheetById =  async (employeePaySheetId) => {
    try {
        const employeePaySheetRef = doc(db, "employeePaySheet", employeePaySheetId);
        const employeePaySheetSnapshot = await getDoc(employeePaySheetRef);

        if (employeePaySheetSnapshot.exists()) {
            const employeePaySheet = { id: employeePaySheetSnapshot.id, ...employeePaySheetSnapshot.data() };
            return employeePaySheet;
        } else {
            console.log("employeePaySheet not found");
            return null;
        }
    } catch (error) {
        console.error("Error getting employeePaySheet: ", error.message);
        throw error;
    }
};


