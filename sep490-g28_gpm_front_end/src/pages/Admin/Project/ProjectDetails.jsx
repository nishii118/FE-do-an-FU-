import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { routes } from "../../../config";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import TrackingList from "../Tracking/TrackingList";
import SponsorList from "../Sponsor/SponsorList";
import ExpenseList from "../Expense/ExpenseList";
import MemberManage from "../Member/MemberManage";
import { ProjectProvider } from "../../../context/ProjectContext";
import BudgetList from "../Budget/BudgetList";
import ProjectInformation from "../../../components/Project/ProjectUpdate/ProjectInformation";
import useUserStore from "../../../store/useUserStore";
import { isProjectMember } from "../../../utils/auth";
import useProjectStore from "../../../store/useProjectStore";
import ProjectDonations from "../Donation/ProjectDonations";

const ProjectDetails = () => {
  const email = localStorage.getItem("email");
  const setIsMember = useProjectStore((state) => state.setIsMember);
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id, tab } = useParams();
  const location = useLocation();
  const tabQuery = searchParams.get("tab");
  const [tabIndex, setTabIndex] = useState(Number(tabQuery) ?? 0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    navigate(`${location.pathname}?tab=${newIndex}`);
  };

  useEffect(() => {
    const checkMembership = async () => {
      const isMember = await isProjectMember(email, id);
      console.log("email", email);
      console.log("isMember", isMember);
      setIsMember(isMember);
    };
    checkMembership();
  }, [email, id, setIsMember]);
  return (
    <ProjectProvider>
      <PageHeader
        breadcrumbs={[
          { title: "Dashboard", path: routes.admin },
          { title: "Danh sách dự án", path: routes.manageProject },
          { title: "Chi tiết dự án" },
        ]}
        pageTitle={"Chi tiết dự án"}
      >
        <Box className="w-full">
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="Thông tin dự án" className="flex-1" />
            <Tab label="Ngân sách" className="flex-1" />
            <Tab label="Tài trợ" className="flex-1" />
            <Tab label="Tiến độ" className="flex-1" />
            <Tab label="Chi phí" className="flex-1" />
            <Tab label="Sao kê" className="flex-1" />
            <Tab label="Thành viên" className="flex-1" />
          </Tabs>
          <Box sx={{ mt: 4 }}>
            {tabIndex === 0 && (
              <Box>
                <ProjectInformation id={id}></ProjectInformation>
              </Box>
            )}
            {tabIndex === 1 && (
              <Box>
                <BudgetList id={id}></BudgetList>
              </Box>
            )}
            {tabIndex === 2 && (
              <Box>
                <SponsorList id={id}></SponsorList>
              </Box>
            )}
            {tabIndex === 3 && (
              <Box>
                <TrackingList id={id}></TrackingList>
              </Box>
            )}
            {tabIndex === 4 && (
              <Box>
                <ExpenseList id={id}></ExpenseList>
              </Box>
            )}
            {tabIndex === 5 && (
              <Box>
                <ProjectDonations id={id} />
              </Box>
            )}
            {tabIndex === 6 && (
              <Box>
                <MemberManage id={id}></MemberManage>
              </Box>
            )}
          </Box>
        </Box>
      </PageHeader>
    </ProjectProvider>
  );
};

export default ProjectDetails;
