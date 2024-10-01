import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../authContext";
// import { useSortContext } from "../sortBtnContext";
import { getAllData } from "../../utils/firebase/database";

const IncomeAndExpenseContext = createContext();

export function useIncomeAndExpenseContext() {
  return useContext(IncomeAndExpenseContext);
}

export const IncomeAndExpenseProvider = ({ children }) => {
  const { currentUser, userLoggedIn } = useAuth();
  //   const { sortBtn } = useSortContext();

  const [incomeDataList, setIncomeDataList] = useState([]);
  const [expenseDataList, setExpenseDataList] = useState([]);

  let userId = 0;
  if (userLoggedIn) {
    userId = currentUser.uid;
  }

  const fetchData = async () => {
    try {
      // console.log("called fetch");
      const incomeData = await getAllData("income", "uid", userId);
      const expenseData = await getAllData("expense", "uid", userId);
      setIncomeDataList(incomeData);
      setExpenseDataList(expenseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (userLoggedIn) {
    useEffect(() => {
      fetchData();
    }, []);
  }

  const value = {
    incomeDataList,
    expenseDataList,
    fetchData,
  };

  return (
    <IncomeAndExpenseContext.Provider value={value}>
      {children}
    </IncomeAndExpenseContext.Provider>
  );
};
