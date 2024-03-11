import { getFirestore, collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";

const db = getFirestore();

// Insert new category for price Card List
export const createCategory = async(categoryData) => {
    try {
        const docRef = await addDoc(collection(db, "priceCard"), categoryData);
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


// Get CategoryId By timberType and area Parameters
export const getCategoryIdBytimberType = async (timberType, areaLength, areaWidth , thickness) => {
    try {
        const q = query(
            collection(db, "priceCard"),
            where("timberType", "==", timberType),
            where("areaLength", "==", areaLength),
            where("areaWidth", "==", areaWidth),
            where("thickness", "==", thickness),
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // If query returns a result, get the first document
            const docSnapshot = querySnapshot.docs[0];
            const stockSummaryDetails = { id: docSnapshot.id, ...docSnapshot.data() };
            return stockSummaryDetails;
        } else {
            console.log("No stockSummaryDetails found for timberType:", timberType);
            console.log("No stockSummaryDetails found for timberType:", areaLength);
            console.log("No stockSummaryDetails found for timberType:", areaWidth);
            return null;
        }
    } catch (error) {
        console.error("Error getting stockSummaryDetails: ", error.message);
        throw error;
    }
};
