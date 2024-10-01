import React, { useState } from "react";
import googleIcon from "../assets/googleIcons.svg";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
  doSignOut,
} from "../utils/firebase/auth";
import { isEmail, isEmpty, isLength } from "../utils/helpers/validation";
import { creatDB, queryDataExist } from "../utils/firebase/database";
import Loading from "./Loading";

const SignInForm = () => {
  const { userLoggedIn, currentUser } = useAuth();

  const [formData, setFormData] = useState({
    userName: "",
    profession: "",
    email: "",
    password: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [googleBtnClick, setGoogleBtnClicl] = useState(false);

  const [signinLoading, setSigninLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");
  const [userError, setUserError] = useState("");
  const [professionError, setProfessionError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors based on the input value
    switch (name) {
      case "userName":
        if (value) setUserError("");
        break;

      case "profession":
        if (value) setProfessionError("");
        break;

      case "email":
        if (value) setEmailError("");
        break;

      case "password":
        if (value) setPasswordError("");
        break;

      default:
        break;
    }
  };

  const validation = (userName, profession, email, password) => {
    let flag = 0;
    setUserError("");
    setProfessionError("");
    setPasswordError("");
    setEmailError("");

    if (isEmpty(userName)) {
      setUserError("Please enter your username");
      flag++;
    }
    if (isEmpty(profession)) {
      setProfessionError("Please enter your Profession");
      flag++;
    }
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
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userName, profession, email, password } = formData;
    setError("");
    try {
      // validation
      if (validation(userName, profession, email, password)) {
        setSigninLoading(true);
        const res = await doCreateUserWithEmailAndPassword(email, password);
        const documentId = res?.user?.uid;
        const data = {
          uid: documentId,
          userName: userName,
          profession: profession,
          email: email,
          password: password,
        };
        await creatDB("user", documentId, data);
      }
      setSigninLoading(false);
    } catch (error) {
      console.error("Sign-In Error:", error);
      if (error.code === "auth/email-already-in-use") {
        setError(
          "This email is already registered. Please log in or use another email."
        );
      } else {
        setError("An error occurred during sign-up. Please try again.");
      }
      setFormData({
        userName: "",
        profession: "",
        email: "",
        password: "",
      });
      setSigninLoading(false);
    }
  };

  // google sign in
  const googleBtnSubmit = () => {
    if (!googleBtnClick) {
      setGoogleBtnClicl(true);
    }
  };

  const googleSignupSubmit = async (e) => {
    e.preventDefault();
    const { profession } = formData;

    if (isEmpty(profession)) {
      return setProfessionError("Please enter your Profession");
    }
    setGoogleLoading(true);

    // request
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        const res = await doSignInWithGoogle();
        // console.log("result", res);

        const check = await queryDataExist("user", "email", res?.user?.email);
        if (check) {
          const documentId = res?.user?.uid;
          const data = {
            uid: documentId,
            userName: res?.user?.displayName,
            profession: profession,
            email: res?.user?.email,
            password: null,
          };
          await creatDB("user", documentId, data);
        } else {
          setError(
            "This email is already registered. Please log in or use another email."
          );
        }
        setGoogleLoading(false);
      } catch (error) {
        console.error("Sign-In Error:", error);
        setIsRegistering(false);
        setGoogleLoading(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/"} replace={true} />}
      <div className="flex flex-col items-center justify-centerw-[100%] sm:w-[60%] lg:w-[50%]h-full gap-4">
        <h1
          className="text-4xl font-bold cursor-pointer"
          onClick={() => setGoogleBtnClicl(false)}
        >
          Sign Up
        </h1>
        {error && <p className="text-[11px] text-red-600">{error}</p>}
        {googleBtnClick ? (
          <div className="w-[100%] sm:w-[60%] mt-16 mb-8 form-group">
            <label htmlFor="profession">Profession</label>
            <input
              type="text"
              name="profession"
              placeholder="Enter your profession"
              className="formInput"
              value={formData.profession}
              onChange={handleChange}
            />
            <p className="text-[11px] text-red-600">{professionError}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-[100%] sm:w-[60%]">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                name="userName"
                placeholder="Enter your full name"
                className="formInput"
                value={formData.userName}
                onChange={handleChange}
                required
              />
              <p className="text-[11px] text-red-600">{userError}</p>
            </div>
            <div className="form-group">
              <label htmlFor="profession">Profession</label>
              <input
                type="text"
                name="profession"
                placeholder="Enter your profession"
                className="formInput"
                value={formData.profession}
                onChange={handleChange}
                required
              />
              <p className="text-[11px] text-red-600">{professionError}</p>
            </div>
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
              {signinLoading ? (
                <>
                  <Loading color={"white"} size={30} /> Loading...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        )}

        {!googleBtnClick && (
          <>
            <p className="text-sm">
              Already have an account? &nbsp;
              <span
                className="text-blue-700 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>{" "}
            </p>
            <div className="flex items-center justify-center w-[50%] gap-2">
              <hr className="w-full border-2 border-solid" />
              <p>OR</p>
              <hr className="w-full border-2 border-solid" />
            </div>
          </>
        )}

        <button
          className="googleBtn !w-[100%] sm:!w-[60%]"
          onClick={googleBtnClick ? googleSignupSubmit : googleBtnSubmit}
        >
          {googleLoading ? <Loading /> : <img src={googleIcon} alt="" />}
          <p className="text-[12px] sm:text-[16px] md:text[16px]">
            {googleBtnClick
              ? googleLoading
                ? "Loading..."
                : "Continue with Google"
              : "Sign Up with Google"}
          </p>
        </button>
      </div>
    </>
  );
};

export default SignInForm;
