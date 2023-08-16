import React, { Component } from 'react';
import MetaTags from "react-meta-tags";
import { Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import toastr from "toastr";
import classnames from "classnames"
import { get } from 'helpers/api_helper';
import { GET_CV_REPORT, GET_PLACEMENT_REPORT } from 'helpers/api_url_helper';
import ReportTable from './cv-report-table';
import CandidatePlacementTable from './candidate-placement';
import CandidateSourceTable from './candidate-source';
import ClientCandidates from './client-candidates';
import RequirementRole from './requirement-role';
import JobPerformance from './job-performance';
import ClientTracking from './client-tracking';
import TeamTracker from './team_tracker';

class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportActiveTab: "1",
            year: new Date().getFullYear(),
            cv_report: [],
            cv_data_load: false,
            placement_report: [],
            placement_data_load: false,
            source_report: [],
            source_data_load: false,
            is_refresh: 1
        }
        this.toggleReport = this.toggleReport.bind(this)
        this.filterYear = this.filterYear.bind(this)
    }
    componentDidMount() {
        // this.loadYear()
        this.loadCVReport()
        this.loadPlacementReport()
    }
    toggleReport(tab) {
        if (this.state.reportActiveTab !== tab) {
            this.setState({
                reportActiveTab: tab,
            })
        }
    }

    filterYear = (e) => {
        this.setState({ year: e.target.value, is_refresh: this.state.is_refresh + 1 }, this.loadCVReport);
    }
    loadCVReport = () => {
        get(GET_CV_REPORT, { params: { year: this.state.year } }).then(res => {
            if (res.status) {
                this.setState({ cv_report: res.data })
                this.setState({ cv_data_load: true });
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }
    loadPlacementReport = () => {
        get(GET_PLACEMENT_REPORT, { params: { year: this.state.year } }).then(res => {
            if (res.status) {
                this.setState({ placement_report: res.data })
                this.setState({ placement_data_load: true });
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }

    render() {
        const { cv_data_load, placement_data_load } = this.state
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Reports | {process.env.REACT_APP_PROJECTNAME}</title>
                    </MetaTags>
                    <div className="px-3">
                        <Card>
                            <Nav tabs className="nav-tabs-custom nav-justified">
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            active: this.state.reportActiveTab === "1",
                                        })}
                                        onClick={() => {
                                            this.toggleReport("1")
                                        }}
                                    >
                                        <span className="d-block d-sm-none"><i className="fas fa-file"></i></span>
                                        <span className="d-none d-sm-block"><i className="fas fa-file"></i> CV Sources</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            active: this.state.reportActiveTab === "2",
                                        })}
                                        onClick={() => {
                                            this.toggleReport("2")
                                        }}
                                    >
                                        <span className="d-block d-sm-none"><i className="far fa-user"></i></span>
                                        <span className="d-none d-sm-block"><i className="far fa-user"></i> Candidate Placement</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            active: this.state.reportActiveTab === "3",
                                        })}
                                        onClick={() => {
                                            this.toggleReport("3")
                                        }}
                                    >
                                        <span className="d-block d-sm-none"><i className="bx bx-walk"></i></span>
                                        <span className="d-none d-sm-block"><i className="bx bx-walk"></i> Candidate Source</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            active: this.state.reportActiveTab === "4",
                                        })}
                                        onClick={() => {
                                            this.toggleReport("4")
                                        }}
                                    >
                                        <span className="d-block d-sm-none"><i className="bx bx-buildings"></i></span>
                                        <span className="d-none d-sm-block"><i className="bx bx-buildings"></i> Clients Candidate</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            active: this.state.reportActiveTab === "5",
                                        })}
                                        onClick={() => {
                                            this.toggleReport("5")
                                        }}
                                    >
                                        <span className="d-block d-sm-none"><i className="bx bx-briefcase-alt-2"></i></span>
                                        <span className="d-none d-sm-block"><i className="bx bx-briefcase-alt-2"></i> Requirement Role</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            active: this.state.reportActiveTab === "6",
                                        })}
                                        onClick={() => {
                                            this.toggleReport("6")
                                        }}
                                    >
                                        <span className="d-block d-sm-none"><i className="bx bx-briefcase-alt-2"></i></span>
                                        <span className="d-none d-sm-block"><i className="bx bx-briefcase-alt-2"></i> Job Performance</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            active: this.state.reportActiveTab === "7",
                                        })}
                                        onClick={() => {
                                            this.toggleReport("7")
                                        }}
                                    >
                                        <span className="d-block d-sm-none"><i className="bx bx-briefcase-alt-2"></i></span>
                                        <span className="d-none d-sm-block"><i className="bx bx-briefcase-alt-2"></i> Client Tracking</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            active: this.state.reportActiveTab === "8",
                                        })}
                                        onClick={() => {
                                            this.toggleReport("8")
                                        }}
                                    >
                                        <span className="d-block d-sm-none"><i className="bx bx-user"></i></span>
                                        <span className="d-none d-sm-block"><i className="bx bx-user"></i> Team Tracking</span>
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Card>
                        <TabContent activeTab={this.state.reportActiveTab} className="text-muted">
                            <TabPane tabId="1">
                                <Card>
                                    <CardBody>
                                        {cv_data_load === true && <ReportTable filterYear={this.filterYear} year={this.state.year} data={this.state.cv_report} />}
                                    </CardBody>
                                </Card>
                            </TabPane>
                            <TabPane tabId="2">
                                <Card>
                                    <CardBody>
                                        {placement_data_load === true && <CandidatePlacementTable filterYear={this.filterYear} year={this.state.year} data={this.state.placement_report} />}
                                    </CardBody>
                                </Card>
                            </TabPane>
                            <TabPane tabId="3">
                                <Card>
                                    <CardBody>
                                        <CandidateSourceTable/>
                                    </CardBody>
                                </Card>
                            </TabPane>
                            <TabPane tabId="4">
                                <Card>
                                    <CardBody>
                                        <ClientCandidates/>
                                    </CardBody>
                                </Card>
                            </TabPane>
                            <TabPane tabId="5">
                                <Card>
                                    <CardBody>
                                        <RequirementRole/>
                                    </CardBody>
                                </Card>
                            </TabPane>
                            <TabPane tabId="6">
                                <Card>
                                    <CardBody>
                                        <JobPerformance/>
                                    </CardBody>
                                </Card>
                            </TabPane>
                            <TabPane tabId="7">
                                <Card>
                                    <CardBody>
                                        <ClientTracking/>
                                    </CardBody>
                                </Card>
                            </TabPane>
                            <TabPane tabId="8">
                                <Card>
                                    <CardBody>
                                        <TeamTracker/>
                                    </CardBody>
                                </Card>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Reports;