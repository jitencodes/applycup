import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, Input, Label, DropdownMenu, DropdownToggle, UncontrolledDropdown, UncontrolledTooltip, Modal, Button } from "reactstrap";
import MetaTags from "react-meta-tags";
import Pagination from "components/Common/Pagination";
// import { TableHeader, Search } from "components/Datatable/index";
import useFullPageLoader from "../../components/Common/useFullPageLoader";
import { Link } from "react-router-dom";
import Select from "react-select";
import AddCandidate from "./add-candidate"
import useCandidate from "./useCandidate"
import { get, post, put } from "../../helpers/api_helper";
import { GET_CANDIDATE_DATA, GET_ALL_MASTERS, ADD_CANDIDATE_RESUME, GET_OPENING_WITH_STAGES, UPDATE_CANDIDATE_OPENING, CANDIDATE_FAVOURITE } from "../../helpers/api_url_helper";
import accessToken from "../../helpers/jwt-token-access/accessToken";
import axios from "axios"
import { useForm } from "react-hook-form";
import toastr from "toastr"
import AsyncSelect from 'react-select/async';
function tog_center() {
  // setmodal_center(!modal_center);
  document.body.classList.add("no_padding");
}
const Candidates = () => {
  const [tableData, settableData] = useState([]);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [totalItems, setTotalItems] = useState(0);
  const [dataReload, setDataReload] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [candidate, setCandidate] = useState("");
  const [basePath, setBasePath] = useState("");
  const { isShowing, toggle } = useCandidate();
  const [modal_center, setmodal_center] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");
  const [resume_msg, setResumeMsg] = useState("")
  const [assignCompanyStage, setassignCompanyStage] = useState(false);
  const [NewResume, addNewResume] = useState(false);
  const [Masterloaded, setMasterloaded] = useState(false);
  const [CandidateSource, setCandidateSource] = useState([]);
  const [activeOpening, setActiveOpening] = useState([]);
  const [jobOpening, setJobOpening] = useState("");
  const [formError, setFromError] = useState("");
  const [jobOpeningStage, setJobOpeningStage] = useState("");
  const [OpeningStages, setOpeningStages] = useState([]);
  const [candidateStage, setCandidateStage] = useState("");
  const [filterStages, setStagesFilter] = useState([])
  const [filterSource, setFilterSource] = useState([])
  const [add_by_me, setAddByMe] = useState(false);
  const [unassignfilter, setunassignfilter] = useState(false);
  const [openingfilter, setOpeningfilter] = useState("")
  const [request, setRequest] = useState(false);
  const [role_id, setRoleId] = useState("")
  const [job_screening, setJobScreening] = useState([])
  const [OldJobOpening, setOldJobOpening] = useState("");
  const [BoardReload, setBoardReload] = useState(false)
  const [OpeningSearch, setOpeningSearch] = useState("");
  const [current_openings, setCurrentOpenings] = useState([]);
  const [current_search, setCurrentSearch] = useState("");
  const [current_selected_job, setCurrentSelectedJob] = useState([]);
  const initialsFromString = (fullName) => {
    let arrName = fullName.split(" ");
    let iniName = fullName.charAt(0);
    let iniLname = arrName[arrName.length - 1].charAt(0);
    return iniName + iniLname;
  }
  const dateFormat = (date) => {
    const d = new Date(date);
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    return `${da} ${mo}, ${ye}`
  }

  useEffect(() => {
    if (Masterloaded == false) {
      setMasterloaded(true)
      get(GET_ALL_MASTERS, { params: { masters: 'candidate_source' } }).then(res => {
        if (res.status) {
          let data = res.data;
          setCandidateSource(data.candidate_source)
        }
      }).catch(err => {
        toastr.error(err)
      })
    }
  })

  useEffect(() => {
    if (request === false) {
      setRequest(true)
      loadOpeningWithStage()
    }
  },[OpeningSearch])


  const loadOpeningWithStage = () => {
    const params = { keyword: OpeningSearch};
    get(GET_OPENING_WITH_STAGES, {params: params}).then(res => {
      if (res.status) {
        setActiveOpening(res.data)
      }
    }).catch(err => {
      toastr.error(err)
    })
  }

  const handleInputChange = value => {
    setCurrentSearch(value);
    loadCurrentOptions()
  };

  const handleChange = value => {
    setJobScreening(value.stages)
    setCurrentSelectedJob(value);
  }

  const loadCurrentOptions = () => {
    const params = { keyword: current_search};
    return get(GET_OPENING_WITH_STAGES, {params: params}).then(res => {
      if (res.status) {
        setCurrentOpenings(res.data)
        return res.data
      }
    }).catch(err => {
      toastr.error(err)
    })
  }

  let PageSize = 10;
  useEffect(() => {
    showLoader()
    let filter = {
      stage: filterStages,
      source: filterSource,
      opening: openingfilter,
      add_by_me: add_by_me,
      unassign: unassignfilter
    }
    const params = { keyword: search, length: PageSize, start: currentPage, filter: filter };
    post(GET_CANDIDATE_DATA, params).then(res => {
      if (res) {
        settableData(res.data)
        setTotalItems(res.total)
        setBasePath(res.base_path)
        setRoleId(res.role_id)
        if (OpeningStages.length === 0) {
          let filter_stages = []
          res.data.forEach(val => {
            if (val.stage !== null) {
              filter_stages.indexOf(val.stage) === -1 && filter_stages.push(val.stage)
            }
          });
          setOpeningStages(filter_stages)
        }
        hideLoader()
      }
    }).catch(err => {
      hideLoader()
      toastr.error(err)
    })
  }, [currentPage, search, dataReload, filterStages, filterSource, openingfilter, unassignfilter, add_by_me, BoardReload]);  // pass `value` as a dependency
  const SetFilterStage = (e) => {
    let stages = document.getElementsByClassName('opening-stages')
    let selected_stages = []
    for (var i = 0; i < stages.length; ++i) { if (stages[i].checked === true) { selected_stages.push(stages[i].value) } }
    setStagesFilter(selected_stages)
  }
  const { resumefrom, handleSubmit } = useForm()
  const onSubmit = (data) => {
    let resume = document.getElementById('resume').files[0]
    let fname = resume.name
    let type = fname.slice((Math.max(0, fname.lastIndexOf(".")) || Infinity) + 1);
    if (resume !== undefined && (type === 'pdf' || type ==='png' || type === 'jpg' || type === 'doc' || type === 'docx' || type === 'PDF')) {
      setResumeMsg('')
      const formData = new FormData()
      formData.append('candidate_id', candidate)
      formData.append('resume', resume);
      axios({
        method: "post", url: `${process.env.REACT_APP_APIURL}${ADD_CANDIDATE_RESUME}`, data: formData, headers: {
          'Content-Type': 'application/json',
          "Authorization": accessToken,
        }
      }).then(response => {
        if (response.status) {
          addNewResume(false)
          setCandidate("")
          setDataReload(!dataReload)
          toastr.success(response.message)
        }else{
          toastr.error(response.message)
        }
      }).catch(err => {
        toastr.error(err.message)
      })
    } else {
      setResumeMsg('Please select a valid file')
    }
  }
  const onSubmitStage = (e) => {
    e.preventDefault()
    if (jobOpening === "") {
      setFromError('Select a opening')
      return false
    }
    if (jobOpeningStage === "") {
      setFromError('Select a stage')
      return false
    }
    setFromError('')
    let formData = {
      'candidate_id': candidate,
      'job_id': jobOpening,
      'stage_id': jobOpeningStage,
      'prv_job': OldJobOpening
    }
    put(UPDATE_CANDIDATE_OPENING, formData).then(res => {
      if (res) {
        setCandidate("")
        setDataReload(!dataReload)
        setassignCompanyStage(!assignCompanyStage)
        toastr.success('Candidate opening updated.')
      }
    }).catch(err => {
      hideLoader()
      toastr.error(err)
    })
  }

  const JobStageCall = (job_id) => {
    setJobOpening(job_id)
    activeOpening.forEach(val => {
      if (val.value === job_id) {
        setJobScreening(val.stages)
      }
    })
  }

  const reloadBoard = () => {
    setBoardReload(!BoardReload)
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Manage Candidates | Applycup Hiring Solutions</title>
        </MetaTags>
        <div className="container-fluid">
          <Card className="sticky-main-header">
            <CardBody>
              <div className="row">
                <div className="col-sm-4">
                  <div className="mt-2">
                    <h4 className="m-0">TALENT POOL</h4>
                  </div>
                </div>
                <div className="col-sm-8">
                  <Row className={"justify-content-end g-2"}>
                    <Col md={"8"}>
                      <div className="search-box me-2">
                        <div className="position-relative">
                          <input
                            type="text" onChange={e => { setSearch(e.target.value) }}
                            className="form-control bg-light border-light rounded"
                            placeholder="Search candidates based on name, email, company, location, etc."
                          />
                          <i className="bx bx-search-alt search-icon"></i>
                        </div>
                      </div>
                    </Col>
                    <Col md={"auto"}>
                      <div className="text-sm-end">
                        <button type="button" className="btn-rounded me-2 btn btn-outline-primary" onClick={toggle}><i className="mdi mdi-plus me-1"></i> Add Candidate</button>
                        {/* <button type="button" className="btn-rounded me-2 btn btn-outline-primary"><i className="mdi mdi-plus me-1"></i> Add Stage</button> */}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </CardBody>
          </Card>
          <Row>
            <Col md={4}>
              <div className="sticky-with-banner">
                <h6>FILTER BY</h6>
                <Card>
                  <CardBody>
                    <div className="form-check mb-2">
                      <Input type="checkbox" className="form-check-input" id="UnassociatedCandidates" defaultChecked={unassignfilter} onChange={e => { setunassignfilter(!unassignfilter) }} />
                      <Label className="form-check-label" htmlFor="UnassociatedCandidates">Unassigned Candidates</Label>
                    </div>
                    <div className="form-check mb-2">
                      <Input type="checkbox" className="form-check-input" defaultChecked={add_by_me} onChange={e => { setAddByMe(!add_by_me) }} id="Addedbyme" />
                      <Label className="form-check-label" htmlFor="Addedbyme">Added by me</Label>
                    </div>
                    <hr />
                    <h6 className="card-title mb-3">SOURCE</h6>
                    <Select options={CandidateSource} onChange={e => { setFilterSource(e)}} placeholder={'Select candidate source'} isClearable classNamePrefix="select2-selection" />
                    <hr />
                    {/* <h6 className="card-title mb-3">CANDIDATES</h6>
                    <hr /> */}
                    <h6 className="card-title mb-2">OPENINGS</h6>
                    <input type="search" placeholder="Search" className="form-control mb-3" onChange={e => {setOpeningSearch(e.target.value);setRequest(!request)}}/>
                    <div className="form-check">
                      <Input type="radio" name="opening" defaultChecked={true} value="" onChange={(e) => { setOpeningfilter(e.target.value);loadOpeningWithStage() }} className="form-radio-input" id={'job_id_all'} />
                      <Label className="form-radio-label" htmlFor={'job_id_all'}>All Openings</Label>
                    </div>
                    {request === true && activeOpening.map((val, key) => {
                      return (
                        <div key={key} className="form-check">
                          <Input type="radio" name="opening" value={val.value} onChange={(e) => { setOpeningfilter(e.target.value) }} className="form-radio-input" id={'job_id_' + val.value} />
                          <Label className="form-radio-label" htmlFor={'job_id_' + val.value}>{val.label}</Label>
                        </div>
                      )
                    })}
                    <hr />
                    <h6 className="card-title mb-3">STAGES</h6>
                    {OpeningStages && OpeningStages.map((val, key) => {
                      return (
                        <div className="form-check mb-2" key={key}>
                          <Input type="checkbox" className="form-check-input opening-stages" value={val} id={`stage-${val}`} onChange={e => { SetFilterStage(e) }} />
                          <Label className="form-check-label" htmlFor={`stage-${val}`}>{val}</Label>
                        </div>
                      )
                    })}
                  </CardBody>
                </Card>
              </div>
            </Col>
            <Col md={8}>
              <div className="d-flex justify-content-between">
                <h6>{totalItems} CANDIDATES</h6>
                {/*<h6>BULK ACTIONS</h6>*/}
              </div>
              {/*<Card>*/}
              {/*  <CardBody>*/}
              <div className="">
                {loader && 
                  <div className="wrapper">
                    <div className="wrapper-cell">
                      <div className="image"></div>
                      <div className="text">
                        <div className="text-line"> </div>
                        <div className="text-line"></div>
                        <div className="text-line"></div>
                        <div className="text-line"></div>
                        <div className="text-line"></div>
                        <div className="text-line"></div>
                        <div className="text-line"></div>
                        <div className="text-line"></div>
                      </div>
                    </div>
                    <div className="wrapper-cell">
                      <div className="image"></div>
                      <div className="text">
                        <div className="text-line"> </div>
                        <div className="text-line"></div>
                        <div className="text-line"></div>
                        <div className="text-line"></div>
                        <div className="text-line"></div>
                        <div className="text-line"></div>
                        <div className="text-line"></div>
                        <div className="text-line"></div>
                      </div>
                    </div>
                  </div>}
                {(!loader && tableData.length === 0) && <h4 className="text-center">No data found</h4>}
                {!loader && tableData.map((value, index) => (
                  <Card key={index} className="candidate-card">
                    <CardBody>
                      <div className="d-flex">
                        <div className="avatar-sm me-4">
                          <span className="avatar-title text-avatar-frame font-size-16">
                            {initialsFromString(value.name)}
                          </span>
                        </div>

                        <div className="flex-grow-1 overflow-hidden">
                          <h4 className="text-truncate fw-bold font-size-18">
                            <Link to={`/candidate/${value.id}`} className="text-dark">
                              {value.name}
                            </Link>
                          </h4>
                          <div className="candidate-meta">Source: <span className="text-dark">{value.candidate_source !== null && <span>via <span className="text-primary">{value.candidate_source}</span></span>} by {value.employee}</span></div>
                          <div className="candidate-meta">Job opening: <span className="text-dark"> {value.assign_job_company !== null ? value.opening + ` - ${value.assign_job_company}` : <span className="text-danger">unassigned</span>}</span>{(role_id === "1" || value.job_owner === 'TRUE') && <span onClick={() => { setassignCompanyStage(true); setCandidate(value.id), setModalTitle("Manage Candidate Opening");  JobStageCall(value.current_assign_reqirement_id); setCandidateStage(value.stage_id); setOldJobOpening(value.current_assign_reqirement_id); setCurrentSelectedJob({value:value.current_assign_reqirement_id,label:value.opening, company: value.assign_job_company});setCandidateStage(value.stage_id)}} className="candidate-meta-edit"><i className="bx bxs-pencil"></i> </span>}</div>
                          <div className="candidate-meta">Stage: {value.stage_id !== null ? <span className="text-dark">via {value.stage}</span> : <span className="text-danger">unassigned</span>}</div>
                          <ul className="list-inline mb-0">
                            {value.email !== null &&
                              <li className="list-inline-item me-3" id="dueDate">
                                <i className="bx bx-envelope me-1" /> {value.email}
                              </li>
                            }{value.mobile !== null &&
                              <li className="list-inline-item me-3" id="comments">
                                <i className="bx bx-phone me-1" />{" "} {value.mobile}
                                {value.phone}
                              </li>
                            }
                            {value.current_company !== null &&
                          <li className="list-inline-item">
                            <span className="candidate-meta me-3">Current Company:</span><span style={{textOverflow:"ellipsis",whiteSpace:"nowrap",overflow:"hidden",width:"120px"}}>{value.current_company}</span>
                          </li>
                        }
                          </ul>
                        </div>
                        <div className="candidate-card-tags">
                          <Link to={`/candidate/${value.id}`} className="tags-option" id={`tags-option-1-${value.id}`}><i className="bx bxs-user"></i> <UncontrolledTooltip placement="top" target={`tags-option-1-${value.id}`}>View Profile</UncontrolledTooltip></Link>
                          {/* <div className="tags-option"><i className={value.is_favourite == 1 ? 'bx bxs-star' : 'bx bx-star'}></i></div> */}
                          {value.resume !== null &&
                            <a target={"_blank"} rel="noopener noreferrer" href={basePath + '' + value.resume} className="tags-option" id={`tags-option-3-${value.id}`}><i className="bx bx-file"></i>
                              <UncontrolledTooltip placement="top" target={`tags-option-3-${value.id}`}>Resume</UncontrolledTooltip>
                            </a>
                          }
                          {value.resume !== null &&
                            <div className="tags-option" onClick={() => { addNewResume(true); setCandidate(value.id) }} id={`tags-option-2-${value.id}`}><i className="bx bxs-file-pdf"></i>
                              <UncontrolledTooltip placement="top" target={`tags-option-2-${value.id}`}>Update Resume</UncontrolledTooltip>
                            </div>
                          }
                          {value.resume === null &&
                            <div className="tags-option" onClick={() => { addNewResume(true); setCandidate(value.id) }} id={`tags-option-2-${value.id}`}><i className="bx bx-plus"></i>
                              <UncontrolledTooltip placement="top" target={`tags-option-2-${value.id}`}>Add Resume</UncontrolledTooltip>
                            </div>
                          }
                          {(role_id !== "3" || value.job_owner === 'TRUE') &&
                            <UncontrolledDropdown className="tags-option">
                              <DropdownToggle className="btn btn-sm p-0" color="#eff2f7" type="button">
                                <i className="bx bx-dots-vertical-rounded"></i>
                              </DropdownToggle>
                              <DropdownMenu className="dropdown-menu-end">
                                {/* <Link className="dropdown-item" to="#">Archive</Link> */}
                                <Link className="dropdown-item" to="#" onClick={() => { setassignCompanyStage(true); setCandidate(value.id), setModalTitle("MOVE CANDIDATES TO AN OPENING"); setOldJobOpening(value.current_assign_reqirement_id); JobStageCall(value.current_assign_reqirement_id) }}>Move to Opening</Link>
                                {/* <Link className="dropdown-item text-danger" to="#" onClick={() => { tog_center(); setCandidate(value.name) }}>Reject</Link> */}
                                {value.current_assign_reqirement_id !== null && <Link className="dropdown-item" to={`/openings/board/${value.current_assign_reqirement_id}`}>Go to Job Opening Board</Link>}
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          }
                        </div>
                      </div>
                    </CardBody>
                    <div className="px-4 py-3 border-top">
                      <ul className="list-inline mb-0 candidate-meta-list">
                        {value.location !== null &&
                          <li className="list-inline-item">
                            <span className="text-muted">Location:</span><span style={{textOverflow:"ellipsis",whiteSpace:"nowrap",overflow:"hidden",width:"120px"}}>{value.location}</span>
                          </li>
                        }
                        <li className="list-inline-item">
                          <span className="text-muted">Added on:</span><span>{dateFormat(value.created_at)}</span>
                        </li>
                        {value.total_experience !== null &&
                          <li className="list-inline-item">
                            <span className="text-muted">Experience:</span><span>{value.total_experience && value.total_experience} {value.total_experience == 1 ? 'year' : 'years'}</span>
                          </li>
                        }
                        <li className="list-inline-item">
                          <span className="text-muted">Notice Period:</span><span>{value.notice_period !== null ? value.notice_period : 'N/A'}</span>
                        </li>
                      </ul>
                    </div>
                  </Card>
                ))}
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
              {/*  </CardBody>*/}
              {/*</Card>*/}
            </Col>
          </Row>
          {isShowing === true &&
            <AddCandidate
              isShowing={isShowing}
              reloadBoard={reloadBoard}
              hide={toggle}
            />
          }
          <Modal
            isOpen={modal_center}
            toggle={() => {
              tog_center();
            }}
            centered
          >
            <div className="modal-body">
              <h3>REJECT CANDIDATE</h3>
              <hr />
              <h5 className="mb-3">Are you sure you want to reject <span className="fw-bold">{candidate}</span> ?</h5>
              <div className="mb-3">
                <label htmlFor={"form-label"}>Rejection feedback</label>
                <textarea className="form-control" rows={4}></textarea>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <Button
                  color="primary"
                  outline
                  onClick={() => {
                    setmodal_center(false); setCandidate("")
                  }}
                >
                  CANCEL
                </Button>
                <Button
                  color="primary"
                  className="btn btn-primary "
                >
                  REJECT
                </Button>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={assignCompanyStage}
            toggle={() => {
              tog_center();
            }}
            centered
          >
            <div className="modal-body">
              <h3>{ModalTitle}</h3>
              <hr />
              <form onSubmit={e => onSubmitStage(e)}>
                <Row>
                  <Col md="8" className="mb-3">
                    <label htmlFor="opening">Job Opening*</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      value={current_selected_job}
                      options={current_openings}
                      getOptionLabel={e => e.label+' - '+e.company}
                      // getOptionValue={e => e.value}
                      loadOptions={loadCurrentOptions}
                      onInputChange={handleInputChange}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md="4" className="mb-3">
                    <label htmlFor="opening">Stage*</label>
                    <select className="form-control" defaultValue={candidateStage} onChange={e => { setJobOpeningStage(e.target.value) }}>
                      <option value={""} selected disabled>Select a stage</option>
                      {job_screening.slice(0, -4).map((val, key) => {
                        return <option key={key} value={val.value}>{val.label}</option>
                      })}
                    </select>
                  </Col>
                </Row>
                {formError !== '' && <span className="text-danger font-size-12">{formError}</span>}
                <hr />
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    color="primary"
                    outline
                    onClick={() => {
                      setassignCompanyStage(false); setCandidate("")
                    }}
                  >
                    CANCEL
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    className="btn btn-primary "
                  >
                    UPDATE
                  </Button>
                </div>
              </form>
            </div>
          </Modal>
          <Modal
            isOpen={NewResume}
            toggle={() => {
              tog_center();
            }}
            centered
          >
            <div className="modal-body">
              <h4>Candidate Resume Upload</h4>
              <hr />
              <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div className="form-group mb-3">
                  <label htmlFor="resume">Select resume <sub className="text-danger font-size-10">(Allow pdf,doc,image file and max size 2MB less)</sub></label>
                  <input className="form-control" type={"file"} name="resume" accept="application/pdf,application/msword,image/*,.doc, .docx" id="resume" ref={resumefrom} required={true} />
                  <span className="rtext-danger">{resume_msg}</span>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    type="button"
                    color="primary"
                    outline
                    onClick={() => {
                      addNewResume(false); setCandidate("")
                    }}
                  >
                    CANCEL
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    className="btn btn-primary "
                  >
                    UPLOAD
                  </Button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Candidates;
