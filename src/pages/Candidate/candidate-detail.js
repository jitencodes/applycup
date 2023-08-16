import React, { Component } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { get, put } from "helpers/api_helper";
import { Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import RatingTooltip from "react-rating-tooltip";
import classnames from "classnames"
import { CANDIDATE_DETAIL, EDIT_CANDIDATE_DATA, GET_ALL_MASTERS } from "helpers/api_url_helper";
import Moment from "react-moment";
import moment from "moment";
import Select from "react-select";
import Opinion from "pages/Openings/Stage/opinion";
import { upperCase } from "lodash";
import { Link } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import toastr from "toastr";

class CandidateOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: false,
            is_edit: false,
            submit: false,
            customActiveTab: "1",
            data: [],
            current_city: "",
            notice_period: "",
            prefer_locations: "",
            location_master: [],
            notice_period_master: [],
            data_load: true,
            current_ctc: "",
            expected_ctc: "",
            resume_path: "",
            styleConfig: {
                counterStyle: {
                    height: '20px',
                    backgroundColor: '#F58220',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    color: '#FFF',
                    lineHeight: '20px',
                },
                starContainer: {
                    fontSize: '14px',
                    backgroundColor: '#F2F2F2',
                    height: '20px',
                },
                statusStyle: {
                    height: '20px',
                    backgroundColor: '#F58220',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    color: '#FFF',
                    lineHeight: '28px',
                    minWidth: '100px',
                    fontSize: '18px',
                    textAlign: 'left',
                },
                tooltipStyle: {
                    fontSize: '14px',
                    padding: '5px',
                }
            }
        }
        this.toggleCustom = this.toggleCustom.bind(this)
        this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    }

    componentDidMount() {
        this.loadCandidate()
        this.loadMaster()
    }

    loadCandidate = () => {
        this.setState({ data_load: true })
        get(CANDIDATE_DETAIL, { params: { candidate_id: this.props.match.params.id } }).then(res => {
            if (res.status) {
                let data = res.data;
                this.setState({ data });
                this.setState({ current_city: { value: data.current_location_master_id, label: data.location } })
                this.setState({ notice_period: { value: data.notice_period_master_id, label: data.notice_period } })
                this.setState({
                    candidate_name: data.name,
                    email: data.email,
                    mobile: data.mobile,
                    current_company: data.current_company,
                    total_experience: data.total_experience,
                    relevant_experience: data.relevent_experience,
                    expected_ctc: data.expected_ctc,
                    current_ctc: data.current_ctc,
                    remark: data.remark,
                    resume_path: res.url
                })
                let prefer_locations = []
                data.prefer_locations.map((val) => {
                    prefer_locations.push({ value: val.id, label: val.name })
                })
                this.setState({ prefer_locations })
            }
            this.setState({ data_load: false })
        }).catch(err => {
            toastr.error(err)
            this.setState({ data_load: false })
        })
    }

    handleInput = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    loadMaster = () => {
        get(GET_ALL_MASTERS, { params: { masters: 'location,notice_period' } }).then(res => {
            if (res.status) {
                let data = res.data;
                this.setState({ location_master: data.location, notice_period_master: data.notice_period })
            }
        }).catch(err => {
            toastr.error(err)
        })
    }

    toggleCustom(tab) {
        if (this.state.customActiveTab !== tab) {
            this.setState({
                customActiveTab: tab,
            })
        }
    }

    sortName = (fullName) => {
        let arrName = fullName.split(" ");
        let iniName = fullName.charAt(0);
        let iniLname = arrName[arrName.length - 1].charAt(0);
        return iniName + iniLname;
    }

    handleEdit = (e) => {
        this.setState({
            id: e.id,
            notes: e.remark,
            is_private: e.is_private === "1" ? 1 : 0,
            add_new: true,
            edit: true
        });
    }
    handleDelete = (e) => {
        const formData = {
            "id": e
        }
        put(DELETE_CANDIDATE_OPENING_NOTE, formData).then(response => {
            if (response.status) {
                toastr.success('Notes delete successful.')
            }
        }).catch(err => {
            toastr.error(err.message)
        })
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        if (this.validator.allValid()) {
            let formData = {
                    id: this.props.match.params.id,
                    candidate_name: this.state.candidate_name,
                    email: this.state.email,
                    mobile: this.state.mobile,
                    current_city: this.state.current_city?.value,
                    prefer_locations: this.state.prefer_locations,
                    notice_period: this.state.notice_period?.value,
                    total_experience: this.state.total_experience,
                    relevant_experience: this.state.relevant_experience,
                    expected_ctc: this.state.expected_ctc,
                    current_ctc: this.state.current_ctc,
                    remark: this.state.remark
            }
            this.setState({submit : true})
            put(EDIT_CANDIDATE_DATA, formData).then(res => {
                if (res.status) {
                    this.setState({submit : false})
                    this.setState({ is_edit: false })
                    toastr.success('Candidate update successful.')
                    this.loadCandidate()
                }
            }).catch(err => {
                this.setState({submit : false})
                toastr.error(err)
            })
        } else {
            this.setState({submit : false})
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { data_load, data, is_edit, location_master, notice_period_master, current_city, notice_period, prefer_locations, submit } = this.state
        const starStyle = {}
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Candidate Profile | {process.env.REACT_APP_PROJECTNAME}</title>
                    </MetaTags>
                    <div className="container-fluid">
                        <Row className="justify-content-between">
                            <Col md="4" className="mb-4">
                                <h4 className="mb-0 font-size-20">Candidate Profile</h4>
                            </Col>
                            <Col md="8" className="text-end mb-4">
                                <Nav className="icon-tab nav-justified">
                                    <NavItem>
                                        <NavLink
                                            style={{ cursor: "pointer" }}
                                            className={classnames({
                                                active: this.state.customActiveTab === "1",
                                            })}
                                            onClick={() => {
                                                this.toggleCustom("1")
                                            }}
                                        >
                                            <span className="d-none d-sm-block"><i className="fas fa-user"></i> Profile</span>
                                            <span className="d-block d-sm-none"><i className="fas fa-user"></i></span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            style={{ cursor: "pointer" }}
                                            className={classnames({
                                                active: this.state.customActiveTab === "2",
                                            })}
                                            onClick={() => {
                                                this.toggleCustom("2")
                                            }}
                                        >
                                            <span className="d-none d-sm-block"><i className="far fa-sticky-note"></i> Notes</span>
                                            <span className="d-block d-sm-none"><i className="far fa-sticky-note"></i></span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            style={{ cursor: "pointer" }}
                                            className={classnames({
                                                active: this.state.customActiveTab === "3",
                                            })}
                                            onClick={() => {
                                                this.toggleCustom("3")
                                            }}
                                        >
                                            <span className="d-none d-sm-block"><i className="fab fa-facebook-messenger"></i> Feedback</span>
                                            <span className="d-block d-sm-none"><i className="fab fa-facebook-messenger"></i></span>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Col>
                        </Row>
                        {data_load === true && <div style={{ "height": "100px", "textAlign": "center" }}><h4>Loading...</h4></div>}
                        {!data_load &&
                            <Row>
                                <Col md="3">
                                    <Card>
                                        <CardBody>
                                            {data?.current_apply_job !== null &&
                                                <>
                                                    <Row className="mb-2">
                                                        <Col md="5" className="text-muted">Name:</Col>
                                                        <Col md="7 fw-bold">{data.name}</Col>
                                                    </Row>
                                                    <Row className="mb-2">
                                                        <Col md="5" className="text-muted">Opening:</Col>
                                                        <Col md="7 fw-bold">{data?.current_apply_job?.requirement}</Col>
                                                    </Row>
                                                    <Row className="mb-2">
                                                        <Col md="5" className="text-muted">Stage:</Col>
                                                        <Col md="7 fw-bold">{data?.current_apply_job?.stage === 'Joining' ? <span className="badge bg-primary font-size-12">JOINED</span> : data.current_apply_job.stage}</Col>
                                                    </Row>
                                                    <Row className="mb-2">
                                                        <Col md="5" className="text-muted">Company:</Col>
                                                        <Col md="7 fw-bold">{data.current_apply_job.company}</Col>
                                                    </Row>
                                                </>
                                            }
                                            {data?.current_apply_job === null &&
                                                <>
                                                <h5 className="mb-0">No requirement assigned</h5>
                                                </>
                                            }
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col md="9">
                                    <TabContent activeTab={this.state.customActiveTab}>
                                        <TabPane tabId="1">
                                            <Row>
                                                <Col sm="12">
                                                    <Card>
                                                        <CardBody>
                                                            <div className="d-flex justify-content-between profile-card-header">
                                                                <h4>Profile</h4>
                                                                <div className="candidate-source">
                                                                    SOURCE: via {data.candidate_source} | by {data.employee}
                                                                </div>
                                                            </div>
                                                            <div className="profile-card-block">
                                                                <div className="profile-avatar-block">
                                                                    <span className="avatar-title text-avatar-frame font-size-16">
                                                                        {this.sortName(data.name)}
                                                                    </span>
                                                                </div>
                                                                <form onSubmit={this.handleFormSubmit}>
                                                                    <div className="main-profile-block">
                                                                        <div className="main-profile-row">
                                                                            <div className="main-profile-label">Name: </div>
                                                                            <div className="main-profile-text">{is_edit === false && <>
                                                                                <p>{data.name}</p> <Link className="font-size-16" onClick={() => this.setState({ is_edit: true })} to="#"><i className='bx bxs-edit-alt'></i></Link>
                                                                            </>}
                                                                                {is_edit === true &&
                                                                                    <div>
                                                                                        <input type="text" className="form-control" style={{ maxWidth: "250px" }} name="candidate_name" defaultValue={this.state.candidate_name} />
                                                                                        {this.validator.message("candidate_name", this.state.candidate_name, "required")}
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="main-profile-row">
                                                                            <div className="main-profile-label">Company: </div>
                                                                            <div className="main-profile-text">
                                                                                {is_edit === false &&
                                                                                    <p>{data.current_company !== null ? data.current_company : 'N/A'}</p>
                                                                                }
                                                                                {is_edit === true &&
                                                                                    <div>
                                                                                        <input type="text" className="form-control" style={{ maxWidth: "250px" }} name="candidate_name" defaultValue={this.state.current_company} onChange={this.handleInput} />
                                                                                        {this.validator.message("current_company", this.state.current_company, "required")}
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="main-profile-row">
                                                                            <div className="main-profile-label">Location: </div>
                                                                            <div className="main-profile-text">
                                                                                {is_edit === false &&
                                                                                    <p>{data.location !== null ? data.location : 'N/A'}</p>
                                                                                }
                                                                                {is_edit === true &&
                                                                                    <div style={{ minWidth: "250px", maxWidth: "250px" }}>
                                                                                        <Select isMulti={false} value={current_city} options={location_master} onChange={e => this.setState({ current_city: e })} classNamePrefix="select2-selection" />
                                                                                        {this.validator.message("current_city", this.state.current_city, "required")}
                                                                                    </div>

                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="main-profile-row">
                                                                            <div className="main-profile-label">Preferred Location: </div>
                                                                            <div className="main-profile-text">
                                                                                {is_edit === false &&
                                                                                    <p>{data.prefer_locations.map((val) => val.name).join(", ")}</p>
                                                                                }
                                                                                {is_edit === true &&
                                                                                    <div style={{ minWidth: "250px", maxWidth: "250px" }} >
                                                                                        <Select isMulti={true} value={prefer_locations} options={location_master} onChange={e => this.setState({ prefer_locations: e })} classNamePrefix="select2-selection" />
                                                                                        {this.validator.message("prefer_locations", this.state.prefer_locations, "required")}
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="main-profile-row">
                                                                            <div className="main-profile-label">Notice Period: </div>
                                                                            <div className="main-profile-text">
                                                                                {is_edit === false &&
                                                                                    <p>{data.notice_period}</p>
                                                                                }
                                                                                {is_edit === true &&
                                                                                    <div style={{ minWidth: "250px", maxWidth: "250px" }} >
                                                                                        <Select isMulti={false} value={notice_period} options={notice_period_master} onChange={e => this.setState({ notice_period: e })} classNamePrefix="select2-selection" />
                                                                                        {this.validator.message("notice_period", this.state.notice_period, "required")}
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="main-profile-row">
                                                                            <div className="main-profile-label">Email: </div>
                                                                            <div className="main-profile-text">
                                                                                {is_edit === false &&
                                                                                    <p>{data.email}</p>
                                                                                }
                                                                                {is_edit === true &&
                                                                                    <div>
                                                                                        <input type="email" className="form-control" style={{ maxWidth: "250px" }} name="email" defaultValue={this.state.email} onChange={this.handleInput} />
                                                                                        {this.validator.message("email", this.state.email, "required|email")}
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="main-profile-row">
                                                                            <div className="main-profile-label">Phone Number: </div>
                                                                            <div className="main-profile-text">
                                                                                {is_edit === false &&
                                                                                    <p>{data.mobile}</p>
                                                                                }
                                                                                {is_edit === true &&
                                                                                    <div>
                                                                                        <input type="tel" className="form-control" style={{ maxWidth: "250px" }} name="mobile" defaultValue={this.state.mobile} onChange={this.handleInput} />
                                                                                        {this.validator.message("mobile", this.state.mobile, "required")}
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        {is_edit === false &&
                                                                            <div className="main-profile-row">
                                                                                <div className="main-profile-label">Added on: </div>
                                                                                <div className="main-profile-text"><p>{<Moment format="DD-MM-YYYY">{data.created_at}</Moment>}</p></div>
                                                                            </div>
                                                                        }
                                                                        <div className="main-profile-row">
                                                                            <div className="main-profile-label">Exp (in Years): </div>
                                                                            <div className="main-profile-text">
                                                                                {is_edit === false &&
                                                                                    <p>{data.total_experience !== null ? data.total_experience : 'N/A'}</p>
                                                                                }
                                                                                {is_edit === true &&
                                                                                    <div>
                                                                                        <input type="text" className="form-control" style={{ maxWidth: "250px" }} name="total_experience" defaultValue={data.total_experience} onChange={this.handleInput} />
                                                                                        {this.validator.message("total_experience", this.state.total_experience, "required")}
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="main-profile-row">
                                                                            <div className="main-profile-label">Relevant Tech Stack Exp: </div>
                                                                            <div className="main-profile-text">
                                                                                {is_edit === false &&
                                                                                    <p>{data.relevent_experience !== null ? data.relevent_experience : 'N/A'}</p>
                                                                                }
                                                                                {is_edit === true &&
                                                                                    <div>
                                                                                        <input type="text" className="form-control" style={{ maxWidth: "250px" }} name="relevant_experience" defaultValue={this.state.relevant_experience} onChange={this.handleInput} />
                                                                                        {this.validator.message("relevant_experience", this.state.relevant_experience, "required")}
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="main-profile-row">
                                                                            <div className="main-profile-label">Current CTC: </div>
                                                                            <div className="main-profile-text">
                                                                                {is_edit === false &&
                                                                                    <p>{data.current_ctc !== null ? data.current_ctc : 'N/A'}</p>
                                                                                }
                                                                                {is_edit === true &&
                                                                                    <div>
                                                                                        <input type="text" className="form-control" style={{ maxWidth: "250px" }} name="current_ctc" defaultValue={this.state.current_ctc} onChange={this.handleInput} />
                                                                                        {this.validator.message("current_ctc", this.state.current_ctc, "required")}
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="main-profile-row">
                                                                            <div className="main-profile-label">Expected CTC: </div>
                                                                            <div className="main-profile-text">
                                                                                {is_edit === false &&
                                                                                    <p>{data.expected_ctc !== null ? data.expected_ctc : 'N/A'}</p>
                                                                                }
                                                                                {is_edit === true &&
                                                                                    <div>
                                                                                        <input type="text" className="form-control" style={{ maxWidth: "250px" }} name="expected_ctc" defaultValue={this.state.expected_ctc} onChange={this.handleInput} />
                                                                                        {this.validator.message("expected_ctc", this.state.expected_ctc, "required")}
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="main-profile-row">
                                                                            <div className="main-profile-label">Remark: </div>
                                                                            <div className="main-profile-text">
                                                                                {is_edit === false &&
                                                                                    <p>{data.remark !== null ? data.remark : 'N/A'}</p>
                                                                                }
                                                                                {is_edit === true &&
                                                                                    <textarea className="form-control" style={{ maxWidth: "250px" }} onChange={this.handleInput} name="remark" defaultValue={this.state.remark} />
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        {is_edit === true &&
                                                                            <div className="d-flex justify-content-end">
                                                                                <button className="btn btn-outline-dark me-2" onClick={() => this.setState({ is_edit: false })} type="button">CANCEL</button>
                                                                                <button className="btn btn-primary" disabled={submit} type="submit">{submit ? 'PLEASE WAIT...':'UPDATE'}</button>
                                                                            </div>
                                                                        }
                                                                        <div className="main-profile-row">
                                                                            <div className="main-profile-label">Resume: </div>
                                                                            <div className="main-profile-text">
                                                                                <p>{data.resume !== null ? <a className="btn btn-outline-primary" href={this.state.resume_path+''+data.resume}>Download Resume</a> : '-'}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <Card>
                                                <CardBody>
                                                    <div className="d-flex justify-content-between profile-card-header mb-3">
                                                        <h4>Internal Notes:</h4>
                                                        <div className="candidate-source">
                                                            {data.notes.length}
                                                        </div>
                                                    </div>
                                                    <Row>
                                                        {data.notes.map((val, key) => {
                                                            return (
                                                                <Col key={key} md="6">
                                                                    {key > 1 && <hr />}
                                                                    <div key={key} style={{ border: "1px solid #eee", borderRadius: "4px", padding: "14px 12px" }}>
                                                                        <div className="d-flex justify-content-between">
                                                                            <h6>{val.employee} <span className="fw-light font-size-12">added a {val.is_private === "1" ? 'private' : 'public'} note / {moment(val.created_at, "YYYY-MM-DD hh:mm:ss").fromNow()}</span></h6>
                                                                            {/* <div>
                                                                                <a className='text-danger p-1'><i className='bx bxs-trash' onClick={e => { this.handleDelete(val.id) }}></i></a>
                                                                                <a className='text-success p-1' onClick={e => { this.handleEdit(val) }}><i className='bx bxs-edit-alt'></i></a>
                                                                            </div> */}
                                                                        </div>
                                                                        <p className='text-primary fw-bold font-size-12 mb-2'>{upperCase(val.stage)} | {val.requirement}</p>
                                                                        <div className="font-size-12 text-muted"><h6 className="d-inline">Notes:</h6> {val.remark}</div>
                                                                    </div>
                                                                </Col>
                                                            )
                                                        })}
                                                    </Row>
                                                    {data.notes.length == 0 && <div style={{ "minHeight": "250px", "textAlign": "center", "lineHeight": "250px" }}>No notes has been submitted for this candidate yet.</div>}
                                                </CardBody>
                                            </Card>
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <Card>
                                                <CardBody>
                                                    <div className="d-flex justify-content-between profile-card-header mb-3">
                                                        <h4>Feedback:</h4>
                                                        <div className="candidate-source">
                                                            {data.feedbacks.length}
                                                        </div>
                                                    </div>
                                                    {data_load !== true && data.feedbacks.map((val, key) => {
                                                        return (
                                                            <>
                                                                {key > 0 && <hr />}
                                                                <div className='d-flex justify-content-between'>
                                                                    <h6 className='fw-bold'>{key + 1}. From {val.employee} / {<Moment fromNow>{val.created_at}</Moment>}</h6>
                                                                    <div>
                                                                        {/* <a className='text-danger p-1'><i className='bx bxs-trash' onClick={e => { this.props.deletefeedback(val.id) }}></i></a>
                                                <a className='text-success p-1' onClick={e => { this.props.ManageFeedback(val.candidates_id, val.candidate_name, val.requirement_screening_level_id, 'EDIT', val.id) }}><i className='bx bxs-edit-alt'></i></a> */}
                                                                    </div>
                                                                </div>
                                                                <p className='text-primary font-size-12'>{upperCase(val.stage)} | {val.requirement}</p>
                                                                <p className='mb-1'>Overall Feedback</p>
                                                                <p className='font-size-12 text-muted mb-3'>{val.overall_feedback}</p>
                                                                <Row>
                                                                    <Col md="3">
                                                                        <Opinion rating={val.overall_opinion} />
                                                                    </Col>
                                                                    <Col md="9">
                                                                        <Row className='feedback-rating'>
                                                                            <Col md="6" className='mb-2'>
                                                                                <h6 className='font-size-12 mb-0'>Communication</h6>
                                                                                <RatingTooltip disabled={true} styleConfig={this.state.styleConfig} defaultRating={val.communication} max={5} ActiveComponent={<i className="mdi mdi-star text-primary font-size-12" style={starStyle} />} InActiveComponent={<i className="mdi mdi-star-outline text-muted font-size-12" style={starStyle} />} />
                                                                            </Col>
                                                                            <Col md="6" className='mb-2'>
                                                                                <h6 className='font-size-12 mb-0'>Attitude</h6>
                                                                                <RatingTooltip disabled={true} styleConfig={this.state.styleConfig} defaultRating={val.attitude} max={5} ActiveComponent={<i className="mdi mdi-star text-primary font-size-12" style={starStyle} />} InActiveComponent={<i className="mdi mdi-star-outline text-muted font-size-12" style={starStyle} />} />
                                                                            </Col>
                                                                            <Col md="6" className='mb-2'>
                                                                                <h6 className='font-size-12 mb-0'>Potential To Learn</h6>
                                                                                <RatingTooltip disabled={true} styleConfig={this.state.styleConfig} defaultRating={val.potential_learn} max={5} ActiveComponent={<i className="mdi mdi-star text-primary font-size-12" style={starStyle} />} InActiveComponent={<i className="mdi mdi-star-outline text-muted font-size-12" style={starStyle} />} />
                                                                            </Col>
                                                                            <Col md="6" className='mb-2'>
                                                                                <h6 className='font-size-12 mb-0'>Technical Skills</h6>
                                                                                <RatingTooltip disabled={true} styleConfig={this.state.styleConfig} defaultRating={val.technical_skills} max={5} ActiveComponent={<i className="mdi mdi-star text-primary font-size-12" style={starStyle} />} InActiveComponent={<i className="mdi mdi-star-outline text-muted font-size-12" style={starStyle} />} />
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </>
                                                        )
                                                    })}
                                                    {data.feedbacks.length == 0 && <div style={{ "minHeight": "250px", "textAlign": "center", "lineHeight": "250px" }}>No feedbacks has been submitted for this candidate yet.</div>}
                                                </CardBody>
                                            </Card>
                                        </TabPane>
                                    </TabContent>
                                </Col>
                            </Row>
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

CandidateOverview.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string
        })
    }),
    location: PropTypes.object
}
export default CandidateOverview;