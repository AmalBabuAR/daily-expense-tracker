import React, { useState, useEffect } from "react";
import Close from "../assets/close.svg";
import {
  checkingDate,
  getCurrentDateTime,
} from "../utils/helpers/dateConverter";
import {
  expenseCategoryOptions,
  incomeCategoryOptions,
} from "../utils/helpers/data";
import { useAuth } from "../context/authContext";
import { createIdDB } from "../utils/firebase/database";
import { useWalletContext } from "../context/walletContext";
import { isEmpty, isNumNeg } from "../utils/helpers/validation";
import { useIncomeAndExpenseContext } from "../context/incomeAndExpenseContext";
import { useSortContext } from "../context/sortBtnContext";
import Loading from "./Loading";

const IncomeAndExpenseForm = ({ onCloseClick, type }) => {
  const { currentUser } = useAuth();
  const { handleWallet } = useWalletContext();
  const { fetchData } = useIncomeAndExpenseContext();
  const { sortBtnHandle } = useSortContext();

  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [incomeCategory, setIncomeCategory] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [dateError, setDateError] = useState("");
  const [error, setError] = useState("");

  // Handle form field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount") setAmount(value);
    if (name === "date") setDate(value);
    if (name === "category") {
      if (type === "income") {
        setIncomeCategory(value);
      } else {
        setExpenseCategory(value);
      }
    }
  };
  function validation(category, date, amount) {
    let flag = 0;

    setCategoryError("");
    setDateError("");
    setAmountError("");
    setError("");

    if (isEmpty(category)) {
      setCategoryError("Enter the Category");
      flag++;
    }
    if (isEmpty(date)) {
      setDateError("Enter the Date");
      flag++;
    }
    if (isEmpty(amount)) {
      setAmountError("Enter the amount");
      flag++;
    }
    if (isNumNeg(amount)) {
      setAmountError("Enter positive amount");
      flag++;
    }
    if (amount == 0) {
      setAmountError("Enter number is zero");
      flag++;
    }

    if (flag === 0) {
      return true;
    } else {
      // console.log("flag", flag);
      return false;
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        validation(
          type === "income" ? incomeCategory : expenseCategory,
          date,
          amount
        )
      ) {
        setLoading(true);
        const documentId = currentUser.uid;
        const amtStrConvert = parseFloat(amount);
        const amtFixConvert = amtStrConvert.toFixed(2);
        const data = {
          uid: documentId,
          type: type,
          category: type === "income" ? incomeCategory : expenseCategory,
          amount: amtFixConvert,
          date: date,
        };
        if (type === "income") {
          await createIdDB("income", data);
          await handleWallet("income", amtFixConvert);
        } else {
          await createIdDB("expense", data);
          await handleWallet("expense", amtFixConvert);
        }
        onCloseClick();
        fetchData();
        const checkDate = checkingDate(date);
        sortBtnHandle(checkDate);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("system Error");
      setLoading(false);
    }
  };

  // Set the current date and time when the component first mounts
  useEffect(() => {
    setDate(getCurrentDateTime());
  }, []);
  return (
    <div className="modelFormOverlayer modelFormOverlayerBg">
      <div className="modal">
        <div
          className={`modelHead ${
            type === "income" ? "bg-secondaryGreen" : "bg-secondaryRed"
          }`}
        >
          <h1 className="capitalize">{type} Entery</h1>
          <button onClick={onCloseClick}>
            <img src={Close} alt="close" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="py-8 gap-4 border divCenter flex-col">
            <select
              className="modelInput"
              name="category"
              value={type === "income" ? incomeCategory : expenseCategory}
              onChange={handleInputChange}
            >
              <option value={""} disabled>
                Choose your Category
              </option>
              {type === "income"
                ? Object.keys(incomeCategoryOptions).map((key) => (
                    <option key={key} value={key}>
                      {incomeCategoryOptions[key]}
                    </option>
                  ))
                : Object.keys(expenseCategoryOptions).map((key) => (
                    <option key={key} value={key}>
                      {expenseCategoryOptions[key]}
                    </option>
                  ))}
            </select>
            {categoryError && (
              <p className="text-[11px] text-red-600">{categoryError}</p>
            )}
            <input
              type="number"
              name="amount"
              value={amount}
              placeholder="Enter your amount"
              className="modelInput "
              onChange={handleInputChange}
            />
            {amountError && (
              <p className="text-[11px] text-red-600">{amountError}</p>
            )}
            <input
              type="datetime-local"
              className="modelInput "
              name="date"
              value={date}
              onChange={handleInputChange}
            />
            {dateError && (
              <p className="text-[11px] text-red-600">{dateError}</p>
            )}
          </div>
          <div className="divCenter my-5 flex-col">
            {error && <p className="text-[11px] text-red-600">{error}</p>}
            <button
              disabled={loading ? true : false}
              type="submit"
              className="bg-primary w-[80%] py-3 rounded-xl text-white font-semibold divCenter gap-1"
            >
              {loading ? (
                <>
                  <Loading color="white" size={25} />
                  Loading...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeAndExpenseForm;
