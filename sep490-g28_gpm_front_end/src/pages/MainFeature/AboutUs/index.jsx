import React from "react";
import hht from "../../../assets/images/trung-17320.jpg";

const AboutUs = () => {
  return (
    <div className="container mx-auto bg-white shadow-xl p-5">
      <div class="mx-auto">
        <h2 class="text-2xl font-bold text-red-500 mb-4">
          Về "Sức mạnh 2000" - About The Power of VND 2000
        </h2>
        <p class="text-lg mb-4">
          "Sức mạnh 2000" - Tiến lên mỗi ngày Triệu người chung tay Xây nghìn
          trường mới" phát động ngày 27/02/2020 là chương trình gây quỹ thuộc Dự
          Án "Ánh sáng núi rừng – Mỗi năm một ngôi trường cho trẻ vùng cao” ra
          đời năm 2009 và nhận được sự bảo trợ của Trung tâm tình nguyện Quốc
          gia.
        </p>
        <p class="text-lg mb-4">
          Xuất phát từ ý tưởng tích tiểu thành đại, chương trình mang trên mình
          sứ mệnh xoá toàn bộ trường tạm tại Việt Nam, xây hàng trăm cây cầu &
          hàng chục nghìn nhà hạnh phúc. Niềm tin của chúng tôi là nếu mỗi người
          tham gia tặng 2,000 VND/ mỗi ngày/ mỗi năm thì với 100 nghìn người
          tham gia sẽ có 292 điểm trường được khởi công xây dựng.
        </p>
        <p class="text-lg mb-4">
          Với 2 triệu người tham gia, sứ mệnh chương trình sẽ được hoàn thành.
          2,000 VND nhỏ bé lại có thể tạo ra thay đổi lớn lao đến vậy! Tính tới
          tháng 3/2020, dự án "Ánh sáng núi rừng” đã xây dựng thành công 35 điểm
          trường tại tỉnh Điện Biên và Lai Châu, xuất hiện trên Cà phê sáng
          VTV3, Việc tử tế VTV1, Thời sự 19h, Forbes Vietnam và nhiều chương
          trình, ấn phẩm khác.
        </p>

        <div class="mt-8">
          <h3 class="text-lg font-semibold mb-2">
            Tham gia chung tay cùng Sức mạnh 2000 (bất kể mệnh giá) tại:
          </h3>
          <p class="text-base">
            <strong>Website:</strong>{" "}
            <a href="http://fpt.sucmanh2000.com" class="text-blue-500 underline">
              http://fpt.sucmanh2000.com
            </a>
            <br />
            <strong>Hotline:</strong> Hoàng Hoa Trung 0975032307
            <br />
            <strong>Email:</strong> Sucmanh2000.doingoai@gmail.com
          </p>
        </div>

        <p class="text-lg mt-8">
          Tiến độ chương trình và danh sách người tham gia được cập nhật hàng
          ngày và hiển thị công khai trên website.
        </p>

        <hr class="my-8 border-t-2 border-gray-300" />
      </div>

      <section class="bg-gray-200 py-12 px-8">
        <div class="container mx-auto flex flex-col lg:flex-row items-center">
          <div class="lg:w-1/3 mb-8 lg:mb-0 flex justify-center">
            <img src={hht} alt="Hoàng Hoa Trung" class="rounded-lg shadow-lg" />
          </div>
          <div class="lg:w-2/3 lg:pl-12 text-gray-800">
            <h2 class="text-2xl font-bold mb-4">Dự Án Sức Mạnh 2000</h2>
            <p class="text-lg mb-4">
              Được sáng lập và điều hành bởi Forbes 30 Under 30 Việt Nam: Hoàng
              Hoa Trung Gương mặt trẻ Việt Nam tiêu biểu 2019 của Văn phòng Thủ
              tướng Chính phủ và TW Đoàn TNCS Hồ Chí Minh Với 14 năm kinh nghiệm
              hoạt động dự án Nuôi cơm trưa hơn 40,000 học sinh vùng cao với dự
              án Nuôi Em: http://nuoiem.com
            </p>
            <p class="text-lg">
              Hoàng Hoa Trung cùng các bạn trong team Sức mạnh 2000 đi 1 hành
              trình hơn 14 năm đã xây hơn 115 nhà hạnh phúc, hơn 338 điểm
              trường, hơn 32 cây cầu hạnh phúc, 14 khu nội trú … tất cả tập
              trung vào giáo dục, bản cao. Mục tiêu của chúng tôi là xóa TOÀN BỘ
              trường tạm, nhà nội trú tại Việt Nam.
            </p>
          </div>
        </div>

        <div class="container mx-auto mt-12 text-center">
          <h3 class="text-2xl font-bold mb-8">
            Những con số của dự án Sức Mạnh 2000
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <p class="text-orange-500 text-4xl font-bold">14+</p>
              <p class="mt-2 text-gray-600">Năm kinh nghiệm</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
              <p class="text-orange-500 text-4xl font-bold">450+</p>
              <p class="mt-2 text-gray-600">
                Công trình trường / nhà hạnh phúc / nội trú đã được xây dựng
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
              <p class="text-orange-500 text-4xl font-bold">40,000+</p>
              <p class="mt-2 text-gray-600">
                Học sinh bản cao được nuôi cơm trưa
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
              <p class="text-orange-500 text-4xl font-bold">118+</p>
              <p class="mt-2 text-gray-600">
                Dự án chỉ tính riêng từ 01/07/2022 đã được hoàn thành/ xây dựng
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
