import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import DonationCard from "../Card/DonationCard";
import ProjectsDonationCard from "../Card/ProjectsDonationCard";
import { Close } from "@mui/icons-material";
import { useFetchDataFilter } from "../../utils/hooks";
import { fetchListOnGoingProjectsService } from "../../services/PublicService";

const ProjectsDonationDialog = ({ open, handleClose, referCode }) => {
  const { data: projects, isLoading: projectsLoading } = useFetchDataFilter({
    fnc: fetchListOnGoingProjectsService,
  });

  const convertProjects = useMemo(() => {
    return projects.map((project) => ({
      ...project,
      id: project.project_id,
      location: `${project.ward}-${project.district}-${project.province}`,
      price: project.total_budget,
      target: project.amount_needed_to_raise,
      totalDonation: project.totalDonation,
    }));
  }, [projects]);


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: "16px", // Tùy chỉnh góc bo tròn
          maxWidth:"700px"
        },
      }}
    >
      <DialogTitle className="bg-[#ff855f] text-white ">
        <div className="flex justify-between items-center font-semibold text-lg ">
          <div className="text-center w-full text-2xl">QUYÊN GÓP CHO DỰ ÁN</div>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        {/* <DonationCard data={selectedProject} challengeCode={challengeCode} /> */}
        <ProjectsDonationCard
          referCode={referCode}
          projects={convertProjects}
        ></ProjectsDonationCard>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectsDonationDialog;
