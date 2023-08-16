import React,{ Redirect } from "react-router-dom"
// import Home from "../pages/Landing/index"
// Profile
import UserProfile from "../pages/Authentication/user-profile"
// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard
import Dashboard from "../pages/Dashboard/index"
// Masters ----------------------
import JobRole from "../pages/Masters/Job-Role/index"
import JobRoleAdd from "../pages/Masters/Job-Role/add"
import JobRoleEdit from "../pages/Masters/Job-Role/edit"

import LocationList from "../pages/Masters/Location/index"
import LocationAdd from "../pages/Masters/Location/add"
import LocationEdit from "../pages/Masters/Location/edit"

import Skills from "../pages/Masters/Skills/index"
import SkillsAdd from "../pages/Masters/Skills/add"
import SkillsEdit from "../pages/Masters/Skills/edit"

import Qualifications from "../pages/Masters/Qualifications/index"
import QualificationAdd from "../pages/Masters/Qualifications/add"
import QualificationEdit from "../pages/Masters/Qualifications/edit"
import ClientSource from "../pages/Masters/Client-Source";
import ClientSourceAdd from "../pages/Masters/Client-Source/add";
import ClientSourceEdit from "../pages/Masters/Client-Source/edit";
import CandidateSource from "../pages/Masters/Candidate-Source";
import CandidateSourceAdd from "../pages/Masters/Candidate-Source/add";
import CandidateSourceEdit from "../pages/Masters/Candidate-Source/edit";
import ClientStatus from "../pages/Masters/Client-Status";
import ClientStatusAdd from "../pages/Masters/Client-Status/add";
import ClientStatusEdit from "../pages/Masters/Client-Status/edit";
import RequirementStatus from "../pages/Masters/Requirement-Status";
import RequirementStatusAdd from "../pages/Masters/Requirement-Status/add";
import RequirementStatusEdit from "../pages/Masters/Requirement-Status/edit";
// import CandidateStatus from "../pages/Masters/Candidate-Status";
// import CandidateStatusAdd from "../pages/Masters/Candidate-Status/add";
// import CandidateStatusEdit from "../pages/Masters/Candidate-Status/edit";
import SalaryCurrency from "../pages/Masters/Salary-Currency";
import SalaryCurrencyAdd from "../pages/Masters/Salary-Currency/add";
import SalaryCurrencyEdit from "../pages/Masters/Salary-Currency/edit";
// User Boarding-Demo ---------------
import UserBoarding from "../pages/Users-Onboarding";
import UserAdd from "../pages/Users-Onboarding/add";
// Clients ---------------------
import Clients from "../pages/Clients"
import ClientAdd from "../pages/Clients/add";
import Openings from "../pages/Openings";
import AddJob from "../pages/Openings/Create-Job/index";
import Board from "../pages/Openings/Stage/board";
import Candidates from "../pages/Candidate";
import Openinglist from "../pages/Openings/Candidate-list";
import JobDetail from "../pages/Job-detail";
import UserEdit from "../pages/Users-Onboarding/edit";
import ClientEdit from "../pages/Clients/edit";
import NoticePeriod from "../pages/Masters/Notice-Period";
import NoticePeriodAdd from "../pages/Masters/Notice-Period/add";
import NoticePeriodEdit from "../pages/Masters/Notice-Period/edit";
import EditJob from "../pages/Openings/Edit-Job";
import CandidateOverview from "pages/Candidate/candidate-detail"
import OpeningDetail from "pages/Openings/opening-detail"
import Reports from "pages/Reports"
import Blogs from "pages/Blogs"
import BlogAdd from "pages/Blogs/add"
import BlogEdit from "pages/Blogs/edit"
import ResetPassword from "pages/Authentication/ResetPassword"
const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  // Masters ----------
  { path: "/job-roles", component: JobRole },
  { path: "/job-roles/add", component: JobRoleAdd },
  { path: "/job-roles/edit/:id", component: JobRoleEdit },
  { path: "/location", component: LocationList },
  { path: "/location/add", component: LocationAdd },
  { path: "/location/edit/:id", component: LocationEdit },
  { path: "/skills", component: Skills },
  { path: "/skills/add", component: SkillsAdd },
  { path: "/skills/edit/:id", component: SkillsEdit },
  { path: "/qualifications", component: Qualifications },
  { path: "/qualifications/add", component: QualificationAdd },
  { path: "/qualifications/edit/:id", component: QualificationEdit },
  { path: "/client-source", component: ClientSource },
  { path: "/client-source/add", component: ClientSourceAdd },
  { path: "/client-source/edit/:id", component: ClientSourceEdit },
  { path: "/candidate-source", component: CandidateSource },
  { path: "/candidate-source/add", component: CandidateSourceAdd },
  { path: "/candidate-source/edit/:id", component: CandidateSourceEdit },
  { path: "/client-status", component: ClientStatus },
  { path: "/client-status/add", component: ClientStatusAdd },
  { path: "/client-status/edit/:id", component: ClientStatusEdit },
  { path: "/requirement-status", component: RequirementStatus },
  { path: "/requirement-status/add", component: RequirementStatusAdd },
  { path: "/requirement-status/edit/:id", component: RequirementStatusEdit },
  // { path: "/candidate-status", component: CandidateStatus },
  // { path: "/candidate-status/add", component: CandidateStatusAdd },
  // { path: "/candidate-status/edit/:id", component: CandidateStatusEdit },
  { path: "/salary-currency", component: SalaryCurrency },
  { path: "/salary-currency/add", component: SalaryCurrencyAdd },
  { path: "/salary-currency/edit/:id", component: SalaryCurrencyEdit },
  // User Boarding-Demo ---------------
  { path: "/user-boarding", component: UserBoarding },
  { path: "/user-boarding/add", component: UserAdd },
  { path: "/user-boarding/edit/:id", component: UserEdit },
  // Clients ---------------------
  { path: "/clients", component: Clients },
  { path: "/clients/add", component: ClientAdd },
  { path: "/clients/edit/:id", component: ClientEdit },
  // Openings --------------------
  { path: "/openings", component: Openings },
  { path: "/openings/add", component: AddJob },
  { path: "/openings/edit/:id", component: EditJob },
  { path: "/openings/board/:id", component: Board },
  { path: "/openings/list/:id", component: Openinglist },
  { path: "/openings/detail/:id", component: OpeningDetail },
  //  notice period --------------
  { path: "/notice-period", component:NoticePeriod},
  { path: "/notice-period/add", component:NoticePeriodAdd},
  { path: "/notice-period/edit/:id", component:NoticePeriodEdit},
  // Candidate -------------------
  { path: "/candidates", component: Candidates },
  { path: "/candidate/:id", component: CandidateOverview },
  // //profile
  { path: "/profile", component: UserProfile },
  //  Reports  --------------------
  { path: "/reports", component: Reports },
  //  Blogs
  { path: "/blogs", component: Blogs },
  { path: "/blogs/add", component: BlogAdd },
  { path: "/blogs/edit/:id", component: BlogEdit },
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

const publicRoutes = [
  { path: "/", component: Login },
  { path: "/applynow/:id", component: JobDetail },
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  // { path: "/register", component: Register },
  { path: "/reset-password/:id", component: ResetPassword },
]

export { authProtectedRoutes, publicRoutes }
