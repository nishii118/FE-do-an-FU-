// import React, { useState, useEffect, useMemo, useRef } from "react";
// import {
//   Grid,
//   LinearProgress,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import { DONATION_QR_QUICKLINK } from "../../config";
// import { formatPrice } from "../../utils/formart";

// const generateTransferContent = (
//   code,
//   referCode,
//   challengeCode,
//   userCode,
//   description
// ) => {
//   let transferContent = code;
//   if (referCode) transferContent += ` ${referCode}`;
//   if (challengeCode) transferContent += ` ${challengeCode}`;
//   if (userCode) transferContent += ` ${userCode}`;
//   if (description) transferContent += ` ${description}`;
//   return transferContent;
// };

// const ProjectsDonationCard = ({ referCode, challengeCode, projects = [] }) => {
//   const [selectedProjectId, setSelectedProjectId] = useState(
//     projects ? projects[0]?.id : null
//   );
//   const [transferContent, setTransferContent] = useState("");
//   const [donationAmount, setDonationAmount] = useState("");
//   const [description, setDescription] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const debounceTimer = useRef(null);

//   useEffect(() => {
//     console.log("select", selectedProjectId);
//     console.log("projects", projects);
//     const userCode = localStorage.getItem("userCode");
//     const selectedProject =
//       projects.find((project) => project.id === selectedProjectId) || {};
//     setTransferContent(
//       generateTransferContent(
//         selectedProject.code,
//         referCode,
//         challengeCode,
//         userCode
//       )
//     );
//   }, [selectedProjectId, challengeCode, referCode, projects]);

//   const handleContentChange = (e) => {
//     const newDescription = e.target.value;
//     setDescription(newDescription);

//     if (debounceTimer.current) {
//       clearTimeout(debounceTimer.current);
//     }

//     debounceTimer.current = setTimeout(() => {
//       const userCode = localStorage.getItem("userCode");
//       const selectedProject =
//         projects.find((project) => project.id === selectedProjectId) || {};
//       if (newDescription.trim() === "") {
//         setTransferContent(
//           generateTransferContent(
//             selectedProject.code,
//             referCode,
//             challengeCode,
//             userCode,
//             newDescription
//           )
//         );
//       } else {
//         const userCode = localStorage.getItem("userCode");
//         setTransferContent(
//           generateTransferContent(
//             selectedProject.code,
//             referCode,
//             challengeCode,
//             userCode,
//             newDescription
//           )
//         );
//       }
//     }, 300);
//   };

//   const handleAmountChange = (e) => {
//     const numericValue = e.target.value.replace(/\D/g, "");
//     setDonationAmount(numericValue);
//     if (numericValue === "") {
//       setSuccessMessage("");
//     }
//   };

//   const handleProjectChange = (event) => {
//     setSelectedProjectId(event.target.value);
//   };

//   const selectedProject =
//     projects.find((project) => project.id === selectedProjectId) || {};
//   const { code, totalDonation, target } = selectedProject;

//   const qrCodeUrl = useMemo(() => {
//     const url = `${DONATION_QR_QUICKLINK}?amount=${donationAmount}&addInfo=${transferContent}`;
//     if ((donationAmount, description)) {
//       setSuccessMessage(
//         `Mã QR đã tạo thành công cho ${description} số tiền ${formatPrice(
//           donationAmount
//         )} VND.`
//       );
//     }
//     return url;
//   }, [donationAmount, transferContent]);

