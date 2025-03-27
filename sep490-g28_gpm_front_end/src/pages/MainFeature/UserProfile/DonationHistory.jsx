import React, { useEffect, useRef, useState } from "react";
import UserBanner from "../../../assets/images/user-banner.jpg";
import { Avatar, Grid, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { convertFireBaseImage } from "./../../../utils/populate";

import { formatDateTime, formatPrice } from "../../../utils/formart";

import {
  fetchDonatationsHistoryService,
  fetchUserProfileService,
} from "../../../services/ProfileService";
import { routes } from "../../../config";
import DonationTable from "../../../components/Table/DonationTable";
import { Search } from "@mui/icons-material";

const ProfileAction = ({ profile }) => {
  return (
    <div className="w-full lg:w-[300px] mb-[30px]">
      <div className="absolute -top-[150px] lg:-top-[90px] w-full lg:w-[300px] flex items-center justify-center">
        <Avatar
          sx={{ width: 200, height: 200 }}
          alt={profile?.fullname}
          src={convertFireBaseImage(profile?.avatar)}
        />
      </div>
    </div>
  );
};

const DonationHistory = () => {
  const navigate = useNavigate();
  const [userCode, setUserCode] = useState(localStorage.getItem("userCode"));
  const [profile, setProfile] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const [statements, setStatements] = useState([]);
  const [totalDonation, setTotalDonation] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [params, setParams] = useState({
    size: paginationModel.pageSize,
    page: paginationModel.page,
    description: null,
  });

  const fetchUserProfileData = async () => {
    setLoading(true);
    try {
      const data = await fetchUserProfileService(userCode);
      const profile = {
        ...data,
        referCode: data.refer_code,
        donationCount: data.donated_count,
        totalDonation: data.total_donated ?? 0,
        totalRefer: data.total_donation_refer ?? 0,
      };
      setLoading(false);
      setProfile(profile);
    } catch (error) {
      setLoading(false);
      if (error?.response?.data?.error?.code === "1011") {
        navigate(routes.notFound);
        toast.warn("Trang không tồn tại");
      } else {
        toast.error("Đã xảy ra lỗi khi tải dữ liệu người dùng!");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDonation = async (params) => {
    try {
      const response = await fetchDonatationsHistoryService(params);
      const statements = response?.content.map((statement) => ({
        ...statement,
        note: statement.note,
        id: statement.donation_id,
        value: formatPrice(statement.value),
        bankReceived: statement.bank_sub_acc_id,
        date: formatDateTime(statement.created_at),
        project: statement.project?.title,
        transferredProject:
          statement?.transferred_project &&
          statement?.transferred_project?.code +
            `-` +
            statement?.transferred_project?.title,
      }));
      setTotalDonation(response?.summary?.total_donation_by_refer ?? 0);
      setTotal(response.total);
      setStatements(statements);
    } catch (error) {
      console.error(error);
      if (error?.response?.data?.error?.code === "1011") {
        navigate(routes.notFound);
        // toast.warn("Trang không tồn tại");
      } else {
        toast.error("Đã xảy ra lỗi khi tải dữ liệu quyên góp!");
      }
    }
  };

  useEffect(() => {
    const code = localStorage.getItem("userCode");
    setUserCode(code);
    if (!code) {
      navigate(routes.notFound);
    } else {
      fetchUserProfileData();
      fetchDonation(params);
    }
  }, []);

  const handlePageChange = (newModel) => {
    setPaginationModel(newModel);
    setParams((prev) => ({
      ...prev,
      size: newModel.pageSize,
      page: newModel.page,
    }));
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, description: value }));
    }, 500);
  };

  const columns = [
    {
      field: "bankReceived",
      headerName: "Tài khoản nhận",
      width: 100,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "date",
      headerName: "Ngày",
      width: 150,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "value",
      headerName: "Số tiền",
      width: 200,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "description",
      headerName: "Nội dung CK",
      width: 200,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "project",
      headerName: "Dự án đích",
      width: 200,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "transferredProject",
      headerName: "Tiền dư được chuyển tới",
      width: 150,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "note",
      headerName: "Ghi chú",
      width: 150,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
  ];

  return (
    <div>
      <div className="w-full h-[300px]">
        <img src={UserBanner} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="container mx-auto px-4 lg:px-0 lg:py-10">
        <div className="relative flex lg:flex-row flex-col gap-10">
          <ProfileAction profile={profile} />
          <div className="flex-1">
            <Grid container>
              <Grid item xs={12} lg={6}>
                <h3 className="lg:text-5xl text-4xl font-bold leading-tight lg:text-left text-center">
                  {profile?.fullname}
                </h3>
              </Grid>
              <Grid item xs={12} lg={5}>
                <div className="flex justify-between items-center lg:mt-0 mt-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {formatPrice(profile?.totalDonation)} VND
                    </div>
                    <div className="text-sm text-gray-600">
                      Số tiền quyên góp
                    </div>
                  </div>
                  <div className="h-12 border-l border-gray-300"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {formatPrice(profile?.donationCount)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Số lượt quyên góp
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>

            <p className="mt-5 lg:text-left text-center">
              Tiền lẻ của bạn có thể góp sức xây thêm hàng nghìn điểm trường để
              thắp sáng ước mơ học tập nơi vùng sâu núi cao, chấm dứt tình trạng
              phải dạy và học trong căn nhà sập xệ, dột nát
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto mb-[75px] mt-5">
        <div className="">
          <div className="flex items-center gap-[28px]">
            <hr className="flex-1 border-secondary" />
            <span className="uppercase font-bold lg:text-3xl text-2xl text-[#EF8C7F]">
              Lịch sử quyên góp
            </span>
            <hr className="flex-1 border-secondary" />
          </div>
          <div className="flex flex-col gap-4 shadow-xl border rounded-lg w-full mt-5">
            <div className="p-4">
              <Grid container justifyContent="space-between" className="mb-3">
                <Grid item lg={4} xs={12}>
                  <TextField
                    placeholder="Nội dung chuyển khoản..."
                    size="small"
                    value={search}
                    onChange={handleSearchChange}
                    InputProps={{
                      endAdornment: <Search />,
                    }}
                    fullWidth
                    className="bg-white"
                  />
                </Grid>
              </Grid>

              <DonationTable
                rows={statements}
                rowCount={total}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
