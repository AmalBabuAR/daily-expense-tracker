import React, { useState } from "react";
import IncomeImg from "../assets/income.svg";

import ExpenseImg from "../assets/expenses.svg";
import IncomeAndExpenseForm from "./IncomeAndExpenseForm";
import { useWalletContext } from "../context/walletContext";

const IncomeAndExpenseCard = ({ type }) => {
  const { wallet, expenseWallet, incomeWallet } = useWalletContext();

  const [incomeModel, setIncomeModel] = useState(false);
  const [expenseModel, setExpenseModel] = useState(false);

  const handleIncomClick = () => {
    setIncomeModel(true);
    setExpenseModel(false);
  };
  const handleExpenseClick = () => {
    if (wallet === 0) {
      alert("your have no income");
    } else {
      setExpenseModel(true);
      setIncomeModel(false);
    }
  };

  const onIncomeCloseClick = () => {
    setIncomeModel(false);
    setExpenseModel(false);
  };

  const onExpenseCloseClick = () => {
    setExpenseModel(false);
    setIncomeModel(false);
  };

  return (
    <>
      <section
        className={type === "income" ? "incomeSection" : "expenseSection"}
      >
        <div className="gap-3 sm:gap-3 md:gap-5 divCenter ">
          <img
            src={type === "income" ? IncomeImg : ExpenseImg}
            className="md:h-[80px] sm:h-[70px] sm:w-[70px] md:w-[80px]"
            alt=""
          />
          <div className="flex flex-col gap-1">
            <p className="text-[12px] md:text-[16px] sm:text-[14px] text-white text capitalize font-medium">
              {type}
            </p>
            <p className="text-[19px] md:text-[25px] sm:text-[21px] text-white font-semibold">
              ${type === "income" ? incomeWallet : expenseWallet}
            </p>
          </div>
        </div>
        {type === "income" ? (
          <button className="icomeButton" onClick={handleIncomClick}>
            + Add Income
          </button>
        ) : (
          <button className="expenseButton" onClick={handleExpenseClick}>
            + Add Expense
          </button>
        )}
      </section>
      {incomeModel && (
        <IncomeAndExpenseForm
          onCloseClick={onIncomeCloseClick}
          type={"income"}
        />
      )}
      {expenseModel && (
        <IncomeAndExpenseForm
          onCloseClick={onExpenseCloseClick}
          type={"expense"}
        />
      )}
    </>
  );
};

export default IncomeAndExpenseCard;
