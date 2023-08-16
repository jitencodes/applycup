export const DASHBOARD_REPORT = "/dashboard/get"
export const EXPORT_MASTER = "/Import_data/post"
// skills -----------
export const GET_SKILLS = "/skills/get";
export const ADD_SKILL = "/skills/post";
export const EDIT_SKILL = "/skills/put";
// currency master
export const GET_CURRENCY = "/salary_currency_master/get";
export const ADD_CURRENCY = "/salary_currency_master/post";
export const EDIT_CURRENCY = "/salary_currency_master/put";
// candidate source
export const GET_CANDIDATE_SOURCE = "/candidate_source/get"
export const ADD_CANDIDATE_SOURCE = "/candidate_source/post"
export const EDIT_CANDIDATE_SOURCE = "/candidate_source/put"
// client source
export const GET_CLIENT_SOURCE = "/client_source/get"
export const ADD_CLIENT_SOURCE = "/client_source/post"
export const EDIT_CLIENT_SOURCE = "/client_source/put"
//  qualifications
export const GET_QUALIFICATION = "/qualification/get"
export const ADD_QUALIFICATION = "/qualification/post"
export const EDIT_QUALIFICATION = "/qualification/put"
// client status master
export const GET_CLIENT_STATUS = "/client_status_master/get"
export const ADD_CLIENT_STATUS = "/client_status_master/post"
export const EDIT_CLIENT_STATUS = "/client_status_master/put"
// requirement status master
export const GET_REQUIREMENT_STATUS = "/requirement_status_master/get"
export const ADD_REQUIREMENT_STATUS = "/requirement_status_master/post"
export const EDIT_REQUIREMENT_STATUS = "/requirement_status_master/put"
// candidate status
export const GET_CANDIDATE_STATUS = "/candidate_status_master/get"
export const ADD_CANDIDATE_STATUS = "/candidate_status_master/post"
export const EDIT_CANDIDATE_STATUS = "/candidate_status_master/put"
// roles
export const GET_REQUIREMENT_ROLES = "/requirement_role_master/get"
export const ADD_REQUIREMENT_ROLES = "/requirement_role_master/post"
export const EDIT_REQUIREMENT_ROLES = "/requirement_role_master/put"
// requirement post
export const GET_REQUIREMENT = "/requirements/get"
export const ADD_REQUIREMENT = "/requirements/post"
export const EDIT_REQUIREMENT = "/requirements/put"
export const REQUIREMENT_DETAIL = "/requirements/job_detail"
export const ASSIGN_EMPLOYEE = "/requirements/assign_employee"
export const GET_OPENING_WITH_STAGES = "/requirements/opening_with_stages"
// manage boarding
export const JOB_BOARDING = "/requirements/job_boarding"
export const CANDIDATE_FAVOURITE = "/requirements/candidate_favourite"
export const JOB_STAGE_UPDATE = "/requirements/screening_levels"
export const JOB_STAGE_ADD = "/requirements/screening_levels_add"
// clients
export const GET_CLIENTS = "/clients/get"
export const ADD_CLIENTS = "/clients/post"
export const EDIT_CLIENTS = "/clients/put"
// Notice period
export const GET_NOTICE_PERIOD = "/notice_period/get"
export const ADD_NOTICE_PERIOD = "/notice_period/post"
export const EDIT_NOTICE_PERIOD = "/notice_period/put"
// get all master data (masters)
export const GET_ROLES = "/roles/get"
export const GET_EMPLOYMENT_TYPE = "/employment_type/get"
export const GET_ALL_MASTERS = "/master_data/get"
export const GET_ACTIVE_COMPANY = "/clients/active"
// Mange candidate data
export const GET_CANDIDATE_DATA = "/candidate_data/talent_pool"
export const ADD_CANDIDATE_DATA = "/candidate_data/post"
export const EDIT_CANDIDATE_DATA = "/candidate_data/put"
export const ADD_CANDIDATE_RESUME = "/candidate_data/resume"
export const UPDATE_CANDIDATE_OPENING = "/candidate_data/assign_opening"
export const JOB_STAGE_MOVE = "/candidate_data/job_stage_move"
export const CANDIDATE_STAGE_MOVE = "/candidate_data/candidate_stage_move"
export const CANDIDATE_REJECT = "/candidate_data/candidate_reject"
export const CANDIDATE_HOLD = "/candidate_data/candidate_hold"
// Candidate feedback -----
export const GET_CANDIDATE_FEEDBACK = "/candidate_feedback/get"
export const GET_FEEDBACK_BY_ID = "/candidate_feedback/feedback_by_id"
export const MANAGE_CANDIDATE_FEEDBACK = "/candidate_feedback/manage_feedback"
export const DELETE_CANDIDATE_FEEDBACK = "/candidate_feedback/feedback_delete"
// Candidate interview manage
export const CNADIDATE_INTERVIEW_SECHUDLE = "/candidate_interview/post"
export const GET_CANDIDATE_INTERVIEW = "/candidate_interview/get"
// Opening Candidate 
export const CANDIDATE_DETAIL = "/candidate_data/candidate_detail"
export const GET_OPENING_CANDIDATES = "/candidate_data/candidate_assign_openings"
export const UPDATE_CANDIDATE_STAGES = "/candidate_data/stage_move_by_id"
// Opening Candidate notes
export const GET_CANDIDATE_OPENING_NOTE = "/requirement_candidate_notes/get"
export const ADD_CANDIDATE_OPENING_NOTE = "/requirement_candidate_notes/post"
export const EDIT_CANDIDATE_OPENING_NOTE = "/requirement_candidate_notes/put"
export const DELETE_CANDIDATE_OPENING_NOTE = "/requirement_candidate_notes/delete"
// Reports 
export const GET_CV_REPORT = "/reports/cv_report"
export const GET_PLACEMENT_REPORT = "/reports/candidates_placement"
export const GET_CANDIDATE_SOURCE_REPORT = "/reports/candidate_source"
export const GET_CLIENT_CANDIDATES_REPORT = "/reports/clients_candidate_assign"
export const GET_REQUIREMENT_ROLE_REPORT = "/reports/requirement_role"
export const GET_JOB_PREFORM = "/reports/job_performance"
export const GET_JOB_PREFORM_QUICK_VIEW = "/reports/quick_view"
export const GET_CLIENT_TRACKING = "/reports/client_tracking"
export const GET_CLIENT_QUICK_VIEW = "/reports/client_quick_view"
export const GET_TEAM_TRACKER = "/reports/team_tracker"
// Blogs 
export const GET_BLOGS = "/blogs/get"
export const ADD_BLOGS = "/blogs/post"
export const EDIT_BLOGS = "/blogs/edit"
// Manage requirement
export const REQUIREMENT_PUBLISH = "/requirements/publish"
export const REQUIREMENT_UNPUBLISH = "/requirements/unpublish"
// Download csv data 
export const EXPORT_JOB_BOARD = "/requirements/export_job_boarding"
// User forget password
export const FORGET_PASSWORD = "/auth/forget_password"
export const RESET_PASSWORD = "/auth/reset_password"
export const VERIFY_LINK = "/auth/verify_reset_link"
// User profile 
export const CHANGE_PASSWORD = "/users/change_password"
export const UPDATE_PROFILE = "/users/profile_update"