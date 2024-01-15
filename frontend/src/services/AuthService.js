import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuth } from "../firebase/firebaseConfig";

export const signIn = async (payload) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      firebaseAuth,
      payload.email,
      payload.password
    );
    const user = userCredentials.user;
    console.log("Logged in with:", user.email);
    let userDetails = {
      accessToken: user.accessToken,
      displayName: user.displayName,
      email: user.email,
      uid: user.ss,
      refreshToken: user.refreshToken,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
    };
    return userDetails;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const signUp = async (payload) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      firebaseAuth,
      payload.email,
      payload.password
    );
    const user = userCredentials.user;
    console.log("Registered with:", user.email);
    return user;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const LogOut = async () => {
  try {
    const result = await signOut(firebaseAuth);
    console.log(result);
    return { isSuccess: true };
  } catch (error) {
    console.log(error);
    return { isSuccess: false, error };
  }
};
