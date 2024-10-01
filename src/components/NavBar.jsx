import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doSignOut } from "../utils/firebase/auth";
import logo from "../assets/logo.png";
import logoutIcon from "../assets/logout.svg";
import { useAuth } from "../context/authContext";
import { getAdata } from "../utils/firebase/database";

const NavBar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  // console.log("currentUser", currentUser);

  const [userImg, setUserImg] = useState("");
  const [userName, setUserName] = useState("");
  const [userLetter, setUserLetter] = useState("");
  const [userColor, setUserColor] = useState("");
  const [userFetchName, setUserFetchName] = useState("");

  function getInitials(name) {
    const nameParts = name.split(" "); // Split the name by space
    const initials = nameParts.map((part) => part.charAt(0).toUpperCase()); // Get first letters and capitalize them
    return initials.join(""); // Join the initials
  }

  // Predefined color palette
  const colors = {
    red: "#FD3C4A",
    blue: "#0077FF",
    green: "#00A86B",
    yellow: "#FCAC12",
    purple: "#9B59B6",
    orange: "#91919F",
    pink: "#FF69B4",
    teal: "#1ABC9C",
    gray: "#95A5A6",
  };

  // Function to randomly select a color
  function getRandomColor() {
    const colorNames = Object.keys(colors); // Get all color names
    const randomIndex = Math.floor(Math.random() * colorNames.length); // Randomly select an index
    const selectedColor = colors[colorNames[randomIndex]]; // Get the color from the palette
    return selectedColor;
  }

  async function fetchName() {
    try {
      const fetch = await getAdata("user", currentUser?.uid);

      if (fetch.status) {
        const name = fetch?.data?.userName;
        const initials = getInitials(name);
        const randomColor = getRandomColor();
        setUserLetter(initials);
        setUserColor(randomColor);
        setUserFetchName(name);
      }
    } catch (error) {
      console.error("error", error);
    }
  }

  useEffect(() => {
    // console.log("currentUser", currentUser);

    if (currentUser !== null) {
      // console.log("currentUser");

      fetchName();
    } else if (currentUser) {
      setUserName(currentUser.displayName);
      setUserImg(currentUser.photoURL);
    }
  }, []);

  return (
    <nav className="h-[8vh] sm:h-[8vh] md:h-[10vh] w-full flex justify-between items-center px-[3vw] sm:px-[4vw] md:px-[7vw] overflow-y-hidden overflow-hidden overflow-x-hidden">
      <div>
        <img
          src={logo}
          alt=""
          className="w-[140px] sm:w-[200px] h-[34px] sm:h-[45px] md:w-[270px] md:h-[60px] "
        />
      </div>
      <div className="divCenter gap-2 sm:gap-6">
        <div className="divCenter gap-1  sm:gap-3">
          <p className="font-bold text-[11px] sm:text-[17px] md:text-[20px] sm:tracking-wider">
            {userName ? userName : userFetchName}
          </p>
          <div
            className={`w-[38px] sm:w-[44px]  md:w-[50px] h-[38px] sm:h-[44px]  md:h-[50px]  divCenter rounded-full sm:rounded-xl border-2 border-primary`}
            style={{
              backgroundColor: userColor ? userColor : "white",
            }}
          >
            {userImg ? (
              <img
                src={userImg}
                className="w-full h-full rounded-full sm:rounded-xl"
                alt=""
              />
            ) : (
              <p
                className={`rounded-full sm:rounded-xl text-white text-[15px] sm:text-[22px] font-bold`}
              >
                {userLetter}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            doSignOut().then(() => {
              navigate("/login");
            });
          }}
          className="bg-[#FFE2E4] w-[38px] sm:w-[44px] h-[38px] sm:h-[44px] md:w-[50px] md:h-[50px] divCenter rounded-full sm:rounded-xl"
        >
          <img src={logoutIcon} alt="" className="p-[6px] sm:p-0" />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
