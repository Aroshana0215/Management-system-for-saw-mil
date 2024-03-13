import { getFirestore, collection, addDoc, getDocs, getDoc, updateDoc, doc } from "firebase/firestore";


const db = getFirestore();

// Insert new Inventory Details
export const NewInventory = async(InventoryData) => {
    try {
        const docRef = await addDoc(collection(db, "Inventory"), InventoryData);
        const InventoryDetailsSnapshot = await getDoc(docRef);

        if (InventoryDetailsSnapshot.exists()) {
            const newInventory = { id: InventoryDetailsSnapshot.id, ...InventoryDetailsSnapshot.data() };
            return newInventory;
        } else {
            console.log("load Details not found");
            return null;
        }
    } catch (error) {
        console.error("Error getting load Details: ", error.message);
        throw error;
    }
};

export const getAllInventoryDetails = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "Inventory"));
        const InventoryDetailList = [];
        querySnapshot.forEach((doc) => {
            InventoryDetailList.push({ id: doc.id, ...doc.data() });
        });
        return InventoryDetailList;
    } catch (error) {
        console.error("Error fetching Inventory Detail List: ", error.message);
        throw error;
    }
};

// Update Inventory Details
export const updateInventoryDetails = async (InventoryId, InventoryData ) => {
    try {
        const InventoryDetailsRef = doc(db, "Inventory", InventoryId);
        await updateDoc(InventoryDetailsRef, InventoryData);
        console.log("Inventory Details updated successfully");
    } catch (error) {
        console.error("Error updating Inventory Details: ", error.message);
        throw error;
    }
};

// Get One Inventory Details ID
export const getInventoryDetailsById =  async (InventoryId) => {
    try {
        const InventoryDetailsRef = doc(db, "Inventory", InventoryId);
        const InventoryDetailsSnapshot = await getDoc(InventoryDetailsRef);

        if (InventoryDetailsSnapshot.exists()) {
            const loadDetails = { id: InventoryDetailsSnapshot.id, ...InventoryDetailsSnapshot.data() };
            return loadDetails;
        } else {
            console.log("load Details not found");
            return null;
        }
    } catch (error) {
        console.error("Error getting load Details: ", error.message);
        throw error;
    }
};