//   return (
//     <div className="bg-white p-4 rounded-2xl">
//       <Grid container justifyContent="space-between">
//         <Grid item xs={12} lg={6}>
//           <span className="font-medium text-sm">Chọn dự án quyên góp</span>
//           <FormControl fullWidth>
//             <Select
//               value={selectedProjectId}
//               defaultValue={projects[0]?.id}
//               onChange={handleProjectChange}
//               // label="Dự án"
//               size="small"
//               sx={{
//                 borderRadius: "8px",
//                 textAlign: "center",
//               }}
//             >
//               {projects.map((project) => (
//                 <MenuItem key={project.id} value={project.id}>
//                   {project.code} - {project.title}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <span className="font-medium text-sm">Nội dung chuyển khoản</span>
//           <div
//             className="border border-[#C07300] text-[#C07300] rounded-[6px] text-center mt-2"
//             aria-label="Nội dung chuyển khoản"
//           >
//             {challengeCode
//               ? `${challengeCode} - ${code} - SĐT - Tên bạn`
//               : `${referCode} - ${code} - SĐT - Tên bạn`}
//           </div>
//           <div className="flex items-center justify-center gap-2.5 px-3 py-[3px] border border-secondary rounded-[6px] mt-2">
//             <span className="font-bold text-sm text-blue-800">
//               MB Bank: 0348737721
//             </span>
//           </div>
//           <div className="mt-3 flex flex-col gap-2">
//             <span className="font-medium text-sm">
//               Mã QR cập nhập tự động theo số tiền
//             </span>
//             <input
//               type="text"
//               placeholder="SĐT - Tên"
//               value={description}
//               onChange={handleContentChange}
//               className="w-full py-[3px] px-4 border border-secondary text-sm rounded-[6px]"
//               aria-label="Description"
//             />
//             <input
//               type="text"
//               placeholder="Số tiền quyên góp (VND)"
//               value={formatPrice(donationAmount)}
//               onChange={handleAmountChange}
//               className="w-full py-[3px] px-4 border border-secondary text-sm rounded-[6px]"
//               aria-label="Donation Amount"
//             />
//           </div>
//           {successMessage && (
//             <div className="text-sm text-green-500 w-full font-medium text-center italic">
//               {successMessage}
//             </div>
//           )}
//         </Grid>
//         <Grid item lg={6}>
//           <img src={qrCodeUrl} alt="QR Code" />
//         </Grid>
//         <Grid item lg={12} className="w-full mt-3">
//           <div className="mt-4">
//             <hr />
//             <div className="flex flex-col items-center gap-[5px]">
//               <div className="flex items-center justify-between w-full">
//                 <span className="text-[10px] font-medium">Góp lẻ được</span>
//                 <span className="text-[10px] font-medium">Mục tiêu</span>
//               </div>
//               <div className="flex items-center justify-between gap-2 w-full">
//                 <span className="text-[14px] font-medium">
//                   {totalDonation > 0 ? formatPrice(totalDonation) : 0}
//                 </span>
//                 <div className="flex-1 flex justify-center">
//                   <LinearProgress
//                     variant="determinate"
//                     value={Math.min(
//                       (Number(totalDonation) / Number(target)) * 100,
//                       100
//                     )}
//                     sx={{
//                       width: "100%",
//                       maxWidth: "80%",
//                       height: "16px",
//                       borderRadius: 5,
//                       backgroundColor: "white",
//                       border: "1px solid #F32325",
//                       "& .MuiLinearProgress-bar": {
//                         borderRadius: 5,
//                         background: "#F26522",
//                       },
//                     }}
//                   />
//                 </div>
//                 <span className="text-[14px] font-medium">
//                   {formatPrice(target)}
//                 </span>
//               </div>
//             </div>
//             <hr />
//           </div>
//         </Grid>
//         <Grid item lg={12}>
//           <div className="italic text-center mt-2">
//             Sao kê sẽ được hiển thị sau mỗi 30s ở dưới trang này
//           </div>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default ProjectsDonationCard;

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Grid,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { DONATION_QR_QUICKLINK } from "../../config";
import { formatPrice } from "../../utils/formart";

const generateTransferContent = (
  code,
  referCode,
  challengeCode,
  userCode,
  description
) => {
  let transferContent = code;
  if (referCode) transferContent += ` ${referCode}`;
  if (challengeCode) transferContent += ` ${challengeCode}`;
  if (userCode) transferContent += ` ${userCode}`;
  if (description) transferContent += ` ${description}`;
  return transferContent;
};

