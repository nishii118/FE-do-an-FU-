import React, { useEffect, useState} from "react";
import { Autocomplete, TextField, Grid } from "@mui/material";
import { fetchAvailableMembersService } from "../../../services/AssignService";

const fetchAvailableMembers = async (projectId, setListAccount) => {
  try {
    const response = await fetchAvailableMembersService(projectId)
    setListAccount(response);
  } catch (error) {
    console.error("There was an error fetching the available members!", error);
  }
};

const MemberProject = ({ handleSelectChange, selectedMembers, projectId}) => {
  const [listAccount, setListAccount] = useState([]) ;

  useEffect(() => {
    if (projectId) {
      fetchAvailableMembers(projectId, setListAccount);
    }
  }, [projectId]);

  return (
    <Grid item sm={12}>
      <Autocomplete
        onChange={(event, value) => handleSelectChange("assign", event, value)}
        multiple
        fullWidth
        id="tags-outlined"
        options={listAccount}
        getOptionLabel={(option) => option.email}
        value={selectedMembers}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField fullWidth {...params} label="Thành viên tham gia dự án" />
        )}
      />
    </Grid>
  );
};

export default MemberProject;
