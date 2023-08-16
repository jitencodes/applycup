import PropTypes from "prop-types";
import React, { Component, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Table,
    Badge,
    CardHeader,
    UncontrolledTooltip
} from "reactstrap";
//i18n
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { get } from "../../helpers/api_helper";
import toastr from "toastr";
import { DASHBOARD_REPORT } from "../../helpers/api_url_helper";
import { map } from "lodash";
import Moment from "react-moment";
import TodayCvSource from "./Report/today_cv_sources";
import CandidatePlaced from "./Report/candidate_placed";

function sortName(str) {
    const matches = str.match(/\b(\w)/g);
    return matches.join("")
}

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opening: [],
            candidates: [],
            today_interviews: [],
            cv_sources: [],
            today_cv_sources: [],
            candidates_month_leaderboard: [],
            candidates_placed: [],
            card_data: [{ title: "Openings", iconClass: "bxs-envelope", total: 0, key: 'opening' },
            { title: "Candidates This Month", iconClass: "bxs-group", total: 0, path: 'candidates' },
            { title: "Today's Interviews", iconClass: "bxs-user-detail", total: 0, key: 'candidates_interviews' },
            { title: "CV Sourced", iconClass: "bxs-layer", total: 0, key: 'cv_sources' },
            { title: "Candidates Placed", iconClass: "bx bxs-briefcase-alt-2", total: 0, key: 'candidates_placed' }],
            data_load: false,
            activeTab: "opening",
        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        get(DASHBOARD_REPORT).then(res => {
            if (res.status) {
                let data = res.data
                this.setState({
                    openings_data: data.openings,
                    candidates: data.candidates,
                    today_interviews: data.today_interviews,
                    cv_sources: data.cv_sources,
                    today_cv_sources: data.today_cv_sources,
                    candidates_placed: data.candidates_placed,
                    candidates_month_leaderboard: data.candidates_month_leaderboard,
                }, this.fetchCardData);
            }
        }).catch(err => {
            toastr.error(err.message)
        })
    }

    fetchCardData = () => {
        let openings = this.state.openings_data.total_opening;
        let joining = this.state.candidates.total_candidates;
        let interviews = this.state.today_interviews.total_interviews;
        let cv_sources = this.state.cv_sources.total_cv_source;
        let candidate_placed = this.state.candidates_placed.total_candidates_placed;
        this.setState({
            card_data: [{ title: "Openings", iconClass: "bxs-envelope", total: openings, key: 'opening' },
            { title: "Candidates This Month", iconClass: "bxs-group", total: joining, key: 'candidates' },
            { title: "Today's Interviews", iconClass: "bxs-user-detail", total: interviews, key: 'candidates_interviews' },
            { title: "CV Sourced", iconClass: "bxs-layer", total: cv_sources, key: 'cv_sources' },
            { title: "Candidates Placed", iconClass: "bx bxs-briefcase-alt-2", total: candidate_placed, key: 'candidates_placed' }
            ]
        });
        this.setState({ data_load: true });
    }

    handleTab = (currentTab) => {
        this.setState({ activeTab: currentTab });
    }

    render() {
        const { openings_data, candidates, today_interviews, cv_sources, card_data, data_load, activeTab, today_cv_sources, candidates_placed, candidates_month_leaderboard } = this.state
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        <title>Applycup Hiring Solutions | Top Recruitment Agency | Let's Hire Together</title>
                    </MetaTags>
                    <Container fluid style={{maxWidth:"1320px"}}>
                        {data_load === true &&
                            <Row>
                                {card_data && card_data.map((val, key) => {
                                    return (
                                        <Col key={key} onClick={event => {
                                        }}>
                                            <Card className={`mini-stats-wid ${activeTab === val.key && 'active'}`} onClick={event => {
                                                this.handleTab(val.key)
                                            }}>
                                                <CardBody>
                                                    <div className="d-flex">
                                                        <div className="flex-grow-1">
                                                            <p className="text-muted fw-medium">{val.title}</p>
                                                            <h4 className="mb-0">{val.total}</h4>
                                                        </div>
                                                        <div
                                                            className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                                                            <span className="avatar-title rounded-circle bg-primary"><i
                                                                className={`bx font-size-24 ${val.iconClass}`}></i></span>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    )
                                })}
                            </Row>
                        }
                        {data_load === true && activeTab === "opening" &&
                            <div className={"report-tab"}>
                                <div className={"tab-inner-box"}>
                                    <div className="row">
                                        {openings_data.opening.map((val, key) => {
                                            return (
                                                <div key={key} className="col-lg-4">
                                                    <div className="mini-stats-wid card">
                                                        <div className="card-body">
                                                            <div className="d-flex flex-wrap">
                                                                <div className="me-3"><p className="text-muted mb-2">{val.label}</p><h5
                                                                    className="mb-0">{val.Total}</h5></div>
                                                                <div className="avatar-sm ms-auto">
                                                                    <div
                                                                        className="avatar-title bg-light rounded-circle text-primary font-size-20">
                                                                        <i className="bx bxs-calendar"></i></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        }
                        {activeTab === "candidates" &&
                            <div className={"report-tab"}>
                                <div className={"tab-inner-box"}>
                                    <div className="">
                                        <div className="table-responsive">
                                            <Table className="project-list-table table-nowrap align-middle table-borderless">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Candidate Name</th>
                                                        <th scope="col">Job Role</th>
                                                        <th scope="col">Client Name</th>
                                                        <th scope="col">DOJ</th>
                                                        <th scope="col">Status</th>
                                                        <th scope="col">Recruiters</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {map(candidates.candidates, (candidate, key) => (
                                                        <tr key={key}>
                                                            <th>{key + 1}</th>
                                                            <td>
                                                                <h5 className="text-truncate font-size-14">
                                                                    <Link to="#" className="text-dark">{candidate.name}</Link>
                                                                </h5>
                                                            </td>
                                                            <td>{candidate.job_role}</td>
                                                            <td>{candidate.company}</td>
                                                            <td>{<Moment format={"DD-MM-Y"}>{candidate.created_at}</Moment>}</td>
                                                            <td>{candidate.candidate_status !== null && <Badge className={"bg-dark"}>{candidate.candidate_status}</Badge>}
                                                            </td>
                                                            <td>
                                                                <div className="avatar-group">
                                                                    {map(candidate.recruiters, (item, index) =>
                                                                        <Link to="#" className="d-inline-block" id={"member" + item.id + candidate.job_id+key} key={"_team_" + index}>
                                                                            <div className="avatar-xs">
                                                                                <span className={"avatar-title rounded-circle bg-primary text-white font-size-12"}>
                                                                                    {sortName(item.recruiter)}
                                                                                </span>
                                                                            </div>
                                                                            <UncontrolledTooltip placement="bottom" target={"member" + item.id + candidate.job_id+key}>
                                                                                {item.recruiter} - {item.emp_id}
                                                                            </UncontrolledTooltip>
                                                                        </Link>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {activeTab === "candidates_interviews" &&
                            <div className={"report-tab"}>
                                <div className={"tab-inner-box"}>
                                    <div className="">
                                        <div className="table-responsive">
                                            <Table className="project-list-table table-nowrap align-middle table-borderless">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Candidate Name</th>
                                                        <th scope="col">Mobile</th>
                                                        <th scope="col">Email</th>
                                                        <th scope="col">Job Role</th>
                                                        <th scope="col">Client Name</th>
                                                        <th scope="col">Time</th>
                                                        <th scope="col">Mode</th>
                                                        <th scope="col">Recruiters</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {map(today_interviews.candidates_interviews, (candidate, index) => (
                                                        <tr key={index}>
                                                            <th>{index + 1}</th>
                                                            <td>
                                                                <h5 className="text-truncate font-size-14">
                                                                    <Link to="#" className="text-dark">{candidate.candidate}</Link>
                                                                </h5>
                                                            </td>
                                                            <td>{candidate.mobile}</td>
                                                            <td>{candidate.email}</td>
                                                            <td>{candidate.job_role}</td>
                                                            <td>{candidate.company}</td>
                                                            <td>{candidate.interview_start_time + ' - ' + candidate.interview_end_time}</td>
                                                            <td>{candidate.interview_mode !== null && <Badge className={"bg-secondy"}>{candidate.interview_mode}</Badge>}
                                                            </td>
                                                            <td>
                                                                <div className="avatar-group">
                                                                    {map(candidate.recruiters, (item, index) =>
                                                                        <Link to="#" className="d-inline-block" id={"member" + item.id} key={"_team_" + index}>
                                                                            <div className="avatar-xs">
                                                                                <span className={"avatar-title rounded-circle bg-primary text-white font-size-12"}>
                                                                                    {sortName(item.recruiter)}
                                                                                </span>
                                                                            </div>
                                                                        </Link>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {activeTab === "cv_sources" &&
                            <div className={"report-tab"}>
                                <div className={"tab-inner-box"}>
                                    <Row>
                                        <Col md="4">
                                            <Card>
                                                <CardHeader>CV Sourced</CardHeader>
                                                <CardBody>
                                                    <div className="row">
                                                        {cv_sources.cv_sources.map((val, key) => {
                                                            return (
                                                                <div key={key} className="col-lg-6">
                                                                    <div className="mini-stats-wid card">
                                                                        <div className="card-body">
                                                                            <div className="d-flex flex-wrap">
                                                                                <div className="me-3"><p className="text-muted mb-2">{val.label}</p><h5
                                                                                    className="mb-0">{val.Total}</h5></div>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col md="8">
                                            <Card>
                                                <CardHeader>Today&#39;s CV Sourced</CardHeader>
                                                <CardBody>
                                                    <TodayCvSource data={today_cv_sources} />
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>

                                </div>
                            </div>
                        }
                        {activeTab === "candidates_placed" &&
                            <div className={"report-tab"}>
                                <div className={"tab-inner-box"}>
                                    <Row>
                                        <Col md="4">
                                            <Card>
                                                <CardHeader>Candidates placed</CardHeader>
                                                <CardBody>
                                                    <div className="row">
                                                        {candidates_placed.candidates_placed.map((val, key) => {
                                                            return (
                                                                <div key={key} className="col-lg-6">
                                                                    <div className="mini-stats-wid card">
                                                                        <div className="card-body">
                                                                            <div className="d-flex flex-wrap">
                                                                                <div className="me-3"><p className="text-muted mb-2">{val.label}</p><h5
                                                                                    className="mb-0">{val.Total}</h5></div>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col md="8">
                                            <Card>
                                                <CardHeader>This Month Leaderboard (Placements)</CardHeader>
                                                <CardBody>
                                                    <CandidatePlaced data={candidates_month_leaderboard.recruiters} />
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>

                                </div>
                            </div>
                        }
                        {/*<h4 className="dashboard-title">Assignments <i className="bx bx-info-circle"></i></h4>*/}
                        {/*<div className="assignment-container">*/}
                        {/*    <div className="assignment-list">*/}
                        {/*        <div className="assignment-inner">*/}
                        {/*            <div className="assignment-user">*/}
                        {/*                <span className="fw-bold text-primary">Kamal Kishore</span> was assigned to you*/}
                        {/*                by <span className="fw-bold text-primary">Aman Gangwal</span>*/}
                        {/*            </div>*/}
                        {/*            <div className="candidate-role"><i className="bx bx-briefcase-alt"></i> business*/}
                        {/*                development associate*/}
                        {/*            </div>*/}
                        {/*            <div className="assignment-date-time">*/}
                        {/*                <span className="time"><i className="bx bx-time"></i> 10:08 PM</span>*/}
                        {/*                <span className="date"><i className="bx bx-calendar"></i> 29th Aug, 2022</span>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

Dashboard.propTypes = {
    t: PropTypes.any,
};

export default withTranslation()(Dashboard);
