import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const db = getFirestore();

// Insert new Load Details
export const NewLoad = async (loadData) => {
  try {
    const dataWithTimestamp = {
      ...loadData,
      createdDate: serverTimestamp(),
    };
    const docRef = await addDoc(
      collection(db, "relatedPermitDetails"),
      dataWithTimestamp
    );
    console.log(
      "New Load Details entered into the system with ID: ",
      docRef.id
    );
    return docRef.id;
  } catch (error) {
    console.error("Error Entering New Load Details: ", error.message);
    throw error;
  }
};

export const getAllLoadDetails = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "relatedPermitDetails"));
    const LoadDetailList = [];
    querySnapshot.forEach((doc) => {
      LoadDetailList.push({ id: doc.id, ...doc.data() });
    });
    return LoadDetailList;
  } catch (error) {
    console.error("Error fetching Load Detail List: ", error.message);
    throw error;
  }
};

// Update Load Details
export const updateLoadDetails = async (loadId, loadData) => {
  try {
    const LoadDetailsRef = doc(db, "relatedPermitDetails", loadId);
    await updateDoc(LoadDetailsRef, loadData);
    console.log("Load Details updated successfully");
  } catch (error) {
    console.error("Error updating Load Details: ", error.message);
    throw error;
  }
};

// Get One Load Details ID
export const getLoadDetailsById = async (loadId) => {
  try {
    const LoadDetailsRef = doc(db, "relatedPermitDetails", loadId);
    const LoadDetailsSnapshot = await getDoc(LoadDetailsRef);

    if (LoadDetailsSnapshot.exists()) {
      const loadDetails = {
        id: LoadDetailsSnapshot.id,
        ...LoadDetailsSnapshot.data(),
      };
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
