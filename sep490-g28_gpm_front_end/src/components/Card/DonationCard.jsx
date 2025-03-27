import React, { useState, useEffect, useRef, useMemo } from "react";
import { Grid, LinearProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { DONATION_QR_QUICKLINK } from "../../config";
import { formatPrice } from "../../utils/formart";

const generateTransferContent = (
  code,
  challengeCode,
  userCode,
  description
) => {
  let transferContent = code;
  if (challengeCode) transferContent += ` ${challengeCode}`;
  if (userCode) transferContent += ` ${userCode}`;
  if (description) transferContent += ` ${description}`;
  return transferContent;
};

const DonationCard = React.memo(({ data, challengeCode }) => {
  const { code, title, totalDonation, target, id, slug } = data ?? {};
  const [transferContent, setTransferContent] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const debounceTimer = useRef(null);

  useEffect(() => {
    const userCode = localStorage.getItem("userCode");
    setTransferContent(generateTransferContent(code, challengeCode, userCode));
  }, [code, challengeCode]);

  const handleContentChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDescription(newDescription);
      if (newDescription.trim() === "") {
        setTransferContent(
          generateTransferContent(
            code,
            challengeCode,
            localStorage.getItem("userCode"),
            ""
          )
        );
        setSuccessMessage("");
      } else {
        const userCode = localStorage.getItem("userCode");
        setTransferContent(
          generateTransferContent(code, challengeCode, userCode, newDescription)
        );
      }
    }, 500);
  };

  const handleAmountChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setDonationAmount(numericValue);
    if (numericValue === "") {
      setSuccessMessage("");
    }
  };

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
    <div className="bg-white p-6 rounded-2xl">
      <Grid container justifyContent="space-between">
        <div className="w-full">
          <Link to={`/du-an/${slug}`}>
            <div className="text-lg font-bold hover:underline w-full">
              {code} - {title}
            </div>
          </Link>
          <div className="italic text-sm text-red-600 ">
            * Vui lòng sử dụng QR code phía dưới khi chuyển tiền để sao kê được
            chính xác và thực hiện ngay lập tức. QR sẽ được tự động sinh ra
            chính xác nội dung và số tiền ngay tức thì bạn nhập.
          </div>
        </div>
        <Grid item xs={12} lg={6}>
          <div className="font-medium text-sm mt-4">Nội dung chuyển khoản</div>
          <div
            className="border border-[#C07300] text-[#C07300] rounded-[6px] text-center mt-2"
            aria-label="Nội dung chuyển khoản"
          >
            {`${code} - SĐT - Tên bạn`}
          </div>
          <div className="flex items-center justify-center gap-2.5 px-3 py-[3px] border border-secondary rounded-[6px] mt-2">
            <span className="font-bold text-sm text-blue-800">
              MB Bank: 0348737721
            </span>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <span className="font-medium text-sm">
              Hoặc hãy nhập thông tin và quét mã QR
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
              placeholder="Số tiền quyên góp (VND)"
              value={formatPrice(donationAmount)}
              onChange={handleAmountChange}
              className="w-full py-[3px] px-4 border border-secondary text-sm rounded-[6px]"
              aria-label="Donation Amount"
            />
            {successMessage && (
              <div className="text-sm text-green-500 w-full font-medium text-center italic">
                {successMessage}
              </div>
            )}
          </div>
        </Grid>
        <Grid item lg={6}>
          <img src={qrCodeUrl} alt="QR Code" />
        </Grid>
        <Grid item lg={12} className="w-full">
          <div>
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
      </Grid>
    </div>
  );
});

export default DonationCard;
