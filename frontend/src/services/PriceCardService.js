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
    const categoryDataWithID = { ...categoryData, categoryId: categoryID };
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
    console.log("categoryData:",categoryData)
    try {
        const priceCardRef = doc(db, "priceCard", categoryId);
        await updateDoc(priceCardRef, categoryData);
        console.log("Price Card Category updated successfully");
    } catch (error) {
        console.error("Error updating Price Card Category: ", error.message);
        throw error;
    }
};

export const getCategoryById = async (categoryId) => {
    console.log("Searching for category with unique attribute:", categoryId);
    
    try {
        // Create a query against the collection
        const q = query(
            collection(db, "priceCard"),
            where("categoryId", "==", categoryId),
        );

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Log the number of documents found
        console.log("Number of documents found:", querySnapshot.size);

        // Check if any documents match the query
        if (!querySnapshot.empty) {
            // Log the document data for debugging
            querySnapshot.forEach(doc => {
                console.log("Document data:", doc.data());
            });

            // Assuming uniqueAttribute is unique, return the first matching document
            const docSnapshot = querySnapshot.docs[0];
            const priceCard = { id: docSnapshot.id, ...docSnapshot.data() };
            return priceCard;
        } else {
            console.log("Category not found");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving category:", error.message);
        throw new Error("Error retrieving category: " + error.message);
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



export const getCategoryIdBytimberType  = async (timberType) => {

    try {
        const q = query(
            collection(db, "priceCard"),
            where("timberType", "==", timberType),
        );

        const querySnapshot = await getDocs(q);
        console.log("querySnapshot empty:", querySnapshot.empty);

        if (!querySnapshot.empty) {
            const priceCardList = [];
            querySnapshot.forEach((doc) => {
                priceCardList.push({ id: doc.id, ...doc.data() });
            });
            return priceCardList;
        } else {
            console.log("No stockSummaryDetails found for the given parameters.");
            return null;
        }
    } catch (error) {
        console.error("Error getting stockSummaryDetails: ", error.message);
        throw error;
    }
};

