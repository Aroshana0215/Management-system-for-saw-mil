import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

const db = getFirestore();

// Insert new order for price Card List
export const createStockSummary = async (stockData) => {
  try {
    const docRef = await addDoc(collection(db, "inventorySummary"), stockData);
    return docRef.id;
  } catch (error) {
    console.error("Error Entering New order: ", error.message);
    throw error;
  }
};

export const getActiveStockSummaryDetails = async (categoryId) => {
  try {
    const q = query(
      collection(db, "inventorySummary"),
      where("categoryId_fk", "==", categoryId),
      where("status", "==", "A")
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If query returns a result, get the first document
      const docSnapshot = querySnapshot.docs[0];
      const stockSummaryDetails = { id: docSnapshot.id, ...docSnapshot.data() };
      return stockSummaryDetails;
    } else {
      console.log("No stockSummaryDetails found for categoryId:", categoryId);
      return null;
    }
  } catch (error) {
    console.error("Error getting stockSummaryDetails: ", error.message);
    throw error;
  }
};

export const updateStockSummaryDetails = async (stockId, stockData) => {
  console.log("updateStockSummaryDetails:", stockId);
  console.log("updateStockSummaryDetails:", stockData);
  try {
    const priceCardRef = doc(db, "inventorySummary", stockId);
    await updateDoc(priceCardRef, stockData);
    console.log("Price Card stock updated successfully");
  } catch (error) {
    console.error("Error updating Price Card stock: ", error.message);
    throw error;
  }
};

export const getAllSummaryDetails = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "inventorySummary"));
    const InventoryDetailList = [];
    querySnapshot.forEach((doc) => {
      InventoryDetailList.push({ id: doc.id, ...doc.data() });
    });
    return InventoryDetailList;
  } catch (error) {
    console.error(
      "Error fetching Inventory Summary Detail List: ",
      error.message
    );
    throw error;
  }
};
