import React from "react";
import { Avatar } from "@mui/material";

const TeamMemberItem = ({ data }) => {
  const { avatarUrl, name, description } = data ?? {};
  return (
    <div className="px-10">
      <div className="p-10 flex flex-col gap-6 border border-secondary rounded-[20px]">
        <div className="flex items-center justify-center">
          <Avatar src={avatarUrl} sx={{ width: 150, height: 150 }} />
        </div>
        <p className="text-center text-3xl font-semibold">{name}</p>
        {description && <p className="text-center min-h-[48px] line-clamp-3">{description}</p>}
      </div>
    </div>
  );
};

export default TeamMemberItem;
