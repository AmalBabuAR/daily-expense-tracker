import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../utils/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { queryDataFieldExist } from "../../utils/firebase/database";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [dataEmpty, setDataEmpty] = useState(false);
  const [loading, setLoading] = useState(true);

  const handelDataEmpty = (res) => {
    setDataEmpty(res);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    // console.log("user in context", user);

    if (user) {
      const checkFiled = await queryDataFieldExist(
        "user",
        user?.uid,
        "profession"
      );
      if (!checkFiled) {
        setDataEmpty(true);
        setCurrentUser({ ...user });
        setUserLoggedIn(true);
      }
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  const value = {
    currentUser,
    userLoggedIn,
    dataEmpty,
    handelDataEmpty,
    loading,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
