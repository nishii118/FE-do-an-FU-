import React, { useEffect, useState } from "react";
import { Box, Step, StepLabel, Stepper } from "@mui/material";
import { routes } from "../../../config";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { ProjectProvider } from "../../../context/ProjectContext";
import ProjectInformation from "../../../components/Project/CreateProject/ProjectInformation";
import ProjectBudget from "../../../components/Project/CreateProject/ProjectBudget";
import CheckAgain from "../../../components/Project/CreateProject/CheckAgain";
import { useNavigate } from "react-router-dom";
import { isValidRole } from "../../../utils/auth";
import { toast } from "react-toastify";

const CreateProject = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigation = useNavigate();

  useEffect(() => {
    if (!isValidRole("ROLE_ADMIN")) {
      navigation(routes.admin);
      toast.warn("Bạn không được phép truy cập vào trang này!");
    }
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <ProjectProvider>
      <PageHeader
        breadcrumbs={[
          { title: "Dashboard", path: routes.admin },
          { title: "Danh sách dự án", path: routes.manageProject },
          { title: "Tạo dự án mới" },
        ]}
        pageTitle={"Tạo dự án mới"}
      >
        <div>
          <Box>
            <Stepper activeStep={activeStep}>
              <Step>
                <StepLabel>Thông tin dự án</StepLabel>
              </Step>
              <Step>
                <StepLabel>Chi phí dự kiến</StepLabel>
              </Step>
              <Step>
                <StepLabel>Xác nhận</StepLabel>
              </Step>
            </Stepper>
            {activeStep === 0 && <ProjectInformation handleNext={handleNext} />}
            {activeStep === 1 && (
              <ProjectBudget handleBack={handleBack} handleNext={handleNext} />
            )}
            {activeStep === 2 && <CheckAgain handleBack={handleBack} />}
          </Box>
        </div>
      </PageHeader>
    </ProjectProvider>
  );
};

export default CreateProject;
