import { CgSpinnerAlt } from "react-icons/cg";

const LoadingState = () => {
  return (
    <div className="flex justify-center mt-5">
      <svg
        className="animate-spin h-6 w-6 text-gray-500"
        viewBox="0 0 17 17"
        role="img"
      >
        <CgSpinnerAlt />
      </svg>
    </div>
  );
};

export default LoadingState;