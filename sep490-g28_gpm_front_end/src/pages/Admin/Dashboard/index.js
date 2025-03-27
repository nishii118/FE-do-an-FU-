
import ComplexStatisticsCard from './components/ComplexStatisticsCard/index';
import { AttachMoney } from '@mui/icons-material';
import { Box, Card, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Grid } from '@mui/material';
import DashboardLayout from './components/DashboardLayout/index';
import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts';
import { fetchOverviewInforService, fetchTotalDonationByCampaignService, fetchTotalDonationByMonthService, fetchTotalDonationByWeekService } from '../../../services/DashboardService';
import { toast } from 'react-toastify';

function Dashboard() {
  const currentMonth = new Date().getMonth() + 1;
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState({
    month: currentMonth,
    year: new Date().getFullYear(),
  })
  const [statistics, setStatistics] = useState({
    tongSoQuyenGop: 0,
    tongSoTienTaiTro: 0,
    tongSoQuyenGopSai: 0,
    tongSoLuotQuyenGop: 0,
  });

  const [pieData, setPieData] = useState([]);
  const [barChartByMonth, setBarChartByMonth] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const colors = [
    "#FFEEA9",
    "#FFBF78",
    "#FF7D29",
    "#A5DD9B",
    "#C5EBAA",
    "#F6F193",
    "#BACD92",
    "#FCFFE0",
    "#F5DAD2",
  ];

  const [color, setColor] = React.useState('#4fb9ea');

  const fetchOverviewData = async () => {
    setLoading(true)
    await fetchOverviewInforService(params)
      .then((res) => {
        setStatistics({
          tongSoQuyenGop: res['tong-so-quyen-gop'] ?? 0,
          tongSoTienTaiTro: res['tong-so-tien-tai-tro'] ?? 0,
          tongSoQuyenGopSai: res['tong-so-quyen-gop-sai'] ?? 0,
          tongSoLuotQuyenGop: res['tong-so-luot-quyen-gop'] ?? 0,
        });
        setLoading(false)
      })
      .catch((error) => {
        console.error("There was an error fetching the statistics!", error);
        toast.error("Đã có lỗi khi tải dữ liệu theo chiến dịch")
        setLoading(false)
      });
  }

  const fetchDataByCampaign = async () => {
    setLoading(true)
    await fetchTotalDonationByCampaignService(params)
      .then((res) => {
        setPieData(res)
        setLoading(false)
      })
      .catch((error) => {
        console.error("There was an error fetching the statistics!", error);
        toast.error("Đã có lỗi khi tải dữ liệu theo chiến dịch")
        setLoading(false)
      });
  }

  const fetchDataDonationByMonth = async () => {
    const months = [
      { label: "Tháng 1", value: 0 },
      { label: "Tháng 2", value: 0 },
      { label: "Tháng 3", value: 0 },
      { label: "Tháng 4", value: 0 },
      { label: "Tháng 5", value: 0 },
      { label: "Tháng 6", value: 0 },
      { label: "Tháng 7", value: 0 },
      { label: "Tháng 8", value: 0 },
      { label: "Tháng 9", value: 0 },
      { label: "Tháng 10", value: 0 },
      { label: "Tháng 11", value: 0 },
      { label: "Tháng 12", value: 0 },
    ];

    await fetchTotalDonationByMonthService(params)
      .then((data) => {
        const updatedData = months.map(month => {
          const found = data.find(item => item.label === month.label);
          return found ? found : month;
        });
        setBarChartByMonth(updatedData);
        // console.log(updatedData);

      })
      .catch((error) => {
        console.error("There was an error fetching the line chart data!", error);
      });
  }


  const fetchDataDonationByWeek = async () => {
    const weeks = [
      { label: "Tuần 1", value: 0 },
      { label: "Tuần 2", value: 0 },
      { label: "Tuần 3", value: 0 },
      { label: "Tuần 4", value: 0 },
    ];

    await fetchTotalDonationByWeekService(params)
      .then((data) => {
        const updatedData = weeks.map(week => {
          const found = data.find(item => item.label === week.label);
          return found ? found : week;
        });
        setBarChartData(updatedData);
      })
      .catch((error) => {
        console.error("There was an error fetching the bar chart data!", error);
      });
  }

  useEffect(() => {
    fetchDataByCampaign()
    fetchDataDonationByMonth()
    fetchDataDonationByWeek()
    fetchOverviewData()
  }, [params]);


  const handleChange = (event, name) => {
    setParams((prev) => ({ ...prev, [name]: event.target.value }))
  };


  return (
    <DashboardLayout>
      <Box pb={3}>
        <div className='bg-white p-3'>
          <div className='italic font-semibold'>Lựa chọn thời gian bạn muốn thống kê</div>
          <Grid container className='py-3'>
            <Grid item lg={2} xs={3}>
              <FormControl fullWidth>
                <InputLabel id="month-select-label" size='small'>Chọn tháng</InputLabel>
                <Select
                  labelId="month-select-label"
                  id="month-select"
                  value={params.month}
                  label="Chọn tháng"
                  onChange={(event) => handleChange(event, 'month')}
                  size='small'
                >
                  {Array.from({ length: 12 }, (_, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      Tháng {index + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={2} xs={3} className="pl-3">
              <TextField
                label="Năm"
                placeholder="Năm"
                size="small"
                fullWidth
                value={params.year}
                type='number'
                onChange={(event) => handleChange(event, 'year')} // Pass 'year' as the name
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} pt={2}>
            <Grid item xs={12} md={6} lg={3}>
              <Box mb={1.5}>
                <ComplexStatisticsCard
                  icon={AttachMoney}
                  title="Tổng số tiền quyên góp"
                  count={statistics.tongSoQuyenGop.toLocaleString()}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Box mb={1.5}>
                <ComplexStatisticsCard
                  icon={AttachMoney}
                  title="Tổng số tiền được tài trợ"
                  count={statistics.tongSoTienTaiTro.toLocaleString()}

                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Box mb={1.5}>
                <ComplexStatisticsCard
                  icon={AttachMoney}
                  title="Tổng số quyên góp sai"
                  count={statistics.tongSoQuyenGopSai.toLocaleString()}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Box mb={1.5}>
                <ComplexStatisticsCard
                  icon={AttachMoney}
                  title="Tổng số lượt quyên góp"
                  count={statistics.tongSoLuotQuyenGop.toLocaleString()}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="stretch" pt={2}>
            <Grid item md={12} lg={6}>
              <div className="flex flex-col items-center border-2 border-gray-200 rounded-lg shadow-xl">
                <div className='my-3 font-semibold'>
                  Số tiền quyên góp được theo chiến dịch
                </div>
                <PieChart
                  series={[
                    {
                      data: pieData.map((item, index) => ({
                        id: item.label,
                        value: item.value,
                        label: item.label,
                        color: colors[index % colors.length], // Assign color to each segment
                      })),

                    },
                  ]}
                  width={500}
                  height={200}
                />
              </div>
            </Grid>
            <Grid item md={12} lg={6}>
              <div className="flex flex-col items-center border-2 border-gray-200 rounded-lg shadow-xl">
                <div className='my-3 font-semibold'>
                  Số tiền quyên góp được theo tuần trong tháng {params.month}
                </div>
                <BarChart
                  xAxis={[{ scaleType: 'band', data: barChartData.map(item => item.label) }]}
                  series={[
                    {
                      data: barChartData.map(item => item.value),
                      barWidth: 15,
                      color
                    },
                  ]}
                  width={500}
                  height={200}
                  margin={{ left: 100, right: 20, top: 20, bottom: 40 }} // Adjust margins to ensure axes are visible
                />
              </div>
            </Grid>
            <Grid item lg={12}>
              <div className="bg-white flex flex-col items-center border-2 border-gray-200 rounded-lg w-full shadow-xl">
                <div className='my-3 font-semibold'>
                  Số tiền quyên góp được theo tháng trong năm {params.year}
                </div>
                <BarChart
                  xAxis={[{ scaleType: 'band', data: barChartByMonth.map(item => item.label) }]}
                  series={[
                    {
                      data: barChartByMonth.map(item => item.value),
                      barWidth: 30,
                    },
                  ]}
                  width={1000}
                  height={300}
                  margin={{ left: 100, right: 20, top: 20, bottom: 40 }}
                />
              </div>
            </Grid>
          </Grid>
        </div>

      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;
