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

// Insert new expense for price Card List
export const newExpense = async (expenseData) => {
  try {
    const docRef = await addDoc(collection(db, "expense"), expenseData);
    console.log("New expense entered into the system with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error Entering New expense: ", error.message);
    throw error;
  }
};

export const getAllexpense = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "expense"));
    const expenseList = [];
    querySnapshot.forEach((doc) => {
      expenseList.push({ id: doc.id, ...doc.data() });
    });
    return expenseList;
  } catch (error) {
    console.error("Error fetching  expense List: ", error.message);
    throw error;
  }
};

// Update expense
export const updateexpense = async (expenseId, expenseData) => {
  try {
    const expenseRef = doc(db, "expense", expenseId);
    await updateDoc(expenseRef, expenseData);
    console.log("Price Card expense updated successfully");
  } catch (error) {
    console.error("Error updating Price Card expense: ", error.message);
    throw error;
  }
};

// Get One expense by ID
export const getexpenseById = async (expenseId) => {
  try {
    const expenseRef = doc(db, "expense", expenseId);
    const expenseSnapshot = await getDoc(expenseRef);

    if (expenseSnapshot.exists()) {
      const expense = { id: expenseSnapshot.id, ...expenseSnapshot.data() };
      return expense;
    } else {
      console.log("expense not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting expense: ", error.message);
    throw error;
  }
};
