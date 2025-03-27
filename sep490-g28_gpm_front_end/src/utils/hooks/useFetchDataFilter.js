import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useFetchDataFilter = ({ fnc, onSuccess, onError, dependencies = [] }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fnc();
      setData(response.content);
      if (response && response.total !== undefined) {
        setTotal(response.total);
      }
      onSuccess?.();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu!")
      console.error("Error fetching data:", error);
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    total,
    data,
    isLoading: loading,
    isError: !!error,
    error,
    setData,
    setLoading,
    onRefetchData: fetchData,
  };
};

export default useFetchDataFilter;
