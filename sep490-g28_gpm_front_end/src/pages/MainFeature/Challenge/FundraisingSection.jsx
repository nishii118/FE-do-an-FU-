// import React from "react";
// import {
//   createAccountIcon,
//   CreateChallengeIcon,
//   DonateIcon,
//   ShareIcon,
// } from "../../../utils/icon";

// const FundraisingSection = () => {
//   return (
//     <div className="text-center py-12">
//       <div className="flex items-center gap-[28px]">
//         <hr className="flex-1 border-secondary" />
//         <span className="uppercase font-bold lg:text-5xl text-3xl text-gradient-1">
//           Đồng hành cùng với góp lẻ
//         </span>
//         <hr className="flex-1 border-secondary" />
//       </div>
//       <div className="flex justify-center gap-8 mt-8">
//         <div className="">
//           <FundraisingCard
//             icon={DonateIcon()}
//             title="Góp lẻ"
//             description="Góp lẻ, chỉ với từ 2000 đồng cho những dự án chúng tôi đang thực hiện."
//           />
//         </div>
//         <div className="">
//           <FundraisingCard
//             icon={createAccountIcon()}
//             title="Lập tài khoản"
//             description="Lập tài khoản và trở thành 1 đại sứ và đồng hành cùng Sức Mạnh 2000"
//           />
//         </div>
//         <div className="">
//           <FundraisingCard
//             icon={CreateChallengeIcon()}
//             title="Tạo thử thách"
//             description="Tạo một thử thách đồng hành cùng với bất kỳ dự án nào chúng tôi đang thực hiện."
//           />
//         </div>

//         <div className="">
//           <FundraisingCard
//             icon={ShareIcon()}
//             title="Chia sẻ thử thách"
//             description="Chia sẻ thử thách của bạn tới bạn bè, người thân và cộng đồng thông qua mạng xã hội. Đồng thời kêu gọi sự đồng hành lan tỏa."
//           />
//         </div>
//       </div>
//       {/* <button className="mt-10 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
//         Đăng ký ngay
//       </button> */}
//     </div>
//   );
// };

// const FundraisingCard = ({ icon, title, description }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 max-w-xs text-center h-[300px] w-[300px]">
//       <div className="text-5xl text-orange-500 mb-4 flex justify-center">
//         {icon}
//       </div>
//       <h3 className="text-xl font-semibold mb-2">{title}</h3>
//       <p className="text-gray-600 font-medium">{description}</p>
//     </div>
//   );
// };

// export default FundraisingSection;
import React from "react";
import {
  createAccountIcon,
  CreateChallengeIcon,
  DonateIcon,
  ShareIcon,
} from "../../../utils/icon";

const FundraisingSection = () => {
  return (
    <div className="text-center py-12 max-w-full overflow-hidden">
      <div className="flex items-center gap-[28px] flex-wrap">
        <hr className="flex-1 border-secondary" />
        <span className="uppercase font-bold lg:text-5xl text-3xl text-gradient-1">
          Đồng hành cùng với góp lẻ
        </span>
        <hr className="flex-1 border-secondary" />
      </div>
      <div className="flex flex-wrap justify-center gap-8 mt-8">
        <div className="">
          <FundraisingCard
            icon={DonateIcon()}
            title="Góp lẻ"
            description="Góp lẻ, chỉ với từ 2000 đồng cho những dự án chúng tôi đang thực hiện."
          />
        </div>
        <div className="">
          <FundraisingCard
            icon={createAccountIcon()}
            title="Lập tài khoản"
            description="Lập tài khoản và trở thành 1 đại sứ và đồng hành cùng Sức Mạnh 2000"
          />
        </div>
        <div className="">
          <FundraisingCard
            icon={CreateChallengeIcon()}
            title="Tạo thử thách"
            description="Tạo một thử thách đồng hành cùng với bất kỳ dự án nào chúng tôi đang thực hiện."
          />
        </div>

        <div className="">
          <FundraisingCard
            icon={ShareIcon()}
            title="Chia sẻ thử thách"
            description="Chia sẻ thử thách của bạn tới bạn bè, người thân và cộng đồng thông qua mạng xã hội. Đồng thời kêu gọi sự đồng hành lan tỏa."
          />
        </div>
      </div>
    </div>
  );
};

const FundraisingCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center h-[300px] w-full sm:w-[300px] max-w-xs">
      <div className="text-5xl text-orange-500 mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 font-medium">{description}</p>
    </div>
  );
};

export default FundraisingSection;
