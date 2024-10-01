import React, { useEffect, useState } from "react";
import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/trash.svg";
import { useIncomeAndExpenseContext } from "../context/incomeAndExpenseContext";
import { useSortContext } from "../context/sortBtnContext";
import {
  filteredByMonth,
  filteredByToday,
  filteredByWeek,
} from "../utils/helpers/dateConverter";
import { deleteData } from "../utils/firebase/database";

const TransactionTable = () => {
  const { incomeDataList, expenseDataList, fetchData } =
    useIncomeAndExpenseContext();
  const { sortBtn } = useSortContext();

  const [list, setList] = useState([]);

  const sortData = () => {
    const combinedData = [...incomeDataList, ...expenseDataList];

    let filtered = [];
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBtn.today) {
      filtered = filteredByToday(combinedData);
    } else if (sortBtn.week) {
      filtered = filteredByWeek(combinedData);
      // console.log(filtered);
    } else if (sortBtn.month) {
      filtered = filteredByMonth(combinedData);
    } else {
      filtered = combinedData;
    }

    setList(filtered);
  };

  // const handleEdit = (data) => {};

  // const handleDelete = (data) => {
  //   const res = deleteData(data.type, data.id);
  //   if (res.status) {
  //     fetchData();
  //   }
  // };

  useEffect(() => {
    sortData();
  }, [incomeDataList, expenseDataList, sortBtn]);

  return (
    <div className="overflow-hidden">
      <table className="text-left w-full">
        <thead className="border-y-2">
          <tr className="text-left text-[13px] sm:text-[14px] md:text-[16px] ">
            <th className="w-[30%] py-[4px] sm:py-[7px] md:py-2 pl-5">
              Transactions
            </th>
            <th className="w-[20%]">Category</th>
            <th className="w-[20%]">Amount</th>
            <th className="w-[20%]">Date</th>
            {/* <th className="w-[10%]">Actions</th> */}
          </tr>
        </thead>
      </table>

      <div className="overflow-y-auto text-[13px] sm:text-[14px] md:text-[16px] max-h-[220px] sm:max-h-[500px] md:max-h-[350px] lg:max-h-[300px] xl:max-h-[300px] 2xl:max-h-[800px] scroll-smooth pb-[50px]">
        {list.length !== 0 ? (
          <table className="text-left w-full capitalize">
            <tbody>
              {list.map((transaction, index) => (
                <tr className="border-t" key={index}>
                  <td className="py-[4px] sm:py-[8px] md:py-[10px] pl-5 w-[30%]">
                    {transaction.type}
                  </td>
                  <td
                    className={`py-[4px] sm:py-[8px] md:py-[10px]  pl-[4px] w-[20%] `}
                  >
                    {transaction.category}
                  </td>
                  <td className={`py-[4px] sm:py-[8px] md:py-[10px] pl-[2px] w-[20%] ${
                      transaction.type === "income"
                        ? "text-green-600 "
                        : "text-red-600 "
                    }`}>
                    {transaction.type === "income" ? "+ " : "- "}$
                    {Math.floor(transaction.amount)}
                  </td>

                  <td className="py-[4px] sm:py-[8px] md:py-[10px] pl-[1px] w-[20%]">
                    {transaction.date}
                  </td>
                  {/* <td className="py-3 pl-[13px] w-[10%]">
                  <img
                    src={editIcon}
                    alt=""
                    className="float-start pr-2"
                    onClick={() => handleEdit(transaction)}
                  />
                  <img
                    src={deleteIcon}
                    alt=""
                    onClick={() => handleDelete(transaction)}
                  />
                </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : incomeDataList.length === 0 && expenseDataList.length === 0 ? (
          <div className="divCenter h-full w-full">
            <p className="font-bold mt-10">Add Amount to the Wallet </p>
          </div>
        ) : (
          <div className="divCenter h-full w-full">
            <p className="font-bold mt-10">No Transations Made Today </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
