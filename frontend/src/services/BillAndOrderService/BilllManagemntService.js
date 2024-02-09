import { getFirestore, collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";

const db = getFirestore();

// Insert new billDetails for price Card List
export const createbillDetails = async(billDetailsData) => {
    try {
        const docRef = await addDoc(collection(db, "billDetails"), billDetailsData);
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
        console.error("Error fetching price Card List: ", error.message);
        throw error;
    }
};

// Update billDetails
export const updatebillDetails = async (billDetailsId, billDetailsData ) => {
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
export const getbillDetailsById =  async (billDetailsId) => {
    try {
        const billDetailsRef = doc(db, "billDetails", billDetailsId);
        const billDetailsSnapshot = await getDoc(billDetailsRef);

        if (billDetailsSnapshot.exists()) {
            const billDetails = { id: billDetailsSnapshot.id, ...billDetailsSnapshot.data() };
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

// Get billDetailsId By timberType and area Parameters
export const getbillDetailsIdBytimberType = async (timberType , areaLength , areaWidth) => {
    try {
        const q = query(collection(db, "billDetails"), where("timberType", "==", timberType, "and",  "areaLength", "==", areaLength, "areaWidth", "==", areaWidth));
        const querySnapshot = await getDocs(q);

        const billDetailsList = [];
        querySnapshot.forEach((doc) => {
            billDetailsList.push({ id: doc.id, ...doc.data() });
        });

        return billDetailsList;
    } catch (error) {
        console.error("Error getting Load Related Timber Details: ", error.message);
        throw error;
    }
};
