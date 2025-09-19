import React from "react";

const titulText = "Schedule Grid";
const saveText = "Save";

const Navbar = ({ handlePrev, handleNext, handleSave }) => {
  const Button = ({ handler, cn = "", children }) => (
    <button
      onClick={handler}
      type="button"
      className={`${cn} text-white active:bg-blue-300 font-bold bg-blue-300 hover:bg-blue-400 cursor-pointer rounded-sm text-sm px-4 py-2.5 text-center`}
    >
      {children}
    </button>
  );
  return (
      <div className="flex justify-between mb-2">
        <div>
          <Button handler={handlePrev}>&lt;</Button>
          <Button handler={handleSave} cn={"ml-2"}>{saveText}</Button>
        </div>
        <span className="font-bold flex items-center md:text-xl lg:text-2xl">{titulText}</span>
        <Button handler={handleNext}>&gt;</Button>
      </div>
  );
};

export default Navbar;
