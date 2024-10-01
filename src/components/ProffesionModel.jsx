import React, { useState } from "react";
import { isEmpty } from "../utils/helpers/validation";
import { useAuth } from "../context/authContext";
import { addFieldToDoc } from "../utils/firebase/database";

const ProffesionModel = () => {
  const [error, setError] = useState("");
  const [profession, setProfession] = useState("");
  const { handelDataEmpty, currentUser } = useAuth();

  const handelInputChange = (e) => {
    const { value } = e.target;
    setProfession(value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEmpty(profession)) {
        return setError("Enter your profession");
      }
      const data = {
        profession: profession,
      };

      const res = await addFieldToDoc("user", currentUser.uid, data);
      if (res.status) {
        handelDataEmpty(false);
      }
    } catch (error) {
      console.error("error");
    }
  };

  return (
    <div className="modelFormOverlayer modelFormOverlayerBg">
      <div className="modal">
        <div className="modelHead bg-primary">
          <h1 className="capitalize">Profesion Form</h1>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="py-8 gap-4 border divCenter flex-col">
              <input
                type="text"
                name="profession"
                value={profession}
                onChange={handelInputChange}
                placeholder="Enter your profession to continue"
                className="modelInput "
              />
            </div>
            <div className="divCenter my-5 flex-col">
              {error && <p className="text-[11px] text-red-600">{error}</p>}
              <button
                type="submit"
                className="bg-primary w-[80%] py-3 rounded-xl text-white font-semibold "
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProffesionModel;
