import { useState } from "react"
import { changeNewsStatusService } from "../../services/NewsService";
import { toast } from "react-toastify";
import { NEWS_CONFIRM_MODAL } from "../../utils/const";

const useNewsManage = ({ modalAction, newsId, setModalOpen, refreshData }) => {
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleModalConfirm = () => {
        const param = NEWS_CONFIRM_MODAL[modalAction]?.param
        setConfirmLoading(true)
        changeNewsStatusService({ ...param, news_id: newsId }).then(res => {
            toast.success("Đã cập nhật trạng thái thành công")
            setModalOpen(false);
            refreshData();
        }).catch(error => {
            toast.error(error.response?.data?.error?.message || "Đã có lỗi xảy ra")
        }).finally(() => { setConfirmLoading(false) })
    };
    return { confirmLoading, handleModalConfirm }
}

export default useNewsManage