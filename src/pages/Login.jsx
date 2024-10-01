import React, { useState } from "react";
import { useAuth } from "../context/authContext/index";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../utils/firebase/auth";
import { Navigate } from "react-router-dom";
import { creatDB } from "../utils/firebase/database";
import LoginAndSigninBg from "../components/LoginAndSigninBg";

const Login = () => {
  //   const { userLoggedIn, currentUser } = useAuth();
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [isSigningIn, setIsSigningIn] = useState(false);
  //   const [errorMessage, setErrorMessage] = useState("");

  //   const onSubmit = async (e) => {
  //     e.preventDefault();
  //     if (!isSigningIn) {
  //       setIsSigningIn(true);
  //       await doSignInWithEmailAndPassword(email, password);
  //     }
  //   };

  //   const onGoogleSignIn = async (e) => {
  //     e.preventDefault();
  //     if (!isSigningIn) {
  //       setIsSigningIn(true);
  //       try {
  //         const res = await doSignInWithGoogle();
  //         console.log("result", res);
  //         const data = {
  //           user: "testAmal",
  //           job: "developer",
  //           email: res.user.email,
  //         };
  //         const documentId = res?.user?.uid;
  //         await creatDB("user", documentId, data);
  //         console.log("currentUser", currentUser);
  //       } catch (error) {
  //         console.error("Sign-In Error:", error);
  //         setIsSigningIn(false);
  //       }
  //     }
  //   };

  return (
    <>
      <LoginAndSigninBg type="logIn" />
    </>
  );
};

export default Login;
