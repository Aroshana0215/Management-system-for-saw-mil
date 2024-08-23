import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

const db = getFirestore();

export const newDailyDetail = async (employeeDailyDetailsData) => {
  console.log("employeeDailyDetailsData:",employeeDailyDetailsData);
  try {
    // Check if a record with the same dateTime, eid_fk, and status=A exists
    const querySnapshot = await getDocs(
      query(
        collection(db, "employeeDailyDetails"),
        where("dateTime", "==", employeeDailyDetailsData.dateTime),
        where("eid_fk", "==", employeeDailyDetailsData.eid_fk),
        where("status", "==", "A")
      )
    );

    if (!querySnapshot.empty) {
      throw new Error("Cannot enter duplicate record for the same day.");
    }

    // If no duplicate record found, proceed with adding the new record
    const docRef = await addDoc(
      collection(db, "employeeDailyDetails"),
      employeeDailyDetailsData
    );
    console.log(
      "New employeeDailyDetails entered into the system with ID: ",
      docRef.id
    );
    return docRef.id;
  } catch (error) {
    console.error("Error Entering New employeeDailyDetails: ", error.message);
    throw error;
  }
};

export const getEmployeeWorkedDetail = async (formData) => {
  console.log(formData);
  try {
    const q = query(
      collection(db, "employeeDailyDetails"),
      where("eid_fk", "==", formData.eid),
      where("status", "==", "A"),
      where("dateTime", ">=", formData.fromDate),
      where("dateTime", "<=", formData.toDate)
    );

    const querySnapshot = await getDocs(q);
    const employeeWorkList = [];

    querySnapshot.forEach((docSnapshot) => {
      const employeePaySheet = { id: docSnapshot.id, ...docSnapshot.data() };
      employeeWorkList.push(employeePaySheet);
    });

    return employeeWorkList;
  } catch (error) {
    console.error("Error getting employeeWorkList: ", error.message);
    throw error;
  }
};

export const getAllemployeeDailyDetails = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "employeeDailyDetails"));
    const employeeDailyDetailsList = [];
    querySnapshot.forEach((doc) => {
      employeeDailyDetailsList.push({ id: doc.id, ...doc.data() });
    });
    return employeeDailyDetailsList;
  } catch (error) {
    console.error("Error fetching  employeeDailyDetails List: ", error.message);
    throw error;
  }
};

// Update employeeDailyDetails
export const updateemployeeDailyDetails = async (
  employeeDailyDetailsId,
  employeeDailyDetailsData
) => {
  try {
    const employeeDailyDetailsRef = doc(
      db,
      "employeeDailyDetails",
      employeeDailyDetailsId
    );
    await updateDoc(employeeDailyDetailsRef, employeeDailyDetailsData);
    console.log("Price Card employeeDailyDetails updated successfully");
  } catch (error) {
    console.error(
      "Error updating Price Card employeeDailyDetails: ",
      error.message
    );
    throw error;
  }
};

// Get One employeeDailyDetails by ID
export const getemployeeDailyDetailsById = async (employeeDailyDetailsId) => {
  try {
    const employeeDailyDetailsRef = doc(
      db,
      "employeeDailyDetails",
      employeeDailyDetailsId
    );
    const employeeDailyDetailsSnapshot = await getDoc(employeeDailyDetailsRef);

    if (employeeDailyDetailsSnapshot.exists()) {
      const employeeDailyDetails = {
        id: employeeDailyDetailsSnapshot.id,
        ...employeeDailyDetailsSnapshot.data(),
      };
      return employeeDailyDetails;
    } else {
      console.log("employeeDailyDetails not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting employeeDailyDetails: ", error.message);
    throw error;
  }
};
