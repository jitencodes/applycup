import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Dropdown, DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Popover,
  PopoverBody,
  Row,
  UncontrolledTooltip
} from "reactstrap";
import MetaTags from "react-meta-tags";
import AddCandidate from "./../Candidate/add-candidate"
import useCandidate from "./../Candidate/useCandidate"
import useFullPageLoader from "../../components/Common/useFullPageLoader";
import { Link } from "react-router-dom";
import { get, post, put } from "../../helpers/api_helper";
import { REQUIREMENT_PUBLISH, REQUIREMENT_UNPUBLISH, ASSIGN_EMPLOYEE, GET_ALL_MASTERS, GET_REQUIREMENT } from "../../helpers/api_url_helper";
import toastr from "toastr";
import Pagination from "../../components/Common/Pagination";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import parseJwt from "components/Common/parseJwt";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function sortName(str) {
  const matches = str.match(/\b(\w)/g);
  return matches.join("")
}
function redirectTo(url) {
  window.location.href = url
}
let employeeSearch = {
  height: "36px",
  border: "1px solid #dfe1e5",
  borderRadius: "24px",
  backgroundColor: "white",
  boxShadow: "rgba(32, 33, 36, 0.28) 0px 1px 6px 0px",
  hoverBackgroundColor: "#eee",
  color: "#212121",
  fontSize: "14px",
  iconColor: "grey",
  lineColor: "rgb(232, 234, 237)",
  placeholderColor: "grey",
  clearIconMargin: '3px 14px 0 0',
  searchIconMargin: '0 0 0 14px'
}
const Openings = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [tableData, settableData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [popoverbottom, setpopoverbottom] = useState(false);
  const [info_dropup, setInfo_dropup] = useState(false);
  const [info_drop_Id, setInfo_drop_Id] = useState("");
  const { isShowing, toggle } = useCandidate();
  const [openedPopoverId, setopenedPopoverId] = useState(false);
  const [isloaded, setIsLoad] = useState(false)
  const [DataRecall, setDataRecall] = useState(false)
  const [requirement_enable, setRequirementEnable] = useState(false)
  const [user_data, set_user_data] = useState(false);
  const [login_user, setLoginUser] = useState();
  const [login_user_role, setLoginUserRole] = useState("");
  const [job_id, setJobId] = useState("")
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const user = localStorage.getItem("authUser") !== "" && JSON.parse(localStorage.getItem("authUser"));
  if (!user_data) {
    set_user_data(true)
    const decodedJwt = parseJwt(user.token);
    if (typeof decodedJwt == "object") {
      if (decodedJwt.role_id === "1") {
        setRequirementEnable(true)
      } else {
        setRequirementEnable(decodedJwt.requirement_enable)
      }
      if (decodedJwt?.id) {
        setLoginUserRole(decodedJwt.role_id)
        setLoginUser(decodedJwt.id)
      }
    }
  }
  let PageSize = 15;
  useEffect(() => {
    showLoader()
    const params = { keyword: search, length: PageSize, start: currentPage, start_date: startDate, end_date : endDate };
    get(GET_REQUIREMENT, { params: params }).then(res => {
      if (res) {
        settableData(res.data)
        setTotalItems(res.total)
      }
      hideLoader()
    }).catch(err => {
      hideLoader()
      toastr.error(err?.response?.data?.message)
    })
  }, [currentPage, search, DataRecall, startDate , endDate])  // pass `value` as a dependency
  let loadMaster = () => {
    get(GET_ALL_MASTERS, { params: { masters: 'employees' } }).then(res => {
      if (res.status) {
        let data = res.data;
        setEmployees(data.employees)
      }
    }).catch(err => {
      toastr.error(err?.response?.data?.message)
    })
  }
  if (isloaded === false) {
    setIsLoad(true)
    loadMaster()
  }
  const reloadBoard = () => {
    setDataRecall(!DataRecall)
  }
  const handleOnSelect = (item) => {
    if (item.value !== undefined && job_id) {
      let formData = {
        'job_id': job_id,
        'employee_id': item.value
      };
      post(ASSIGN_EMPLOYEE, formData).then(response => {
        if (response.status) {
          setDataRecall(!DataRecall)
          toastr.success(response.message)
          setpopoverbottom(!popoverbottom);
          setopenedPopoverId("")
        }
      }).catch(error => {
        setpopoverbottom(!popoverbottom);
        setopenedPopoverId("")
        if (error.response) {
          toastr.error(error.response.data.message)
        }
      })
    }
  }

  // const InactiveJob = (id, type) => {

  // }

  const publish_unpublish = (id, type) => {
    let action = ""
    if (type === "publish") {
      action = REQUIREMENT_PUBLISH
    } else {
      action = REQUIREMENT_UNPUBLISH
    }
    let formData = {
      id: id
    }
    put(action, formData).then(response => {
      if (response.status) {
        setDataRecall(!DataRecall)
        toastr.success(response.message)
      }
    }).catch(error => {
      if (error.response) {
        toastr.error(error.response.data.message)
      }
    })
  }

  const onChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1)
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Openings | {process.env.REACT_APP_PROJECTNAME}</title>
        </MetaTags>
        <div className="container-fluid">
          <Row>
            <Col className="col-12">
              <Row>
                <Col md={4} className="align-self-center">
                  <div className="page-title-box p-0"><h4 className="mb-0 font-size-18">Openings <span className="text-muted">({totalItems})</span></h4></div>
                </Col>
                <Col md={8}>
                  <Row className="justify-content-end g-2">
                    <Col md={'4'}>
                      <DatePicker
                          className={'form-control'}
                          dateFormat="dd-MM-yyyy" placeholderText={"DD-MM-YYYY - DD-MM-YYYY"}
                          selected={startDate}
                          onChange={onChangeDate}
                          startDate={startDate}
                          endDate={endDate}
                          selectsRange
                      />
                    </Col>
                    <Col md={'auto'}>
                      <div className="search-box me-2" style={{ width: '300px' }}>
                        <div className="position-relative">
                          <input
                            onChange={e => {
                              setSearch(e.target.value);
                              setCurrentPage(1);
                            }}
                            type="text"
                            className="form-control border-0"
                            placeholder="Search openings by name, location"
                          />
                          <i className="bx bx-search-alt search-icon" />
                        </div>
                      </div>
                    </Col>
                    {requirement_enable === true &&
                      <Col md={'auto'}>
                        <Link to="/openings/add" className="btn btn-primary btn-rounded"><i className="mdi mdi-plus me-1" />Add Opening</Link>
                      </Col>
                    }
                  </Row>
                </Col>
              </Row>
              <div className="card-container mt-3">
                {!loader && tableData.map((val, key) => {
                  return (
                    <div key={key} className="opening-card">
                      <div className="opening-designation"><h3 className="cursor-pointer" onClick={() => redirectTo(`/openings/detail/${val.id}`)}>{val.requirement_role} <span className={`float-end badge font-size-12 ${val.requirement_status === 'Active' ? 'bg-success':'bg-warning'}`}>{val.requirement_status}</span></h3>
                        <h5 className="text-dark">{val.company}</h5>
                        <div className="opening-exp-n-location-parent">
                          <div className="opening-exp-n-location">
                            <div className="open-exp-n-location">
                              <p><i className="bx bxs-briefcase-alt-2"></i> {val.experience}</p>
                            </div>
                            <div className="open-exp-n-location">
                              <p><i className="mdi mdi-map-marker"></i> {val.location_type} {val.location !== null && ' - ' + val.location}</p>
                            </div>
                          </div>
                          <div className="openings-add-candidate">
                            <div id={'opening-' + val.id}></div>
                            {val.employees.map((value, i) => {
                              return (
                                <div key={i} className="circle" id={`message-${key}-${i}`}><span>{sortName(value.first_name + ' ' + value.last_name)}</span><UncontrolledTooltip placement="top" target={`message-${key}-${i}`}>
                                  {value.first_name + ' ' + value.last_name}
                                </UncontrolledTooltip></div>
                              )
                            })}
                            {(login_user == val.created_by || login_user_role == 1) &&
                              <div className="cursor-pointer circle" id={`add-co-ordinator-${key}`}>
                                <button type="button" onClick={(e) => { setpopoverbottom(!popoverbottom); setopenedPopoverId(val.id); setJobId(val.id) }} className="add-coordinator"><i className="mdi mdi-plus font-size-15"></i>
                                  <UncontrolledTooltip placement="right" target={`add-co-ordinator-${key}`}>
                                    Click to add recruiters for this opening
                                  </UncontrolledTooltip>
                                </button>
                                <Popover
                                  placement="bottom"
                                  isOpen={openedPopoverId === val.id}
                                  target={`add-co-ordinator-${key}`}
                                  toggle={() => {
                                    setpopoverbottom(!popoverbottom);
                                    setopenedPopoverId("")
                                  }}
                                >
                                  <PopoverBody style={{ padding: "10px" }}>
                                    <div className="search-box-employee">
                                      <div className="position-relative">
                                        <ReactSearchAutocomplete
                                          items={employees}
                                          onSelect={handleOnSelect}
                                          fuseOptions={{ keys: ["value", "label"] }}
                                          resultStringKeyName="label"
                                          autoFocus
                                          styling={employeeSearch}
                                        />
                                      </div>
                                    </div>
                                  </PopoverBody>
                                </Popover>
                              </div>
                            }
                          </div>
                          <Dropdown
                            isOpen={info_drop_Id === val.id}
                            direction="left"
                            className="btn-group dropstart"
                            toggle={() => {
                              setInfo_dropup(!info_dropup);
                              info_drop_Id ? setInfo_drop_Id("") : setInfo_drop_Id(val.id);
                            }}
                          >
                            <DropdownToggle className="more-info-btn">
                              <i className="bx bx-dots-vertical-rounded" />
                            </DropdownToggle>
                            <DropdownMenu data-popper-placement="left-start" className="py-0">
                              <DropdownItem onClick={() => redirectTo(`/openings/board/${val.id}`)}>View board</DropdownItem>
                              {requirement_enable === true &&
                                <DropdownItem onClick={() => redirectTo(`/openings/edit/${val.id}`)}>Edit opening</DropdownItem>
                              }
                              <DropdownItem onClick={toggle}>Add candidate</DropdownItem>
                              <DropdownItem>Share job opening</DropdownItem>
                              <DropdownItem onClick={() => redirectTo(`/openings/list/${val.id}`)}>View all applicants</DropdownItem>
                              <DropdownItem onClick={() => redirectTo(`/openings/detail/${val.id}`)}>Opening detail</DropdownItem>
                              {((login_user_role == 1 || (requirement_enable === true && login_user == val.created_by)) && val.post_on_web === "1") &&
                                <DropdownItem onClick={() => publish_unpublish(val.id, 'unpublish')}>Unpublish opening</DropdownItem>
                              }
                              {((login_user_role == 1 || (requirement_enable === true && login_user == val.created_by)) && val.post_on_web === "0") &&
                                <DropdownItem onClick={() => publish_unpublish(val.id, 'publish')}>Publish opening</DropdownItem>
                              }
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </div>
                      <div className="opening-alloments">
                        {val.requirement_screening.map((value, k) => {
                          return (
                            <div key={k} className="opening-alloments-inner">
                              <div><span>{value.total}</span>{value.name}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
                {(!loader && tableData.length) === 0 && <Card>
                  <CardBody style={{minHeight:"200px",background:"#fff",textAlign:'center',padding:"100px 0"}}>
                    <h4 className="text-center mb-3">Currently not available openings</h4>
                    {requirement_enable === true &&
                    <Col md={'auto'}>
                      <Link to="/openings/add" className="btn btn-primary btn-rounded">Add New Opening</Link>
                    </Col>
                  }
                  </CardBody></Card>}
                  {loader && <Card>
                  <CardBody style={{minHeight:"200px",background:"#fff",textAlign:'center',padding:"100px 0"}}>
                    <h4 className="text-center mb-3">Please wait...</h4>
                  </CardBody></Card>}
              </div>
              <Row className="justify-content-center">
                <Col className="col-auto">
                  <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={totalItems}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <AddCandidate
        reloadBoard={reloadBoard}
        isShowing={isShowing}
        hide={toggle}
      />
    </React.Fragment>
  )
}

export default Openings
