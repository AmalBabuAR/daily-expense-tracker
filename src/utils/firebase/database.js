import {
  setDoc,
  doc,
  Timestamp,
  serverTimestamp,
  query,
  where,
  getDocs,
  collection,
  addDoc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const creatDB = async (collection, document, data) => {
  try {
    const datas = { ...data, createdTime: serverTimestamp() };
    await setDoc(doc(db, collection, document), datas);
  } catch (err) {
    console.error(err);
  }
};

export const createIdDB = async (collectionName, data) => {
  try {
    const datas = { ...data, createdTime: serverTimestamp() };
    const result = await addDoc(collection(db, collectionName), datas);
  } catch (error) {
    console.error(error);
  }
};

export const queryDataFieldExist = async (
  collectionName,
  documentId,
  fieldName
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.hasOwnProperty(fieldName)) {
        // console.log(`Field "${fieldName}" exists in document ${documentId}.`);
        return true;
      } else {
        // console.log(
        //   `Field "${fieldName}" does NOT exist in document ${documentId}.`
        // );
        return false;
      }
    } else {
      // console.log(`Document "${documentId}" does not exist.`);
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

export const addFieldToDoc = async (collectionName, documentId, newField) => {
  const docRef = doc(db, collectionName, documentId);

  try {
    await updateDoc(docRef, newField);
    return { status: true };
  } catch (error) {
    console.error("Error adding field: ", error);
  }
};

export const queryDataExist = async (collectionName, checkData, enquiry) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(checkData, "==", enquiry)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // email is registered
      return false;
    } else {
      // email is not registered
      return true;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getAllData = async (
  collectionName,
  searchDataField,
  searchData
) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(searchDataField, "==", searchData)
    );
    const snapShort = await getDocs(q);
    const data = [];
    snapShort.forEach((doc) => {
      data.push({ id: doc.id, type: collectionName, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getAdata = async (collectionName, documentName) => {
  try {
    const docRef = doc(db, collectionName, documentName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { status: true, data: docSnap.data() };
    } else {
      return { staus: false };
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteData = async (collectionName, documentName) => {
  try {
    await deleteDoc(doc(db, collectionName, documentName));
    return { status: true };
  } catch (error) {
    console.error(error);
    alert("system error");
    return { status: false };
  }
};
