import React from "react";

const AchievementItem = ({ value, description }) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center px-12 text-primary">
      <span className="text-5xl font-semibold">{value}</span>
      <p>{description}</p>
    </div>
  );
};

const Achievement = ({ data }) => {
  const { totalProject, totalDonation, countDonation, finished, ongoing } =
    data ?? {};
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  return (
    <div className="container m-auto py-12 flex flex-col gap-12 lg:px-0 px-4">
      <div className="text-center font-semibold lg:text-5xl text-3xl">
        <h3 className="text-gradient-1 leading-[120%] h-[72px]">
          Mỗi người 2.000 đồng/ngày
        </h3>
        <h3 className="text-[#4A4A4A]">
          Chúng tôi đã xây dựng trong năm {year}
        </h3>
      </div>
      <div className="flex lg:flex-row flex-col py-[30px] bg-[#FEFAF9] rounded-[16px] shadow-lg">
        <AchievementItem
          value={totalProject}
          description={`${finished} công trình hoàn thành, ${ongoing} đang thi công tính tới ${month}/${year}`}
          // description={totalDescription}
        />
        <hr className="bg-black my-2 lg:hidden block"></hr>
        <div className="h-[90%] w-[1px] bg-black"></div>
        <AchievementItem
          value={`${totalDonation}`}
          description={`Tổng số tiền quyên góp được từ đầu năm ${year} đến nay`}
        />
        <hr className="bg-black my-2 lg:hidden block"></hr>
        <div className="h-[90%] w-[1px] bg-black"></div>
        <AchievementItem
          value={countDonation}
          description="Tổng số lượt quyên góp Sức mạnh 2000 đã nhận từ các nhà hảo tâm"
        />
      </div>
    </div>
  );
};

export default Achievement;
