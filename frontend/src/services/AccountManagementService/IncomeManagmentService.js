import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const db = getFirestore();

// Insert new income for price Card List
export const newIncome = async (incomeData) => {
  console.log("New income entered into the syste", incomeData);
  try {
    const docRef = await addDoc(collection(db, "income"), incomeData);
    console.log("New income entered into the system with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error Entering New income: ", error.message);
    throw error;
  }
};

export const getAllincome = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "income"));
    const incomeList = [];
    querySnapshot.forEach((doc) => {
      incomeList.push({ id: doc.id, ...doc.data() });
    });
    return incomeList;
  } catch (error) {
    console.error("Error fetching  income List: ", error.message);
    throw error;
  }
};

// Update income
export const updateincome = async (incomeId, incomeData) => {
  try {
    const incomeRef = doc(db, "income", incomeId);
    await updateDoc(incomeRef, incomeData);
    console.log("Price Card income updated successfully");
  } catch (error) {
    console.error("Error updating Price Card income: ", error.message);
    throw error;
  }
};

// Get One income by ID
export const getincomeById = async (incomeId) => {
  try {
    const incomeRef = doc(db, "income", incomeId);
    const incomeSnapshot = await getDoc(incomeRef);

    if (incomeSnapshot.exists()) {
      const income = { id: incomeSnapshot.id, ...incomeSnapshot.data() };
      return income;
    } else {
      console.log("income not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting income: ", error.message);
    throw error;
  }
};
