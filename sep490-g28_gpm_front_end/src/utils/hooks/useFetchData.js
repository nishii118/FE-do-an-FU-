import { useEffect, useState } from "react";

const useFetchData = ({ fnc, onSuccess, onError }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fnc();
      setData(data);
      onSuccess?.();
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    isLoading: loading,
    isError: !!error,
    error,
    setData,
    setLoading,
    onRefetchData: fetchData,
  };
};

export default useFetchData;
