import React from "react";
import Close from "../assets/close.svg";
import Loading from "./Loading";

const AiReportModal = ({ onCloseClick, report, open }) => {
  return (
    <div className="modelFormOverlayer modelFormOverlayerBg">
      <div className="aiModel">
        <div className="modelHead bg-primary">
          <h1 className="capitalize">AI report</h1>
          <button>
            <img src={Close} alt="close" onClick={() => onCloseClick(open)} />
          </button>
        </div>
        <div className="h-[60vh] overflow-y-scroll ">
          {report ? (
            <p className="p-10 text-[15px] tracking-wider leading-relaxed">
              {report}
            </p>
          ) : (
            <div className="divCenter h-full w-full">
              <Loading size={300} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiReportModal;
