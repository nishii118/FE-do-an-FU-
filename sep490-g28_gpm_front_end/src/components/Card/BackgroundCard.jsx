import React from "react";

const VARIANT = {
  primary: "primary-gradient",
  secondary: "secondary-gradient",
};

const BackgroundCard = ({ title, variant, className }) => {
  return (
    <div className={`${VARIANT[variant]} py-[45px] ${className ?? ""}`}>
      <div className="container mx-auto flex items-center justify-between">
        <h3 className="lg:text-3xl text-xl text-white font-medium px-3">{title}</h3>
      </div>
    </div>
  );
};

export default BackgroundCard;