const ProjectsDonationCard = ({ referCode, challengeCode, projects = [] }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(
    projects ? projects[0]?.id : null
  );
  const [transferContent, setTransferContent] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const debounceTimer = useRef(null);

  useEffect(() => {
    const userCode = localStorage.getItem("userCode");
    const selectedProject =
      projects.find((project) => project.id === selectedProjectId) || {};
    setTransferContent(
      generateTransferContent(
        selectedProject.code,
        referCode,
        challengeCode,
        userCode
      )
    );
  }, [selectedProjectId, challengeCode, referCode, projects]);

  const handleContentChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const userCode = localStorage.getItem("userCode");
      const selectedProject =
        projects.find((project) => project.id === selectedProjectId) || {};
      setTransferContent(
        generateTransferContent(
          selectedProject.code,
          referCode,
          challengeCode,
          userCode,
          newDescription
        )
      );
    }, 300);
  };

  const handleAmountChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setDonationAmount(numericValue);
    if (numericValue === "") {
      setSuccessMessage("");
    }
  };

  const handleProjectChange = (event) => {
    setSelectedProjectId(event.target.value);
  };

  const handlePresetAmountClick = (amount) => {
    setDonationAmount(amount.toString());
  };

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || {};
  const { code, totalDonation, target } = selectedProject;

  const qrCodeUrl = useMemo(() => {
    const url = `${DONATION_QR_QUICKLINK}?amount=${donationAmount}&addInfo=${transferContent}`;
    if ((donationAmount, description)) {
      setSuccessMessage(
        `Mã QR đã tạo thành công cho ${description} số tiền ${formatPrice(
          donationAmount
        )} VND.`
      );
    }
    return url;
  }, [donationAmount, transferContent]);

  return (
    <div className="bg-white p-4 rounded-2xl">
      <div>
        <p className="font-semibold text-xl text-center">
          Chỉ với 2000đ 1 ngày <br/>
          Tham gia thử thách cùng Sức mạnh 2000
        </p>
        <div className="flex justify-between mt-2 px-5">
          <button
            className="bg-primary text-white rounded-xl p-2 hover:cursor-pointer hover:bg-orange-500"
            variant="contained"
            onClick={() => handlePresetAmountClick(180000)}
          >
            3 tháng: 180.000
          </button>
          <button
            className="bg-primary text-white rounded-xl p-2 hover:cursor-pointer hover:bg-orange-500"
            variant="contained"
            onClick={() => handlePresetAmountClick(360000)}
          >
            6 tháng: 360.000
          </button>
          <button
            className="bg-primary text-white rounded-xl p-2 hover:cursor-pointer hover:bg-orange-500"
            onClick={() => handlePresetAmountClick(720000)}
          >
            1 năm: 720.000
          </button>
        </div>
        <div className="italic text-sm text-red-600 my-2">
          * Vui lòng sử dụng QR code phía dưới khi chuyển tiền để sao kê được
          chính xác và thực hiện ngay lập tức. QR sẽ được tự động sinh ra chính
          xác nội dung và số tiền ngay tức thì bạn nhập.
        </div>
      </div>
      <Grid container justifyContent="space-between">
        <Grid item lg={12}>
          <span className="font-medium text-sm">Chọn dự án quyên góp</span>
          <FormControl fullWidth>
            <Select
              value={selectedProjectId}
              defaultValue={projects[0]?.id}
              onChange={handleProjectChange}
              size="small"
              sx={{
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.code} - {project.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} lg={6}>
          <span className="font-medium text-sm">Nội dung chuyển khoản</span>
          <div
            className="border border-[#C07300] text-[#C07300] rounded-[6px] text-center mt-2"
            aria-label="Nội dung chuyển khoản"
          >
            {challengeCode
              ? `${challengeCode} - ${code} - SĐT - Tên bạn`
              : `${referCode} - ${code} - SĐT - Tên bạn`}
          </div>
          <div className="flex items-center justify-center gap-2.5 px-3 py-[3px] border border-secondary rounded-[6px] mt-2">
            <span className="font-bold text-sm text-blue-800">
              MB Bank: 0348737721
            </span>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <span className="font-medium text-sm">
              Mã QR cập nhập tự động theo nội dung bạn nhập
            </span>
            <input
              type="text"
              placeholder="SĐT - Tên"
              value={description}
              onChange={handleContentChange}
              className="w-full py-[3px] px-4 border border-secondary text-sm rounded-[6px]"
              aria-label="Description"
            />
            <input
              type="text"
              placeholder="Số tiền quyên góp (VNĐ)"
              value={formatPrice(donationAmount)}
              onChange={handleAmountChange}
              className="w-full py-[3px] px-4 border border-secondary text-sm rounded-[6px]"
              aria-label="Donation Amount"
            />
          </div>
          {successMessage && (
            <div className="text-sm text-green-500 w-full font-medium text-center italic">
              {successMessage}
            </div>
          )}
        </Grid>
        <Grid item lg={6}>
          <img src={qrCodeUrl} alt="QR Code" />
        </Grid>
        <Grid item lg={12} className="w-full mt-3">
          <div className="mt-4">
            <hr />
            <div className="flex flex-col items-center gap-[5px]">
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-medium">Góp lẻ được</span>
                <span className="text-[10px] font-medium">Mục tiêu</span>
              </div>
              <div className="flex items-center justify-between gap-2 w-full">
                <span className="text-[14px] font-medium">
                  {totalDonation > 0 ? formatPrice(totalDonation) : 0}
                </span>
                <div className="flex-1 flex justify-center">
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(
                      (Number(totalDonation) / Number(target)) * 100,
                      100
                    )}
                    sx={{
                      width: "100%",
                      maxWidth: "80%",
                      height: "16px",
                      borderRadius: 5,
                      backgroundColor: "white",
                      border: "1px solid #F32325",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 5,
                        background: "#F26522",
                      },
                    }}
                  />
                </div>
                <span className="text-[14px] font-medium">
                  {formatPrice(target)}
                </span>
              </div>
            </div>
            <hr />
          </div>
        </Grid>
        <Grid item lg={12}>
          <div className="italic text-center mt-2">
            Sao kê sẽ được hiển thị sau mỗi 30s ở dưới trang này
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProjectsDonationCard;
