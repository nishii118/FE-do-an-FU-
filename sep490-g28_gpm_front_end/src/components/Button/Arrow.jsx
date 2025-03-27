import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

export const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        zIndex: 1,
        position: "absolute",
        top: "50%",
        
        transform: "translateY(-50%)", // Center the arrow vertically
      }}
      onClick={onClick}
    >
    
    </div>
  );
};

export const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={`${className}`} onClick={onClick}>
      <ArrowBackIos className="text-primary" />
    </div>
  );
};
