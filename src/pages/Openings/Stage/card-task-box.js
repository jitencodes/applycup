import PropTypes from 'prop-types'
import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap";
import "flatpickr/dist/themes/material_blue.css";
import Notes from "./notes";
import parseJwt from "components/Common/parseJwt";
function CardTaskBox(props) {
  const { data } = props
  const [OpenNoteModel, setOpenNoteModel] = useState(false);
  const [actions, setActions] = useState([]);
  const [actionLoaded, setActionLoaded] = useState(false);
  const [next_stage, setNextStage] = useState("");
  const [currentIndex, setCurrentIndex] = useState("");
  const [user_data, set_user_data] = useState(false);
  const [login_user_role, setLoginUserRole] = useState("");
  // const [login_user, setLoginUser] = useState("");
  const user = localStorage.getItem("authUser") !== "" && JSON.parse(localStorage.getItem("authUser"));
  if (!user_data) {
    set_user_data(true)
    const decodedJwt = parseJwt(user.token);
    if (typeof decodedJwt == "object") {
      if (decodedJwt?.id) {
        setLoginUserRole(decodedJwt.role_id)
        // setLoginUser(decodedJwt.id)
      }
    }
  }
  function sortName(str) {
    const matches = str.match(/\b(\w)/g);
    return matches.join("")
  }
  function NoteModel() {
    setOpenNoteModel(true)
  }
  function CloseNoteModel(e) {
    setOpenNoteModel(e)
  }
  let members = props.data
  let board_data = props.action
  if (members && board_data !== undefined && typeof board_data === 'object' && actionLoaded === false) {
    board_data?.columns?.map((val, key) => {
      if (val.id === props.data.stage_id) {
        let actions = {
          "action": val.action,
          "select": val.select_action,
          "hold": val.hold_action,
          "drop": val.drop_action,
          "reject": val.reject_action,
          "accept": val.accept_action,
          "decline": val.decline_action,
          "no_show": val.no_show_action,
          "joined": val.joined_action,
          "abscond": val.abscond_action,
        }
        setCurrentIndex(key + 1)
        setActions(actions)
      }
      if (currentIndex !== "" && currentIndex == key) {
        setNextStage(val.id)
      }
    })
    if(currentIndex){
      setActionLoaded(true)
    }
  }
  return (
    <React.Fragment>
      {actionLoaded === true && <Card style={{ width: "225px", boxShadow: "0 0 10px rgba(116, 116, 116, 0.25)", minHeight: "80px" }}>
        <CardBody className="p-2">
          <div className="d-flex">
            <div className="user-avatar-lg me-3">
              <span className="user-avatar-string">{sortName(members.candidate_name)}</span>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex">
                <div className="flex-grow-1 align-self-center">
                  <div className="text-muted">
                    <h6 className="mb-1" title={members.candidate_name} style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", width: "120px" }}><a target={"_blank"} rel="noopener noreferrer" href={`/candidate/${members.candidate_id}`}>{members.candidate_name}</a></h6>
                  </div>
                </div>

                <UncontrolledDropdown
                  className="ms-2"
                >
                  <DropdownToggle className="btn btn-light btn-sm more-info-btn pe-0 ps-0" color="#eff2f7" type="button">
                    <i className="bx bx-dots-horizontal-rounded me-1"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <Link className="dropdown-item" to={`/candidate/${members.candidate_id}`}>Candidate Detail</Link>
                    {(user_data && login_user_role !== "3") &&
                      <Link className="dropdown-item" to="#" onClick={() => props.MangeCandidate(members, 'favorite')}>{members.is_favourite == 1 ? 'Remove' : 'Mark'} Favourite</Link>
                    }
                    <Link className="dropdown-item" to="#" onClick={() => { NoteModel(members.id, members.candidate_name) }}>Add Note</Link>
                    {(user_data && login_user_role !== "3") &&
                      <>
                        {/* eslint-disable-next-line react/prop-types */}
                        {data.action_allow === "1" && (data.is_action_taken === "1" && <Link className="dropdown-item" to="#" onClick={() => props.scheduleInterview(members.id, members.candidate_name, members.stage_id, members.stage_name, 'EDIT')}>Reschedule Interview</Link>)}
                        {members.total_feedback > 0 && <Link className="dropdown-item" to="#" onClick={() => props.showFeedback(members.candidate_id)}>View Feedback</Link>}
                        <Link className="dropdown-item" to="#" onClick={() => props.ManageFeedback(members.candidate_id, members.candidate_name, members.stage_id, 'ADD', 0)}>Add Feedback</Link>
                      </>
                    }
                    <Link className="dropdown-item" to={`/candidate/${members.candidate_id}`} target="_blank">Edit Details</Link>
                    {(user_data && login_user_role !== "3") &&
                      <>
                        {(actions.select == "1" || actions.hold == "1" || actions.drop == "1" || actions.reject == "1" || actions.accept == "1" || actions.decline == "1" || actions.joined == "1" || actions.no_show == "1" || actions.abscond == "1") &&
                          <div className='dropdown-divider'></div>
                        }
                        {(actions.select === "1" && next_stage !== "") && <Link className="dropdown-item" onClick={() => props.selectAction(members.id, next_stage)} to="#">Select</Link>}
                        {actions.hold === "1" && <Link className="dropdown-item" onClick={() => props.holdAction(members.id, members.stage_id)} to="#">Hold</Link>}
                        {actions.drop === "1" && <Link className="dropdown-item" onClick={() => { props.deleteTask(members.id, members.candidate_name, members.stage_id, 'Drop', true) }} to="#">Drop</Link>}
                        {actions.reject === "1" && <Link className="dropdown-item" onClick={() => { props.deleteTask(members.id, members.candidate_name, members.stage_id, 'Reject', true) }} to="#">Reject</Link>}
                        {actions.accept === "1" && <Link className="dropdown-item" onClick={() => props.selectAction(members.id, next_stage)} to="#">Accept</Link>}
                        {actions.decline === "1" && <Link className="dropdown-item" onClick={() => { props.deleteTask(members.id, members.candidate_name, members.stage_id, 'Decline', false) }} to="#">Decline</Link>}
                        {actions.joined === "1" && <Link className="dropdown-item" to="#" onClick={() => props.selectAction(members.id, next_stage)}>Joined</Link>}
                        {actions.no_show === "1" && <Link className="dropdown-item" onClick={() => { props.deleteTask(members.id, members.candidate_name, members.stage_id, 'No Show', false) }} to="#">No Show</Link>}
                        {actions.abscond === "1" && <Link className="dropdown-item" onClick={() => { props.deleteTask(members.id, members.candidate_name, members.stage_id, 'Abscond', false) }} to="#">Abscond</Link>}
                      </>
                    }
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
              <div className="d-flex" style={{ lineHeight: "30px", minHeight: "30px" }}>
                <div onClick={() => props.MangeCandidate(members, 'favorite')} className="card-coordinator-icon">
                  {members.is_favourite === "1" && <i className="bx bxs-star text-warning" title='Remove Favorite'></i>}
                  {members.is_favourite === "0" && <i className="bx bx-star" title='Make Favorite'></i>}
                </div>
                {(user_data && login_user_role !== "3") &&
                  <>
                    {data.action_allow === "1" && (data.is_action_taken === "1" ? <div onClick={() => props.scheduleInterview(members.id, members.candidate_name, members.stage_id, members.stage_name, 'EDIT')} title="Reschedule Interview" className="card-coordinator-icon"><i className="bx bx-calendar"></i></div> : <div onClick={() => props.scheduleInterview(members.id, members.candidate_name, members.stage_id, members.stage_name, 'ADD')} title="Schedule Interview" className="card-coordinator-icon"><i className="bx bx-calendar-plus"></i></div>)}
                    {actions.reject === "1" && <div className="card-coordinator-icon"><i className="bx bx-x-circle" title='Reject' onClick={() => { props.deleteTask(members.id, members.candidate_name) }}></i></div>}
                  </>
                }
              </div>
              {((data.action_allow === "1" && (data.is_action_taken === "1" || data.is_action_taken === "0")) || (data.is_hold === "1")) &&
                <div className='border-top-bar' style={{ fontSize: "80%", textAlign: "right" }}>
                  {(data.action_allow === "1" && data.is_action_taken === "1") && <span className='text-primary'>Interview scheduled</span>}
                  {(data.action_allow === "1" && data.is_action_taken === "0") && <span className='text-primary'>Interview not scheduled</span>}
                  {data.is_hold === "1" && <span className='text-danger'>Hold</span>}
                </div>
              }
            </div>
          </div>
        </CardBody>
      </Card>
      }
      {OpenNoteModel === true && <Notes OpenNoteModel={OpenNoteModel} {...members} CloseNoteModel={CloseNoteModel} />}
    </React.Fragment>
  )
}

CardTaskBox.propTypes = {
  data: PropTypes.object,
  job: PropTypes.string,
  action: PropTypes.object,
  MangeCandidate: PropTypes.func,
  ManageFeedback: PropTypes.func,
  deleteTask: PropTypes.func,
  showFeedback: PropTypes.func,
  selectAction: PropTypes.func,
  holdAction: PropTypes.func,
  scheduleInterview: PropTypes.func
}

export default CardTaskBox
