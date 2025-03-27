import { Avatar, Divider } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "./../../utils/formart";

const ProfileCard = ({ data }) => {
  const { fullname, code, totalDonation, totalChallenges, avatar, createdAt } =
    data ?? {};
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/user/" + code);
  };
  return (
    <div className=" w-[275px] mx-auto bg-white rounded-lg overflow-hidden border-2 shadow-lg">
      <div className="flex justify-center p-4">
        <hr />
        <Avatar src={avatar} sx={{ width: 120, height: 120 }}></Avatar>
      </div>
      <div className="text-center my-3">
        <h5 className="text-xl font-bold text-primary">{fullname}</h5>
      </div>
      <div className="text-center px-6 pb-6">
        <p className="text-gray-600">
          Số tiền kêu gọi được: <br />
          <span className="font-semibold">{totalDonation} VNĐ</span>
        </p>
        <p className="text-gray-600">
          Thử thách đồng hành:{" "}
          <span className="font-semibold">{totalChallenges}</span>
        </p>
        <p className="text-gray-600">
          Tham gia từ: <span className="font-semibold">{createdAt}</span>
        </p>
        {/* <div className="flex justify-center space-x-4 mt-4">
          {socialMedia.map((social, index) => (
            <a
              key={index}
              href={social.link}
              className="text-gray-500 hover:text-gray-800"
            >
              {social.icon}
            </a>
          ))}
        </div> */}
      </div>
      <div className="bg-gradient-to-r from-[#FBA34D] to-primary text-white text-center py-2">
        <button className="font-medium" onClick={handleClick}>
          Trang cá nhân
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
