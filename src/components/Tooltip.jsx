import React, { useState } from "react";

const Tooltip = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleTooltip = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
    {/* <div style={{ position: "relative", display: "inline-block" }} className="bg-red-300 lesson"> */}
      <div onClick={toggleTooltip} style={{ cursor: "pointer" }}>
        {children}
      </div>
      {isVisible && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(50%)",
            backgroundColor: "#333",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "14px",
            whiteSpace: "nowrap",
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {text}
        </div>
      )}
    {/* </div> */}
    </>
  );
};

export default Tooltip;
