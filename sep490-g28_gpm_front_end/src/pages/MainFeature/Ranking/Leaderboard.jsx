import React, { useEffect, useState } from "react";
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { BronzeMedal, GoldMedal, SilverMedal } from "../../../utils/icon";
import { useNavigate } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";

import { toast } from "react-toastify";
import { convertFireBaseImage } from "../../../utils/populate";
import { formatPrice } from "./../../../utils/formart";
import { routes } from "../../../config";
import { fetchTopAmbassadorsService } from "../../../services/AmbassadorsService";

export default function Leaderboard() {
  const [ambassadors, setAmbasssadors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const top = 10;

  const fetchTopAmbassadors = async () => {
    setLoading(true);
    try {
      const data = await fetchTopAmbassadorsService(top);
      const convertData = data.map((item, index) => ({
        ...item,
        rank: index + 1,
        avatar: item.avatar ? convertFireBaseImage(item.avatar) : null,
      }));
      setAmbasssadors(convertData);
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi tải dữ liệu đại sứ!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopAmbassadors();
  }, []);

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <GoldMedal />;
      case 2:
        return <SilverMedal />;
      case 3:
        return <BronzeMedal />;
      default:
        return null;
    }
  };

  const handleClickUser = (code) => {
    navigate("/user/" + code);
  };

  const handleForward = () => {
    navigate(`/dai-su`);
  };

  return (
    <div>
      <div className="bg-[#FEFAF9] lg:py-[45px] py-[20px] lg:px-0 px-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between gap-2">
          <div className="lg:text-3xl text-xl text-primary">
            <h3 className="font-bold uppercase ">
              TOP 10 ĐẠI SỨ ĐỒNG HÀNH CÙNG SỨC MẠNH 2000
            </h3>
          </div>
          <button
            className="border border-primary text-primary fill-primary bg-white px-6 lg:py-[10px] flex gap-2 items-center rounded-xl font-semibold"
            onClick={handleForward}
          >
            <span>Xem thêm</span>
            <ArrowForward />
          </button>
        </div>
      </div>

      <div className="container flex flex-col items-center py-10 mx-auto">
        <TableContainer component={Paper}>
          <Table>
            <TableHead
              sx={{
                backgroundImage: "linear-gradient(to right, #FBA34D, #FF5F6D)", // Change this to your desired color
                "& .MuiTableCell-root": {
                  color: "#ffffff", // Change this to your desired text color
                  fontWeight: "bold", // Optional: Bold text
                  userSelect: "none", // Disable text selection
                  pointerEvents: "none", // Disable mouse events
                },
              }}
            >
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Đại sứ</TableCell>
                <TableCell align="center">Số tiền kêu gọi được</TableCell>
                <TableCell align="center">Số lượt quyên góp kêu gọi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ambassadors?.map((ambassadors, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="">
                      {getMedalIcon(ambassadors?.rank) || (
                        <span className="ml-5">{ambassadors?.rank}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar src={ambassadors?.avatar ?? null}>
                        {ambassadors?.fullname?.charAt(0)}
                      </Avatar>
                      <span
                        onClick={() => handleClickUser(ambassadors?.code)}
                        className="hover:underline hover:cursor-pointer"
                      >
                        {ambassadors?.fullname}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    {formatPrice(ambassadors?.totalDonation)} VNĐ
                  </TableCell>
                  <TableCell align="center">
                    {ambassadors?.countDonations}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
