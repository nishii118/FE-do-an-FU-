export const routes = {
  home: "/",

  login: "/dang-nhap",
  register: "/dang-ky",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",

  aboutUs: "/gioi-thieu",
  aboutChallenge: "/gt-thu-thach",
  homeCampaignDetail: "/gop-le/:slug",
  homeProjects: "/du-an",
  homeProjectDetail: "/du-an/:slug",

  homeNewsList: "/tin-tuc",
  homeNewsDetail: "/tin-tuc/:slug",

  homeUserProfile: "/user/:userCode",
  profileEdit: "/user/edit",
  donationHistory: "/user/donation-history",

  challengeDetail: "/thu-thach/:slug",
  challengeList: "thu-thach",
  ambassadorList: "dai-su",
  ranking: "xep-hang",

  admin: "/admin",
  donationList: "/admin/donationList",
  assignProject: "/admin/assign-project",
  assignProjectDetail: "/admin/assign-project/:id",

  createProject: "/admin/create-project",
  updateProject: "/admin/update-project/:id",
  manageProject: "/admin/manage-project",
  projectDetail: "/admin/manage-project/:id",

  createCampaign: "/admin/create-campaign",
  updateCampaign: "/admin/update-campaign/:id",
  manageCampaign: "/admin/manage-campaign",
  campaignDetail: "/admin/manage-campaign/:id",

  createNews: "/admin/create-news",
  updateNews: "/admin/news-manage/:id/edit",
  manageNews: "/admin/news-manage",
  newsDetail: "/admin/news-manage/:id",
  createdNews: "/admin/news-created",
  newsCreatedDetail: "/admin/news-created/:id",
  updateCreatedNews: "/admin/news-created/:id/edit",

  manageAccount: "/admin/account-manage",
  createAccount: "/admin/create-account",
  updateAccount: "/admin/update-account/:id/",
  accountDetails: "/admin/manage-account/:id",

  createTracking: "/admin/create-account",
  updateTracking: "/admin/update-tracking/:id",
  listTracking: "/admin/list-tracking",

  createExpense: "/admin/create-expense",
  updateExpense: "/admin/update-expense/:id",
  listExpense: "/admin/list-expense",

  listCategory: "/admin/list-category",

  adminProfile: "/admin/admin-profile",

  adminChallengeList: "/admin/challenge-list",
  adminChallengeDetail: "/admin/challenge-list/:id",
  systemUserList: "admin/user-list",
  notFound: "/not-found"
};

export const FETCH_DONATION_TIME = 30000
export const BASE_URL_FE = "http://fpt.sucmanh2000.com"
// export const BASE_URL = "https://fpt.sucmanh2000.com"
export const BASE_URL = "http://localhost:8080";
export const BASE_API_URL = BASE_URL + "/api";
export const FIREBASE_FILE_URL =
  "https://firebasestorage.googleapis.com/v0/b/sep490-g28-summer24.appspot.com/o/";

export const DONATION_QR_QUICKLINK = "https://api.vietqr.io/image/970422-0348737721-compact.jpg";
