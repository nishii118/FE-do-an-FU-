import { routes } from "../../config";

export const NEWS_STATUS = [
  { status: 1, title: "Đang xử lý" },
  { status: 2, title: "Đang hoạt động" },
  { status: 3, title: "Đang ẩn" },
  { status: 4, title: "Từ chối" },
];

export const NEWS_CONFIRM_MODAL = {
  approve: { title: "Xác nhận duyệt bài?", param: { status: 2 } },
  reject: { title: "Từ chối duyệt bài?", param: { status: 4 } },
  deactive: { title: "Bạn muốn ẩn bài viết này?", param: { status: 3 } },
  active: { title: "Bạn muốn hiển thị bài viết này?", param: { status: 2 } },
};

export const ROLE = {
  admin: "ROLE_ADMIN",
  projectManager: "ROLE_PROJECT_MANAGER",
  socialStaff: "ROLE_SOCIAL_STAFF",
  user: "ROLE_SYSTEM_USER",
};

export const ADMIN_ROLE = [
  "ROLE_ADMIN",
  "ROLE_SOCIAL_STAFF",
  "ROLE_PROJECT_MANAGER",
];

export const PROJECT_STATUS = {
  1: "Chưa có NTT",
  2: "Cần góp lẻ",
  3: "Đang thi công",
  4: "Hoàn thành",
};

export const PROJECT_STATUS_ARRAY = [
  { id: 1, title: "Chưa có NTT" },
  { id: 2, title: "Cần góp lẻ" },
  { id: 3, title: "Đang thi công" },
  { id: 4, title: "Hoàn thành" },
]

export const NAVIGATION_NAVBAR = [
  {
    key: "home",
    label: "Trang chủ",
    path: routes.home,
  },
  {
    key: "about-us",
    label: "Giới thiệu",
    path: routes.aboutUs,
  },
  {
    key: "campaigns",
    label: "Góp lẻ",
    path: "/du-an",
    // children: [
    //   {
    //     key: "campaigns-1",
    //     label: "Góp lẻ xây nhà",
    //     path: "/gop-le/1",
    //   },
    //   {
    //     key: "campaigns-2",
    //     label: "Góp lẻ xây cầu",
    //     path: "/gop-le/2",
    //   },
    //   {
    //     key: "campaigns-3",
    //     label: "Góp lẻ xây trường",
    //     path: "/gop-le/3",
    //   },
    // ],
  },
  {
    key: "project",
    label: "Dự án",
    path: routes.homeProjects,
  },
  {
    key: "challenges",
    label: "Thử thách và đại sứ",
    children: [
      // {
      //   key: "aboutChallenge",
      //   label: "Giới thiệu",
      //   path: routes.aboutChallenge,
      // },
      {
        key: "ranking",
        label: "Xếp hạng",
        path: routes.ranking,
      },
      {
        key: "ambassador",
        label: "Đại sứ",
        path: routes.ambassadorList,
      },
      {
        key: "challenges",
        label: "Thử thách",
        path: routes.challengeList,
      },
    ],
  },
  {
    key: "news",
    label: "Tin Sức mạnh 2000",
    path: routes.homeNewsList,
  },

  // {
  //   key: "about-us",
  //   label: "Về chúng tôi",
  //   path: "/about-us",
  // },
];

export const USER_ACTIONS_NO_AUTH = [
  {
    key: "login",
    label: "Đăng nhập",
    path: routes.login,
  },
];



export const USER_ACTIONS_AUTH = () => {
  const userCode = localStorage.getItem("userCode");
  return (
    [
      {
        key: "profile",
        label: "Trang cá nhân",
        // path: routes.homeUserProfile,
        path: "/user/" + userCode
      },
      {
        key: "donation-history",
        label: "Lịch sử quyên góp",
        path: routes.donationHistory,
      },
      {
        key: "profile-edit",
        label: "Chỉnh sửa tài khoản",
        path: routes.profileEdit,
      },
    ]
  )
};