import {
  getFirestore,
  collection,
  addDoc,
  doc,
  runTransaction,
  getDocs,
  updateDoc,
  getDoc
} from "firebase/firestore";

const db = getFirestore();

// Insert new billDetails for price Card List
export const newBill = async (billDetailsData) => {
  console.log("New billDetails entered into the system", billDetailsData);
  
  const counterDocRef = doc(db, "counters", "billCounter");

  try {
    // Run a transaction to ensure atomicity
    const billID = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterDocRef);
      
      if (!counterDoc.exists()) {
        throw new Error("Counter document does not exist!");
      }
      
      const currentID = counterDoc.data().currentID || 0;
      const newID = currentID + 1;
      const newBillID = `BILL-${newID}`;
      
      // Update the counter document with the new ID
      transaction.update(counterDocRef, { currentID: newID });
      
      return newBillID;
    });
    
    // Add the new bill record with the generated billID
    const billDetailsDataWithID = { ...billDetailsData, billID: billID };
    const docRef = await addDoc(collection(db, "billDetails"), billDetailsDataWithID);
    console.log("New billDetails entered into the system with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error Entering New billDetails: ", error.message);
    throw error;
  }
};

export const getAllbillDetails = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "billDetails"));
    const billDetailsList = [];
    querySnapshot.forEach((doc) => {
      billDetailsList.push({ id: doc.id, ...doc.data() });
    });
    return billDetailsList;
  } catch (error) {
    console.error("Error fetching  billDetails List: ", error.message);
    throw error;
  }
};

// Update billDetails
export const updatebillDetails = async (billDetailsId, billDetailsData) => {
  try {
    const billDetailsRef = doc(db, "billDetails", billDetailsId);
    await updateDoc(billDetailsRef, billDetailsData);
    console.log("Price Card billDetails updated successfully");
  } catch (error) {
    console.error("Error updating Price Card billDetails: ", error.message);
    throw error;
  }
};

// Get One billDetails by ID
export const getbillDetailsById = async (billDetailsId) => {
  try {
    const billDetailsRef = doc(db, "billDetails", billDetailsId);
    const billDetailsSnapshot = await getDoc(billDetailsRef);

    if (billDetailsSnapshot.exists()) {
      const billDetails = {
        id: billDetailsSnapshot.id,
        ...billDetailsSnapshot.data(),
      };
      return billDetails;
    } else {
      console.log("billDetails not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting billDetails: ", error.message);
    throw error;
  }
};
