import React, { useEffect, useRef, useState } from "react";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { routes } from "../../../config";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchChallengeDetailService,
  fetchListDonatationsChallengeService,
} from "../../../services/ChallengeService";
import { convertFireBaseImage, convertImage } from "../../../utils/populate";
import {
  formatDate,
  formatDateTime,
  formatPrice,
} from "../../../utils/formart";
import { toast } from "react-toastify";
import ProjectsDonationCard from "../../../components/Card/ProjectsDonationCard";
import { Avatar, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import ChallengeDonation from "../../MainFeature/Challenge/ChallengeDonation";
import { ArrowForward, Search } from "@mui/icons-material";
import DonationTable from "../../../components/Table/DonationTable";

const AdminChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const [statements, setStatements] = useState([]);
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
  const fetchChallengeDetail = async () => {
    setLoading(true);
    await fetchChallengeDetailService(id)
      .then((response) => {
        const convertChallenge = {
          ...response,
          avatar: convertFireBaseImage(response.created_by?.avatar ?? null),
          id: response.challenge_id,
          challengeCode: response.challenge_code,
          finishedAt: response.finished_at,
          createdAt: formatDate(response.created_at),
          createdBy: response.created_by,
          totalDonation: formatPrice(response.total_donation ?? 0),
          goal: formatPrice(response.goal),
          projects: response.projects?.map((project) => ({
            ...project,
            id: project.project_id,
            title: project.title,
            target: project.amount_needed_to_raise,
          })),
        };
        // console.log(convertChallenge);
        setChallenge(convertChallenge);
        setProjects(convertChallenge.projects);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Đã xảy ra lỗi khi tải dữ liệu thử thách");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchChallengeDetail();
  }, [id]);

  const fetchDonation = async (params) => {
    try {
      const response = await fetchListDonatationsChallengeService(id, params);
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
        slug:
          statement?.transferred_project &&
          statement?.transferred_project?.slug,
      }));
      setTotal(response.total);
      setStatements(statements);
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi khi tải dữ liệu ");
    }
  };

  useEffect(() => {
    fetchDonation(params); // Fetch initially
  }, [params, id]);

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
      width: 250,
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
      width: 200,
      headerClassName: "bg-[F5F5F5] text-[848895]",
      renderCell: (params) => {
        const handleClick = () => {
          navigate(`/du-an/${params.row.slug}`);
        };

        return params.value ? (
          <div
            className="flex items-center text-green-600 hover:underline"
            onClick={handleClick}
          >
            <ArrowForward />
            <div className="ml-2">{params.value}</div>
          </div>
        ) : null;
      },
    },
    {
      field: "note",
      headerName: "Ghi chú",
      width: 200,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
  ];

  return (
    <PageHeader
      breadcrumbs={[
        { id: 1, title: "Dashboard", path: routes.admin },
        {
          id: 2,
          title: "Danh sách thử thách",
          path: routes.adminChallengeList,
        },
        { id: 3, title: "Chi tiết thử thách", path: routes.adminChallengeList },
      ]}
      pageTitle={challenge?.title}
    >
      <div className="w-full">
        <Grid
          container
          className="container m-auto"
          justifyContent="space-between"
          alignItems="stretch"
        >
          <Grid item lg={12} container>
            <div className="overflow-hidden w-full border rounded-lg">
              <Grid item xs={12} lg={12} container className="bg-[#FFFAF7] p-4">
                <Grid container gap={2} item xs={12} lg={6}>
                  <Grid item xs={3} lg={3}>
                    <div className="flex items-center h-full">
                      <Avatar
                        alt={challenge?.createdBy?.fullname}
                        src={challenge?.avatar}
                        sx={{ width: 64, height: 64, margin: "auto" }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={8} lg={8}>
                    <p className="my-1">Người tạo thử thách</p>
                    <p className="my-1 text-xl font-semibold">
                      {challenge?.createdBy?.fullname}
                    </p>
                    <p className="my-1">Ngày bắt đầu: {challenge?.createdAt}</p>
                  </Grid>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <div className="mt-4 flex justify-between gap-4">
                    <div className="bg-[#FFE8D7] rounded-2xl p-4 w-1/2 text-center">
                      <Typography variant="body2" color="textSecondary">
                        Số tiền đạt được
                      </Typography>
                      <p className="font-semibold text-primary">
                        {challenge?.totalDonation} VND
                      </p>
                    </div>
                    <div className="bg-[#FFE8D7] rounded-2xl p-4 w-1/2 text-center">
                      <Typography variant="body2" color="textSecondary">
                        Mục tiêu thử thách
                      </Typography>
                      <p className="font-semibold text-primary">
                        {challenge?.goal} VND
                      </p>
                    </div>
                  </div>
                </Grid>
                {/* </div> */}
              </Grid>
              <Grid item lg={12}>
                <div className="p-4">
                  <Typography variant="h6">{challenge?.content}</Typography>
                </div>
              </Grid>
            </div>
          </Grid>
          <Grid item lg={12}>
            <div className="p-4 mt-3">
              <div className="font-semibold text-xl mb-3">
                Danh sách dự án đồng hành
              </div>
              {projects?.map((project, index) => (
                <div
                  className="text-[18px] hover:underline py-1"
                  onClick={() =>
                    navigate(`/admin/manage-project/${project.project_id}`)
                  }
                >
                  {index + 1}. {project.title}
                </div>
              ))}
            </div>
          </Grid>
        </Grid>

        <div className="flex items-center gap-[28px] mt-6">
          <hr className="flex-1" />
          <span className="uppercase font-bold text-2xl">Sao kê thử thách</span>
          <hr className="flex-1" />
        </div>
        <div className="py-[30px]">
          <div className="flex flex-col gap-4 shadow-xl border rounded-lg">
            <div className="p-4">
              <Grid container justifyContent={"flex-start"} className="mb-3">
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
    </PageHeader>
  );
};

export default AdminChallengeDetail;
