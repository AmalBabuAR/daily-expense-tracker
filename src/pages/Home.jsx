import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import aiIcon from "../assets/ai.svg";
import NavBar from "../components/NavBar";
import IncomeAndExpenseCard from "../components/IncomeAndExpenseCard";
import SortButton from "../components/SortButton";
import TransactionTable from "../components/TransactionTable";
import { useWalletContext } from "../context/walletContext";
import WalletCard from "../components/WalletCard";
import { useIncomeAndExpenseContext } from "../context/incomeAndExpenseContext";
import { generateAIReport } from "../utils/aiIntegration/gemeniAI";
import AiReportModal from "../components/AiReportModal";
import ProffesionModel from "../components/ProffesionModel";

const Home = () => {
  const { userLoggedIn, dataEmpty } = useAuth();
  // console.log("userLoggedIn", userLoggedIn);

  const { incomeDataList, expenseDataList } = useIncomeAndExpenseContext();

  const [aiReport, setAiReport] = useState("");
  const [aiModel, setAiModel] = useState(false);

  const handleAiReport = async () => {
    setAiModel(true);
    const response = await generateAIReport(incomeDataList, expenseDataList);
    setAiReport(response);
  };

  const onAiCloseClick = (res) => {
    setAiModel(!res);
  };

  return (
    <>
      {!userLoggedIn && <Navigate to={"/login"} replace={true} />}
      {dataEmpty && <ProffesionModel />}
      <NavBar />
      <div className="sm:mt-[4px] md:mt-[2vh] px-[3vw] sm:mx-[4vw] md:mx-[7vw] overflow-y-hidden overflow-hidden overflow-x-hidden">
        <main className="gap-[12px] sm:gap-[23px] md:gap-[2vw] lg:gap-[5vw] mt-3 sm:mt-1 md:mt-0 md:h-[28vh] flex flex-col sm:flex-row justify-between items-center">
          <WalletCard />
          <div className="flex justify-between  items-center sm:justify-center gap-3 sm:gap-[20px] md:gap-[2vw] lg:gap-[3vw] xl:gap-[4vw] 2xl:gap-[3vw] ">
            <IncomeAndExpenseCard type="income" />
            <IncomeAndExpenseCard type="expenses" />
          </div>
        </main>
        <div className=" mt-[3vh] h-[51vh]  sm:h-[63.8vh] md:h-[58vh] rounded-2xl sm:rounded-3xl border-solid border-[3px] overflow-hidden">
          <div className="flex flex-wrap justify-between items-center gap-[10px] p-3 sm:p-3 md:py-5 md:px-5">
            <h1 className="text-[15px] sm:text-[17px] md:text-[20px] font-bold">
              Recent Transaction
            </h1>

            <button
              className="divCenter gap-1 bg-primary text-white font-bold px-[10px] sm:px-[10px] md:px-3 py-[5px] sm:py-[6px] md:py-2 rounded-3xl hover:bg-primaryHover text-[13px] sm:text-[12px] md:text-[16px]"
              onClick={() => handleAiReport()}
            >
              <img src={aiIcon} alt="" />
              <p className="">AI Report</p>
            </button>

            <SortButton />
          </div>
          <TransactionTable />
        </div>
      </div>
      {aiModel && (
        <AiReportModal
          onCloseClick={onAiCloseClick}
          report={aiReport}
          open={aiModel}
        />
      )}
    </>
  );
};

export default Home;
