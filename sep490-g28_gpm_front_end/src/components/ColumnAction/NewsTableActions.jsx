import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Info,
  Edit,
  Publish,
  Unpublished,
  Check,
  Close,
} from "@mui/icons-material";
import { Button, Box, Modal, Typography } from "@mui/material";

import useNewsManage from "../../hook/news/useNewsManage";
import NewsActionTooltip from "../Button/NewsActionTooltip";
import { NEWS_CONFIRM_MODAL } from "../../utils/const";
import { isValidRole } from "../../utils/auth";

const NewsTableActions = ({ news, refreshData }) => {
  const isAdmin = isValidRole("ROLE_ADMIN");
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [newsId, setNewsId] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const { confirmLoading, handleModalConfirm } = useNewsManage({
    modalAction,
    newsId,
    setModalOpen,
    refreshData,
  });

  const checkCreator = () => {
    if (isValidRole("ROLE_ADMIN")) return true;

    const email = localStorage.getItem("email").trim();

    if (email === news.created_by.email) return true;

    return false;
  };

  useEffect(() => {
    setIsCreator(checkCreator());
  }, []);

  const handleModalOpen = (action, newsId) => {
    setNewsId(newsId);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const getModalMessage = () => {
    return NEWS_CONFIRM_MODAL[modalAction]?.title ?? "";
  };

  return (
    <>
      {news.status !== 4 && (
        <>
          <NewsActionTooltip
            tooltipContent="Chi tiết"
            icon={<Info />}
            onclick={() => {
              navigate(`./${news.news_id}`);
            }}
            color="primary"
          ></NewsActionTooltip>

          {isCreator && (
            <NewsActionTooltip
              tooltipContent="Cập nhật"
              icon={<Edit />}
              onclick={() => {
                navigate(`./${news.news_id}/edit`);
              }}
              color="secondary"
            ></NewsActionTooltip>
          )}
        </>
      )}
      {isAdmin && news.status === 1 && (
        <>
          <NewsActionTooltip
            tooltipContent="Duyệt bài"
            icon={<Check />}
            onclick={() => handleModalOpen("approve", news.news_id)}
            color="success"
          ></NewsActionTooltip>

          <NewsActionTooltip
            tooltipContent="Từ chối"
            icon={<Close />}
            onclick={() => handleModalOpen("reject", news.news_id)}
            color="error"
          ></NewsActionTooltip>
        </>
      )}
      {isCreator && news.status === 2 && (
        <NewsActionTooltip
          tooltipContent="Ẩn bài viết"
          icon={<Unpublished />}
          onclick={() => handleModalOpen("deactive", news.news_id)}
          color="error"
        ></NewsActionTooltip>
      )}
      {isCreator && news.status === 3 && (
        <NewsActionTooltip
          tooltipContent="Đăng bài viết"
          icon={<Publish />}
          onclick={() => handleModalOpen("active", news.news_id)}
          color="success"
        ></NewsActionTooltip>
      )}

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">{getModalMessage()}</Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalConfirm}
              disabled={confirmLoading}
            >
              Xác nhận
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleModalClose}
              sx={{ ml: 2 }}
            >
              Huỷ
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default NewsTableActions;
