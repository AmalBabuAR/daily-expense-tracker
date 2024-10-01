import React from "react";
import signImg from "../assets/signIn.svg";
import logInImg from "../assets/LoginBg.svg";
import SignInForm from "./SignInForm";
import LogInForm from "./LogInForm";

const LoginAndSigninBg = ({ type }) => {
  return (
    <main className="loginAndSigninBg">
      {type === "signUp" ? (
        <section className="signinSection divCenter ">
          <SignInForm />
          <img
            src={signImg}
            className="w-[50%] sm:w-[40%] lg:w-[50%] h-full  hidden sm:flex sm:justify-center sm:items-center"
            alt="SignIn"
          />
        </section>
      ) : (
        <section className="loginSection divCenter">
          <LogInForm />
          <img
            src={logInImg}
            alt="login"
            className="w-[50%] sm:w-[40%] lg:w-[50%] h-full  hidden sm:flex sm:justify-center sm:items-center"
          />
        </section>
      )}
    </main>
  );
};

export default LoginAndSigninBg;
