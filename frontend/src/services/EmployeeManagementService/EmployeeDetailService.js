import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  setDoc,
  runTransaction
} from "firebase/firestore";

const db = getFirestore();

export const newEmployee = async (employeeDetailsData) => {
  console.log("employeeDetailsData", employeeDetailsData);
  
  const counterDocRef = doc(db, "counters", "employeeCounter");

  try {
    // Check if the counter document exists
    const counterDocSnapshot = await getDoc(counterDocRef);
    
    if (!counterDocSnapshot.exists()) {
      // If the counter document does not exist, create it with currentID: 0
      await setDoc(counterDocRef, { currentID: 0 });
      console.log("Employee counter document created with initial currentID: 0");
    }

    // Run a transaction to ensure atomicity
    const empID = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterDocRef);
      
      const currentID = counterDoc.data().currentID || 0;
      const newID = currentID + 1;
      const newEmpID = `EMP-${newID}`;
      
      // Update the counter document with the new ID
      transaction.update(counterDocRef, { currentID: newID });
      
      return newEmpID;
    });
    
    // Add the new employee record with the generated empID
    const employeeDetailsWithID = { ...employeeDetailsData, empID: empID };
    const docRef = await addDoc(collection(db, "employeeDetails"), employeeDetailsWithID);
    console.log("New employeeDetails entered into the system with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error Entering New employeeDetails: ", error.message);
    throw error;
  }
};

export const getAllemployeeDetails = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "employeeDetails"));
    const employeeDetailsList = [];
    querySnapshot.forEach((doc) => {
      employeeDetailsList.push({ id: doc.id, ...doc.data() });
    });
    return employeeDetailsList;
  } catch (error) {
    console.error("Error fetching  employeeDetails List: ", error.message);
    throw error;
  }
};

// Update employeeDetails
export const updateemployeeDetails = async (
  employeeDetailsId,
  employeeDetailsData
) => {
  try {
    const employeeDetailsRef = doc(db, "employeeDetails", employeeDetailsId);
    await updateDoc(employeeDetailsRef, employeeDetailsData);
    console.log("Price Card employeeDetails updated successfully");
  } catch (error) {
    console.error("Error updating Price Card employeeDetails: ", error.message);
    throw error;
  }
};

// Get One employeeDetails by ID
export const getemployeeDetailsById = async (employeeDetailsId) => {
  try {
    const employeeDetailsRef = doc(db, "employeeDetails", employeeDetailsId);
    const employeeDetailsSnapshot = await getDoc(employeeDetailsRef);

    if (employeeDetailsSnapshot.exists()) {
      const employeeDetails = {
        id: employeeDetailsSnapshot.id,
        ...employeeDetailsSnapshot.data(),
      };
      return employeeDetails;
    } else {
      console.log("employeeDetails not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting employeeDetails: ", error.message);
    throw error;
  }
};
