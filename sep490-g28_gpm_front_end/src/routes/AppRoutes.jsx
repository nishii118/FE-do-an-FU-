import { Routes, Route } from "react-router-dom";
import ProjectManage from "../pages/Admin/Project/ProjectManage";
import ProjectAssign from "../pages/Admin/Project/ProjectAssign";
import NotFound from "./NotFound";
import Login from "../pages/Authen/Login";
import Transaction from "../pages/Admin/Transaction/Transaction";
import RegistrationForm from "../pages/Authen/Register";
import VerifyEmail from "../pages/Authen/VerifyEmail";
import ResetPassword from "../pages/Authen/ForgotPassword";
import CreateProject from "../pages/Admin/Project/CreateProject";
import CreateCampaign from "../pages/Admin/Campaign/CreateCampaign";
import UpdateCampaign from "../pages/Admin/Campaign/UpdateCampaign";
import { routes } from "../config/index";
import CampaignDetails from "../pages/Admin/Campaign/CampaignDetails";
import Dashboard from "../pages/Admin/Dashboard";
import CreateNews from "../pages/Admin/News/CreateNews";
import UpdateNews from "../pages/Admin/News/UpdateNews";
import NewsDetails from "../pages/Admin/News/NewsDetails";
import NewsManage from "../pages/Admin/News/NewsManage";
import CampaignManage from "../pages/Admin/Campaign/CampaignManage";
import AccountManage from "../pages/Admin/Account/AccountManage";
import CreateAccount from "../pages/Admin/Account/CreateAccount";
import UpdateAccount from "../pages/Admin/Account/UpdateAccount";
import ProjectDetails from "../pages/Admin/Project/ProjectDetails";
import { DefaultLayout, AdminLayout } from "../layout";
import {
  HomePage,
  NewsList,
  ProjectDetail,
  Projects,
  UserAnalysis,
} from "../pages/MainFeature";
import CampaignDetail from "../pages/MainFeature/CampaignDetail";
import NewsCreated from "../pages/Admin/News/NewsCreated";
import { isValidRole } from "../utils/auth";
import { ADMIN_ROLE, ROLE } from "../utils/const";
import HomeNewsDetail from "../pages/MainFeature/NewsList/HomeNewsDetail";
import ScrollToTop from "./ScrollToTop";
import ChallengeDetail from "../pages/MainFeature/Challenge/ChallengeDetail";
import AdminProfile from "../pages/Admin/AdminProfile/AdminProfile";
import ProfileEdit from "../pages/MainFeature/UserProfile/ProfileEdit";
import LogoutOnNonAdminRoutes from "./LogoutOnNonAdminRoutes";
import DonationHistory from "../pages/MainFeature/UserProfile/DonationHistory";
import DonationList from "../pages/Admin/DonationList/DonationList";
import Ranking from "../pages/MainFeature/Ranking/Ranking";
import AmbassadorsList from "../pages/MainFeature/Ambassador/AmbassadorsList";
import ChallengeList from "../pages/MainFeature/Challenge/ChallengeList";
import ChallengeManage from "../pages/Admin/Challenge/ChallengeManage";
import ManageUser from "../pages/Admin/SystemUser/ManageUser";
import AdminChallengeDetail from "../pages/Admin/Challenge/ChallengeDetail";
import ProtectedRoute from "./ProtectRoute";
import CategoryList from "../pages/Admin/Category/ListCategory";
import AboutUs from "../pages/MainFeature/AboutUs";
import AboutChallenge from "../pages/MainFeature/Challenge/AboutChallenge";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <LogoutOnNonAdminRoutes /> {/* Kiểm tra và đăng xuất nếu cần */}
      <Routes>
        <Route path={routes.home} element={<DefaultLayout />}>
          <Route path={routes.home} element={<HomePage />} />
          <Route
            path={routes.homeCampaignDetail}
            element={<CampaignDetail />}
          />
          <Route path={routes.aboutUs} element={<AboutUs />} />
          <Route path={routes.aboutChallenge} element={<AboutChallenge />} />
          <Route path={routes.homeProjectDetail} element={<ProjectDetail />} />
          <Route path={routes.homeProjects} element={<Projects />} />
          <Route path={routes.homeNewsList} element={<NewsList />} />
          <Route path={routes.homeNewsDetail} element={<HomeNewsDetail />} />
          <Route path={routes.homeUserProfile} element={<UserAnalysis />} />
          <Route path={routes.profileEdit} element={<ProfileEdit />} />
          <Route path={routes.ranking} element={<Ranking />} />
          <Route path={routes.challengeDetail} element={<ChallengeDetail />} />
          <Route path={routes.donationHistory} element={<DonationHistory />} />
          <Route path={routes.ambassadorList} element={<AmbassadorsList />} />
          <Route path={routes.challengeList} element={<ChallengeList />} />
        </Route>

        <Route path={routes.admin} element={<AdminLayout />}>
          {/* <Route path={routes.admin} element={<Dashboard />} />
          <Route path={routes.donationList} element={<DonationList />} />
          <Route path={routes.transaction} element={<Transaction />} />
          <Route path={routes.manageCampaign} element={<CampaignManage />} />
          <Route path={routes.createCampaign} element={<CreateCampaign />} />
          <Route path={routes.updateCampaign} element={<UpdateCampaign />} />
          <Route path={routes.campaignDetail} element={<CampaignDetails />} />
          <Route path={routes.manageProject} element={<ProjectManage />} />
          <Route path={routes.assignProject} element={<ProjectAssign />} />
          <Route path={routes.createProject} element={<CreateProject />} />
          <Route path={routes.projectDetail} element={<ProjectDetails />} />
          <Route
            path={routes.assignProjectDetail}
            element={<ProjectDetails />}
          />
          <Route
            path={routes.adminChallengeList}
            element={<ChallengeManage />}
          />
          <Route
            path={routes.adminChallengeDetail}
            element={<AdminChallengeDetail />}
          />
          <Route path={routes.systemUserList} element={<ManageUser />} />

          <Route path={routes.manageNews} element={<NewsManage />} />
          <Route path={routes.createNews} element={<CreateNews />} />
          <Route path={routes.updateNews} element={<UpdateNews />} />
          <Route path={routes.newsDetail} element={<NewsDetails />} />
          <Route path={routes.createdNews} element={<NewsCreated />} />
          <Route path={routes.newsCreatedDetail} element={<NewsDetails />} />
          <Route path={routes.updateCreatedNews} element={<UpdateNews />} />
          <Route path={routes.manageAccount} element={<AccountManage />} />
          <Route path={routes.createAccount} element={<CreateAccount />} />
          <Route path={routes.updateAccount} element={<UpdateAccount />} />
          <Route path={routes.adminProfile} element={<AdminProfile />} /> */}

          <Route
            path={routes.admin}
            element={<ProtectedRoute element={Dashboard} />}
          />
          <Route
            path={routes.donationList}
            element={<ProtectedRoute element={DonationList} />}
          />
          <Route
            path={routes.transaction}
            element={<ProtectedRoute element={Transaction} />}
          />
          <Route
            path={routes.manageCampaign}
            element={<ProtectedRoute element={CampaignManage} />}
          />
          <Route
            path={routes.createCampaign}
            element={<ProtectedRoute element={CreateCampaign} />}
          />
          <Route
            path={routes.updateCampaign}
            element={<ProtectedRoute element={UpdateCampaign} />}
          />
          <Route
            path={routes.campaignDetail}
            element={<ProtectedRoute element={CampaignDetails} />}
          />
          <Route
            path={routes.manageProject}
            element={<ProtectedRoute element={ProjectManage} />}
          />
          <Route
            path={routes.assignProject}
            element={<ProtectedRoute element={ProjectAssign} />}
          />
          <Route
            path={routes.createProject}
            element={<ProtectedRoute element={CreateProject} />}
          />
          <Route
            path={routes.projectDetail}
            element={<ProtectedRoute element={ProjectDetails} />}
          />
          <Route
            path={routes.assignProjectDetail}
            element={<ProtectedRoute element={ProjectDetails} />}
          />
          <Route
            path={routes.adminChallengeList}
            element={<ProtectedRoute element={ChallengeManage} />}
          />
          <Route
            path={routes.adminChallengeDetail}
            element={<ProtectedRoute element={AdminChallengeDetail} />}
          />
          <Route
            path={routes.systemUserList}
            element={<ProtectedRoute element={ManageUser} />}
          />
          <Route
            path={routes.manageNews}
            element={<ProtectedRoute element={NewsManage} />}
          />
          <Route
            path={routes.createNews}
            element={<ProtectedRoute element={CreateNews} />}
          />
          <Route
            path={routes.updateNews}
            element={<ProtectedRoute element={UpdateNews} />}
          />
          <Route
            path={routes.newsDetail}
            element={<ProtectedRoute element={NewsDetails} />}
          />
          <Route
            path={routes.createdNews}
            element={<ProtectedRoute element={NewsCreated} />}
          />
          <Route
            path={routes.newsCreatedDetail}
            element={<ProtectedRoute element={NewsDetails} />}
          />
          <Route
            path={routes.updateCreatedNews}
            element={<ProtectedRoute element={UpdateNews} />}
          />
          <Route
            path={routes.manageAccount}
            element={<ProtectedRoute element={AccountManage} />}
          />
          <Route
            path={routes.createAccount}
            element={<ProtectedRoute element={CreateAccount} />}
          />
          <Route
            path={routes.updateAccount}
            element={<ProtectedRoute element={UpdateAccount} />}
          />
          <Route
            path={routes.adminProfile}
            element={<ProtectedRoute element={AdminProfile} />}
          />
          <Route
            path={routes.listCategory}
            element={<ProtectedRoute element={CategoryList} />}
          />
        </Route>

        <Route path={routes.verifyEmail} element={<VerifyEmail />} />
        <Route path={routes.resetPassword} element={<ResetPassword />} />
        <Route path={routes.register} element={<RegistrationForm />} />
        <Route path={routes.login} element={<Login />} />

        <Route path="*" element={<NotFound />} />
        <Route path={routes.notFound} element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
