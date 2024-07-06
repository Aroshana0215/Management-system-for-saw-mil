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
  console.log("stockData:",stockData);
  try {
    const docRef = await addDoc(collection(db, "inventorySummary"), stockData);
    console.log("sucessfully created inventory details: ");
    return docRef.id;
  } catch (error) {
    console.error("Error Entering inventory details ", error.message);
    throw error;
  }
};

export const getActiveStockSummaryDetails = async (categoryId, length) => {
  try {

    console.log("length:",length)
    const q = query(
      collection(db, "inventorySummary"),
      where("categoryId_fk", "==", categoryId),
      where("length", "==", length),
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
  try {
    const priceCardRef = doc(db, "inventorySummary", stockId);
    await updateDoc(priceCardRef, stockData);
    console.log("Inventory Summary updated successfully");
  } catch (error) {
    console.error("Error updating Inventory Summary: ", error.message);
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

export const getAllActiveStockDetails = async () => {
  try {
    const q = query(
      collection(db, "inventorySummary"),
      where("status", "==", "A")
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
    const InventoryDetailList = [];
    querySnapshot.forEach((doc) => {      
      InventoryDetailList.push({ id: doc.id, ...doc.data() });
    });
    return InventoryDetailList;
  }else{
    console.error("Noc ative stocks available: ");
  }
  } catch (error) {
    console.error(
      "Error fetching Inventory Summary Detail List: ",
      error.message
    );
    throw error;
  }
};
