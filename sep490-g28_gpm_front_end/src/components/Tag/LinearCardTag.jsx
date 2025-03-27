import React from "react";

const LinearCardTag = ({ imgUrl, label }) => {
  return (
    <div className="uppercase flex items-center gap-2.5 px-[22px] py-3 border-l-2 border-primary bg-gradient-3">
      {imgUrl && <img src={imgUrl} alt="" width={20} height={26} />}
      <span className="text-primary text-sm uppercase font-bold">{label}</span>
    </div>
  );
};

export default LinearCardTag;
