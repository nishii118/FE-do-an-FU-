import React from "react";
import HomeLogo from "../../assets/images/home-logo.png";
import {
  EmailOutlined,
  HomeOutlined,
  LanguageOutlined,
  LocalPhoneOutlined,
} from "@mui/icons-material";

const FOOTER_DETAIL = {
  address: {
    title: "Địa chỉ",
    icon: HomeOutlined,
    value: "P702 - 62 Bà Triệu - Hà Nội",
  },
  hotline: {
    title: "Hotline",
    icon: LocalPhoneOutlined,
    value: "0975302307",
  },
  email: {
    title: "Email",
    icon: EmailOutlined,
    value: "niemtingroup@gmail.com",
  },
  // website: {
  //   title: "Website",
  //   icon: LanguageOutlined,
  //   value: "P702 - 62 Bà Triệu - Hà Nội",
  // },
};

const DefaultFooter = () => {
  return (
    <>
      <div className="bg-[#FFD7CB] py-10 lg:px-0 px-4">
        <div className="container mx-auto flex lg:flex-row flex-col lg:gap-0 gap-4 items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold lg:text-2xl text-xl">
              DỰ ÁN SỨC MẠNH 2000 - ÁNH SÁNG NÚI RỪNG
            </h3>
            <ul className="lg:mt-8 mt-4">
              {Object.entries(FOOTER_DETAIL).map(([key, detail]) => {
                const Icon = detail.icon;
                return (
                  <li key={key} className="flex items-center gap-2 py-2">
                    <Icon />
                    <span>{detail.title}:</span>
                    <span>{detail.value}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="max-w-[500px] w-full">
            <iframe
              title="facebook-link"
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fsucmanh2000&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId"
              width="500"
              height="500"
              className="border-none overflow-hidden md:w-500 w-full"
              frameborder="0"
              allowfullscreen="true"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex items-center justify-between px-2 py-2 gap-3">
        <div className="h-[33px]">
          <img src={HomeLogo} alt="" className="w-full h-full object-contain" />
        </div>
        <p>Copyright © 2024 - All rights reserved by NuoiEm.</p>
      </div>
    </>
  );
};

export default DefaultFooter;
