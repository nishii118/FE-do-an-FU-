import React from "react";
import { Grid, TextField } from "@mui/material";

const RegularCharity = () => {
  return (
    <div className="container m-auto">
      <div className="flex items-center gap-[28px]">
        <hr className="flex-1 border-secondary" />
        <span className="uppercase font-bold lg:text-[64px] text-3xl text-[#EF8C7F]">
          Quyên góp định kì
        </span>
        <hr className="flex-1 border-secondary" />
      </div>
      <Grid
        container
        className="py-6"
        spacing={12}
        justifyContent="space-between"
      >
        <Grid item md={5}>
          <div className="flex flex-col gap-8 lg:px-0 px-4">
            <div className="lg:text-left text-center">
              <h3 className="text-2xl lg:text-3xl font-bold">
                Bước 1: ĐĂNG KÝ
              </h3>
              <span className="text-[20px]">
                Nhập thông tin đăng ký tham gia ( có thể bỏ qua )
              </span>
            </div>
            <div className="border border-secondary p-10 rounded-[60px] flex flex-col gap-6">
              <TextField label="Họ và Tên" variant="outlined" fullWidth />
              <TextField label="Email" variant="outlined" fullWidth />
              <TextField label="Địa chỉ" variant="outlined" fullWidth />
              <TextField label="Số điện thoại" variant="outlined" fullWidth />
              <TextField label="Link Facebook" variant="outlined" fullWidth />
              <button className="bg-secondary text-white rounded-[10px] py-3 text-[20px] font-bold uppercase">
                Đăng kí dự án
              </button>
            </div>
            <p>
              *Điền Form sẽ giúp team quản lý cũng như gửi tới cập nhật từ dự
              án. Nếu không, mời anh chị chủ động xem & cập nhật tại website &
              Fanpage.
            </p>
          </div>
        </Grid>
        <Grid item md={6}>
          <div className="flex flex-col gap-8 xl:w-[600px] w-full lg:px-0 px-4">
            <div className="lg:text-left text-center">
              <h3 className="text-3xl font-bold">Bước 2: GỬI TIỀN</h3>
              <span>
                Chọn 1 trong 2 phương thức bên dưới để đóng góp cho quỹ
              </span>
            </div>
            <div className="border border-secondary p-10 rounded-[60px] flex flex-col gap-6">
              <button className="bg-[#3F8E4D] text-white rounded-[10px] py-3 text-[20px] font-bold">
                Chuyển khoản vào số tài khoản ngân hàng
              </button>
              <button className="bg-[#5E6071] text-white rounded-[10px] py-3 text-[20px] font-bold">
                Gửi 2000đ mỗi ngày qua MoMo
              </button>
            </div>
            <ul className="text-[20px]">
              <li>Trung tâm Thông tin Nguồn lực Tình nguyện Việt Nam</li>
              <li>Số Tài khoản: 190.266.371.95042</li>
              <li>Ngân hàng: Techcombank chi nhánh Hà Thành.</li>
              <li>Cú pháp: SucManh2000_TÊN BẠN_SĐT/EMAIL</li>
            </ul>
            <p className="text-[20px]">
              <b>
                * Trường hợp công ty muốn tài trợ nguyên một điểm trường hoặc
                tài trợ 1 số tiền cụ thể trên 100 triệu, xin vui lòng liên hệ
                hotline: 0975 302 307 để được hỗ trợ.
              </b>
            </p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default RegularCharity;
