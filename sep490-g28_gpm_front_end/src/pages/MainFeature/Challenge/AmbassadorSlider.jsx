import React from "react";
import Slider from "react-slick";
import { Avatar, Card, CardContent, Typography } from "@mui/material";

const testimonials = [
  {
    name: "Nhà báo Thu Uyên",
    title: "Sáng lập Chương trình truyền hình Như chưa hề có cuộc chia ly",
    content:
      "Sáng kiến Tài khoản gây quỹ cộng đồng mình bạch quá sức hay! Thi phải là những người nhiều năm đi làm thiện nguyện như Thái Thùy Linh...",
    imageUrl: "",
  },
  {
    name: "MC Phan Anh",
    title: "Nhà hoạt động xã hội",
    content:
      "Câu hỏi là làm thế nào để mình có thể minh bạch hoàn toàn việc thu, chi trong quá trình gây quỹ...",
    imageUrl: "",
  },
  {
    name: "Bùi Thị Hòa",
    title: "Chủ tịch Hội chữ thập đỏ",
    content:
      "App Thiện Nguyện với cách sử dụng rất là thuận lợi và mọi thông tin rất là mình bạch thì đã đáp ứng được những mong mỏi của người làm công tác nhân đạo hiện nay.",
    imageUrl: "",
  },
];

const AmbassadorSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div className="mt-[75px]">
      <div className="flex items-center gap-[28px]">
        <hr className="flex-1 border-secondary" />
        <span className="uppercase font-bold lg:text-5xl text-3xl text-gradient-1">
          Đại sứ đồng hành cùng với góp lẻ
        </span>
        <hr className="flex-1 border-secondary" />
      </div>
      <div className="mx-auto py-8 mt-[50px]">
        <div>
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-4">
                <Card className="w-full shadow-md p-4 rounded-lg bg-white">
                  <CardContent className="flex flex-col items-center text-center">
                    <Avatar
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      className="w-24 h-24 mb-4"
                    />
                    <Typography variant="h6" className="font-bold">
                      {testimonial.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="mb-4"
                    >
                      {testimonial.title}
                    </Typography>
                    <Typography variant="body2">
                      {testimonial.content}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorSlider;
