import { getFirestore, collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";

const db = getFirestore();

// Insert new employeeDetails for price Card List
export const newEmployee = async(employeeDetailsData) => {
    console.log("employeeDetailsData", employeeDetailsData);
    try {
        const docRef = await addDoc(collection(db, "employeeDetails"), employeeDetailsData);
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
export const updateemployeeDetails = async (employeeDetailsId, employeeDetailsData ) => {
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
export const getemployeeDetailsById =  async (employeeDetailsId) => {
    try {
        const employeeDetailsRef = doc(db, "employeeDetails", employeeDetailsId);
        const employeeDetailsSnapshot = await getDoc(employeeDetailsRef);

        if (employeeDetailsSnapshot.exists()) {
            const employeeDetails = { id: employeeDetailsSnapshot.id, ...employeeDetailsSnapshot.data() };
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


