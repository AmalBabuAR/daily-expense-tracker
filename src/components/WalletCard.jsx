import React from "react";
import walletImg from "../assets/wallet.svg";
import { useWalletContext } from "../context/walletContext";

const WalletCard = () => {
  const { wallet } = useWalletContext();
  return (
    <section className="bg-secondaryBlue divCenter py-3 sm:py-5 px-6 sm:px-7 md:px-7 lg:px-10 gap-3 sm:gap-5 md:gap-6 rounded-[30px] sm:rounded-[30px] md:rounded-[40px] flex-col">
      <div className="gap-3 sm:gap-3 md:gap-5 divCenter">
        <img
          src={walletImg}
          alt=""
          className="md:h-[80px] sm:h-[70px] sm:w-[70px] md:w-[80px]"
        />
        <div className="text-white flex flex-col  sm:gap-1">
          <p className="text-[14px] md:text-[16px] sm:text-[14px] text-white text capitalize font-medium">
            Account Balance
          </p>
          <p className="text-[20px] md:text-[25px] sm:text-[21px] text-white font-semibold">${wallet}</p>
        </div>
      </div>
      <div className="flex justify-between w-full items-center text-white text-[12px] sm:text-[14px] md:text-[16px]">
        <p>**** **** **** **00</p>
        <p>00/00</p>
      </div>
    </section>
  );
};

export default WalletCard;
