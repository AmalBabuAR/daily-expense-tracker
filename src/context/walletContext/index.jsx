import React, { createContext, useContext, useEffect, useState } from "react";
import { creatDB, getAdata } from "../../utils/firebase/database";
import { useAuth } from "../authContext";
import { isNumNeg } from "../../utils/helpers/validation";

const WalletContext = createContext();

export function useWalletContext() {
  return useContext(WalletContext);
}

export const WalletProvider = ({ children }) => {
  const { currentUser, userLoggedIn } = useAuth();
  const [wallet, setWallet] = useState(0);
  const [incomeWallet, setIncomeWallet] = useState(0);
  const [expenseWallet, setExpenseWallet] = useState(0);

  let userId = 0;

  if (userLoggedIn) {
    userId = currentUser.uid;
  }

  const fetchAmountFromWallet = async () => {
    try {
      const walletRes = await getAdata("wallet", userId);
      const incomeRes = await getAdata("incomeWallet", userId);
      const expenseRes = await getAdata("expenseWallet", userId);

      if (walletRes?.status) {
        setWallet(walletRes.data.amount);
      } else {
        setWallet(0);
      }

      if (incomeRes?.status) {
        setIncomeWallet(incomeRes.data.amount);
      } else {
        setIncomeWallet(0);
      }

      if (expenseRes?.status) {
        setExpenseWallet(expenseRes.data.amount);
      } else {
        setExpenseWallet(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleWallet = async (type, amount) => {
    const enteredAmt = parseFloat(amount);
    if (type === "income") {
      let walletAddAmt = wallet + enteredAmt;
      let incomeAddAmt = incomeWallet + enteredAmt;

      const walletData = {
        uid: userId,
        amount: parseFloat(walletAddAmt.toFixed(2)),
      };

      const incomeData = {
        uid: userId,
        amount: parseFloat(incomeAddAmt.toFixed(2)),
      };
      await creatDB("wallet", userId, walletData);
      await creatDB("incomeWallet", userId, incomeData);
    } else {
      let walletSubAmt = wallet - enteredAmt;
      let expenseAddAmt = expenseWallet + enteredAmt;
      if (isNumNeg(walletSubAmt)) {
        alert("Low Balance");
      } else {
        const walletData = {
          uid: userId,
          amount: parseFloat(walletSubAmt.toFixed(2)),
        };
        const expenseData = {
          uid: userId,
          amount: parseFloat(expenseAddAmt.toFixed(2)),
        };
        await creatDB("wallet", userId, walletData);
        await creatDB("expenseWallet", userId, expenseData);
      }
    }
    fetchAmountFromWallet();
  };

  useEffect(() => {
    fetchAmountFromWallet();
  }, []);

  const value = {
    wallet,
    incomeWallet,
    expenseWallet,
    handleWallet,
  };
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
