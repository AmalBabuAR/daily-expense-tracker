import React, { createContext, useContext, useState } from "react";

const SortBtnContext = createContext();

export function useSortContext() {
  return useContext(SortBtnContext);
}

export const SortProvider = ({ children }) => {
  const [sortBtn, setSortBtn] = useState({
    today: true,
    week: false,
    month: false,
  });

  const sortBtnHandle = (button) => {
    setSortBtn({
      today: button === "today",
      week: button === "week",
      month: button === "month",
    });

    // switch (button) {
    //   case "today":
    //     handleToday();
    //     break;
    //   case "week":
    //     handleWeek();
    //     break;
    //   case "month":
    //     handleMonth();
    //     break;
    //   case "year":
    //     handleYear();
    //     break;
    //   default:
    //     break;
    // }
  };
  const value = {
    sortBtn,
    sortBtnHandle,
  };
  return (
    <SortBtnContext.Provider value={value}>{children}</SortBtnContext.Provider>
  );
};
