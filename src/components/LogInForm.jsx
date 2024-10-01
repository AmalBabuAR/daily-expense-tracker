import React, { useState } from "react";
import googleIcon from "../assets/googleIcons.svg";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../utils/firebase/auth";
import { isEmail, isEmpty, isLength } from "../utils/helpers/validation";
import { creatDB, queryDataExist } from "../utils/firebase/database";
import Loading from "./Loading";

const LogInForm = () => {
  const { userLoggedIn, currentUser } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    switch (name) {
      case "email":
        if (value) setEmailError("");
        break;

      case "password":
        if (value) setPasswordError("");
        break;

      default:
        break;
    }
    setErrorMessage("");
  };

  const validation = (email, password) => {
    let flag = 0;
    setPasswordError("");
    setEmailError("");
    setErrorMessage("");

    if (isEmpty(email)) {
      setEmailError("Please enter your Email");
      flag++;
    }
    if (isEmpty(password)) {
      setPasswordError("Please enter your password");
      flag++;
    }
    if (!isEmail(email)) {
      setEmailError("Please enter a valid email");
      flag++;
    }
    if (isLength(password)) {
      setPasswordError("Password must be at least 6 characters long");
      flag++;
    }

    if (flag === 0) {
      return true;
    } else {
      // console.log("flag", flag);
      flag = 0;
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      if (validation(formData.email, formData.password)) {
        const res = await doSignInWithEmailAndPassword(
          formData.email,
          formData.password
        );
      }
      setLoginLoading(false);
    } catch (error) {
      console.error("error", error);
      if (error.code === "auth/invalid-credential") {
        setErrorMessage("Invalid User");
      } else {
        setErrorMessage("An error occurred during Login. Please try again.");
      }
      setLoginLoading(false);
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    setGoogleLoading(true);
    try {
      const res = await doSignInWithGoogle();
      const check = await queryDataExist("user", "email", res?.user?.email);
      if (check) {
        const documentId = res?.user?.uid;
        const data = {
          uid: documentId,
          userName: res?.user?.displayName,
          email: res?.user?.email,
          password: null,
        };
        await creatDB("user", documentId, data);
      }
      setGoogleLoading(false);
      // console.log("currentUser check in login", check);
    } catch (error) {
      console.error("Sign-In Error:", error);
      setGoogleLoading(false);
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/"} replace={true} />}
      <div className="flex flex-col items-center justify-center w-[100%] sm:w-[60%] lg:w-[50%] h-full gap-4">
        <h1 className="text-4xl font-bold">Login</h1>
        {errorMessage && (
          <p className="text-[11px] text-red-600">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-[70%] sm:w-[60%]">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="formInput"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <p className="text-[11px] text-red-600">{emailError}</p>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="formInput"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <p className="text-[11px] text-red-600">{passwordError}</p>
          </div>

         
          <button className="signBtn" type="submit">
            {loginLoading ? (
              <>
                <Loading color={"white"} size={30} /> Loging...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-sm">
          Don't have an account? &nbsp;
          <span
            className="text-blue-700 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>{" "}
        </p>
        <div className="flex items-center justify-center w-[50%] gap-2">
          <hr className="w-full border-2 border-solid" />
          <p>OR</p>
          <hr className="w-full border-2 border-solid" />
        </div>

        <button className="googleBtn" onClick={onGoogleSignIn}>
          {googleLoading ? (
            <>
              <Loading />
              <p>Loging...</p>
            </>
          ) : (
            <>
              <img src={googleIcon} alt="googleIcon" />
              <p className="text-[12px] sm:text-[16px] md:text[16px]">Login with Google</p>
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default LogInForm;
