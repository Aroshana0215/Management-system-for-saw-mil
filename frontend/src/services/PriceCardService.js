import { getFirestore, collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where, runTransaction } from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";

const db = getFirestore();

// Insert new category for price Card List
export const createCategory = async (categoryData) => {
  console.log("New Category entered into the system", categoryData);

  const counterDocRef = doc(db, "counters", "categoryCounter");

  try {
    // Run a transaction to ensure atomicity
    const categoryID = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterDocRef);

      if (!counterDoc.exists()) {
        throw new Error("Counter document does not exist!");
      }

      const currentID = counterDoc.data().currentID || 0;
      const newID = currentID + 1;
      const newCategoryID = `CAT-${newID}`;

      // Update the counter document with the new ID
      transaction.update(counterDocRef, { currentID: newID });

      return newCategoryID;
    });

    // Add the new category record with the generated categoryID
    const categoryDataWithID = { ...categoryData, categoryID: categoryID };
    const docRef = await addDoc(collection(db, "priceCard"), categoryDataWithID);
    console.log("New Category entered into the system with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error Entering New Category: ", error.message);
    throw error;
  }
};




export const getAllCategories = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "priceCard"));
        const priceCardList = [];
        querySnapshot.forEach((doc) => {
            priceCardList.push({ id: doc.id, ...doc.data() });
        });
        return priceCardList;
    } catch (error) {
        console.error("Error fetching price Card List: ", error.message);
        throw error;
    }
};

// Update category
export const updateCategory = async (categoryId, categoryData ) => {
    try {
        const priceCardRef = doc(db, "priceCard", categoryId);
        await updateDoc(priceCardRef, categoryData);
        console.log("Price Card Category updated successfully");
    } catch (error) {
        console.error("Error updating Price Card Category: ", error.message);
        throw error;
    }
};

// Get One category by ID
export const getCategoryById =  async (categoryId) => {
    try {
        const priceCardRef = doc(db, "priceCard", categoryId);
        const priceCardSnapshot = await getDoc(priceCardRef);

        if (priceCardSnapshot.exists()) {
            const priceCard = { id: priceCardSnapshot.id, ...priceCardSnapshot.data() };
            return priceCard;
        } else {
            console.log("Category not found");
            return null;
        }
    } catch (error) {
        console.error("Error getting Category: ", error.message);
        throw error;
    }
};

// Delete category
export const deleteCategory = createAsyncThunk("category/delete", async (categoryId) => {
    try {
        const priceCardRef = doc(db, "priceCard", categoryId);
        await deleteDoc(priceCardRef);
        console.log("Price Card Category deleted successfully");
        return categoryId;
    } catch (error) {
        console.error("Error deleting Price Card Category: ", error.message);
        throw error;
    }
});



export const getCategoryIdBytimberType  = async (id) => {

    try {
        const q = query(
            collection(db, "priceCard"),
            where("categoryID", "==", id),
            // where("status", "==", "A"),
            // where("areaWidth", "==", areaWidth),
            // where("thickness", "==", thickness)
        );

        const querySnapshot = await getDocs(q);
        console.log("querySnapshot empty:", querySnapshot.empty);

        if (!querySnapshot.empty) {
            const docSnapshot = querySnapshot.docs[0];
            const stockSummaryDetails = { id: docSnapshot.id, ...docSnapshot.data() };
            return stockSummaryDetails;
        } else {
            console.log("No stockSummaryDetails found for the given parameters.");
            return null;
        }
    } catch (error) {
        console.error("Error getting stockSummaryDetails: ", error.message);
        throw error;
    }
};

