import React, { useState } from "react";
import { useSortContext } from "../context/sortBtnContext";

const SortButton = () => {
  const { sortBtn, sortBtnHandle } = useSortContext();

  return (
    <>
      <div className="sm:inline-flex shadow-sm rounded-3xl " role="group">
        <button
          type="button"
          className={sortBtn.today ? "sortBtnClicked" : "sortBtn"}
          onClick={() => sortBtnHandle("today")}
        >
          Today
        </button>

        <button
          type="button"
          className={sortBtn.week ? "sortBtnClicked" : "sortBtn"}
          onClick={() => sortBtnHandle("week")}
        >
          Week
        </button>

        <button
          type="button"
          className={sortBtn.month ? "sortBtnClicked" : "sortBtn"}
          onClick={() => sortBtnHandle("month")}
        >
          Month
        </button>
      </div>
    </>
  );
};

export default SortButton;
