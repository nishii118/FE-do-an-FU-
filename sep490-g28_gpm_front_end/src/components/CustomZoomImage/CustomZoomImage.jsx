import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const CustomZoomImage = ({img}) => {
  const customZoomStyle = {
    zoomImage: {
      width: "600px", // Customize the zoomed image width
      height: "auto", // Customize the zoomed image height
    },
  };

  return (
    <Zoom
      overlayBgColorEnd="rgba(0, 0, 0, 0.85)"
      zoomMargin={40}
      wrapStyle={customZoomStyle}
    >
      {img}
    </Zoom>
  );
};

export default CustomZoomImage;
