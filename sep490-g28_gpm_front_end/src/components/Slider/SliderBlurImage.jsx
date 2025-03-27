import React from "react";

const SliderBlurImage = ({
  slideIndex,
  onChangeSlide,
  data,
  content,
  disabledIndicator,
}) => {
  return (
    <div className="relative">
      <div className="flex items-center overflow-hidden">
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform ease-in duration-300"
            style={{ transform: `translateX(-${slideIndex * 100}%)` }}
          >
            {data.map((item, idx) => (
              <div key={idx} className="flex-none w-full p-2 box-border">
                {content(item)}
              </div>
            ))}
          </div>
        </div>
      </div>
      {(!disabledIndicator || disabledIndicator === true) && (
        <div className="flex justify-center mt-4">
          {data.map((_, idx) => (
            <button
              key={idx}
              className={`h-[10px] mx-1 rounded-full ease-in duration-300 ${
                slideIndex === idx
                  ? "bg-primary w-[55px]"
                  : "bg-gray-300 w-[10px]"
              }`}
              onClick={() => onChangeSlide(idx)}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SliderBlurImage;
