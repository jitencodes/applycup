import React, { Component } from "react";
import MetaTags from "react-meta-tags";
import { Badge, Card, CardBody, Col, Row } from "reactstrap";
import PropTypes from "prop-types";
import { get } from "../../helpers/api_helper";
import toastr from "toastr";
import { REQUIREMENT_DETAIL } from "../../helpers/api_url_helper";
import Moment from "react-moment";
import { Link } from "react-router-dom";
class OpeningDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            opening_name: "",
            company_name: "",
            job_type: "",
            number_of_vacancy: "",
            experience_type: "",
            is_industry_standard: "",
            min_experience: "",
            max_experience: "",
            min_salary: "",
            max_salary: "",
            salary_currency: "",
            notice_period: "",
            job_description: "",
            requirement_status: "",
            location_type: "",
            location_id: [],
            job_role: [],
            skills: [],
            locations: [],
            qualification: [],
            assigned_to: [],
            created_by: [],
            created_at: "",
            data_loaded: false
        }
    }
    componentDidMount() {
        this.loadJobDetail()
    }
    loadJobDetail = () => {
        get(REQUIREMENT_DETAIL, { params: { job_id: this.props.match.params.id } }).then(res => {
            if (res.status) {
                let data = res.data
                this.setState({
                    opening_name: data.role,
                    company_name: { value: data.company_id, label: data.company_name },
                    job_type: { value: data.employement_type, label: data.employement_type_name },
                    number_of_vacancy: data.vacancy_count,
                    experience_type: data.experience_type,
                    is_industry_standard: data.is_industry_standard,
                    min_experience: data.min_exp,
                    max_experience: data.max_exp,
                    min_salary: data.min_salary,
                    max_salary: data.max_salary,
                    salary_currency: { value: data.currency_id, label: data.currency_name },
                    notice_period: { value: data.notice_period_id, label: data.notice_period_name },
                    job_description: data.requirement_description,
                    requirement_status: { value: data.req_status_id, label: data.req_status_name },
                    location_type: data.location_type,
                    location_id: data.locations,
                    locations: data.locations,
                    job_role: { value: data.role_id, label: data.role },
                    skills: data.skills,
                    qualification: data.qualifications,
                    assigned_to: data.employees,
                    is_approved: data.is_approved,
                    post_on_web: data.post_on_web,
                    created_by: { value: data.created_by, label: data.created_by_name },
                    status: data.post_on_web,
                    created_at: data.created_at
                })
                this.setState({ data_loaded: true });
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }
    render() {
        const { id, opening_name, company_name, job_type, number_of_vacancy, experience_type, is_industry_standard, min_experience, max_experience, min_salary, max_salary, salary_currency, notice_period, job_description, requirement_status, location_type, locations, job_role, skills, qualification, assigned_to, is_approved, created_at, post_on_web } = this.state
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>{opening_name} | {process.env.REACT_APP_PROJECTNAME}</title>
                    </MetaTags>
                    <div className="container-fluid">
                        <Row>
                            <Col md="12">
                                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 className="mb-0 font-size-18">{opening_name}s</h4>
                                    <div className="page-title-right">
                                        <nav className="" aria-label="breadcrumb">
                                            <ol className="breadcrumb m-0">
                                                <li className="breadcrumb-item"><a href="/openings">Openings</a></li>
                                                <li className="active breadcrumb-item" aria-current="page"><a href="/job-details">{opening_name}</a></li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        {this.state.data_loaded === true && <Row>
                            <Col xl="3">
                                <Card>
                                    <CardBody>
                                        <h5 className="fw-semibold">Overview</h5>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <th scope="col">Job Title</th>
                                                        <td scope="col">{opening_name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Experience:</th>
                                                        <td>{experience_type == 1 ? 'Fresher' : min_experience + ' - ' + max_experience + ' Years'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Vacancy</th>
                                                        <td>{number_of_vacancy}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Job Type</th>
                                                        <td><span className="badge badge-soft-success">{job_type.label}</span></td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Salary</th>
                                                        <td>{is_industry_standard == 2 ? 'As per industry' : salary_currency.label + ' ' + min_salary + '-' + max_salary}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Status</th>
                                                        <td><span className="badge badge-soft-info">{requirement_status.label}</span></td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Notice Period</th>
                                                        <td>{notice_period.label}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Verified</th>
                                                        <td>{is_approved == 1 ? 'Yes' : 'No'}</td>
                                                    </tr>

                                                    <tr>
                                                        <th scope="row">Website on Post</th>
                                                        <td>{post_on_web == 1 ? 'Yes' : 'No'}</td>
                                                    </tr>

                                                    <tr>
                                                        <th scope="row">Posted Date</th>
                                                        <td>{<Moment format="DD-MM-YYYY">{created_at}</Moment>}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="text-center"><Link to={`/openings/board/${id}`} className="btn btn-primary">Go to Job Opening Board</Link></div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xl="9">
                                <Card>
                                    <div className="border-bottom card-body">
                                        <div className="d-flex">
                                            <div className="flex-grow-1">
                                                <h5 className="fw-semibold">{opening_name}</h5>
                                                <ul className="list-unstyled hstack gap-2 mb-0">
                                                    <li><i className="bx bx-building-house"></i> <span className="text-muted">{company_name.label}</span>
                                                    </li>
                                                    <li><i className="bx bx-map"></i> {location_type == 2 && locations.map((val, key) => { return (<span key={key} className="text-muted">{key > 0 && ', '}{val.label}</span>) })}{location_type == 1 && 'Remote'}</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <Link to={`/openings/edit/${id}`}><i className="bx bx-pencil"></i></Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="fw-semibold mb-3">Qualifications</h5>
                                        <div className="mb-4">{qualification.map((val, key) => { return (<span key={key} className="font-size-13 badge badge-soft-primary me-1">{val.label}</span>) })}</div>
                                        <h5 className="fw-semibold mb-3">Assign with</h5>
                                        <div className="mb-4">{assigned_to.map((val, key) => { return (<span key={key} className="font-size-13 badge badge-soft-dark me-1">{val.label}</span>) })}</div>
                                        <h5 className="fw-semibold mb-3">Description</h5>
                                        <div dangerouslySetInnerHTML={{ __html: job_description }} />
                                        <h5 className="fw-semibold mb-1 mt-4">Skills</h5>
                                        <div>{skills.map((skill, key) => { return (<span key={key} className="badge badge-soft-warning me-1">{skill.label}</span>) })}</div>
                                        <div className="mt-4">
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item mt-1">Share this job:</li>
                                                <li className="list-inline-item mt-1"><a className="btn btn-outline-primary btn-hover"
                                                    href={`https://www.facebook.com/sharer/sharer.php?u=https%3A//applycup.com/jobs/details/${id}`}><i className="uil uil-facebook-f"></i> Facebook</a></li>
                                                <li className="list-inline-item mt-1"><a className="btn btn-outline-primary btn-hover"
                                                    href={`https://twitter.com/intent/tweet?text=https%3A//applycup.com/jobs/details/${id}`}><i className="uil uil-twitter"></i> Twitter</a></li>
                                                <li className="list-inline-item mt-1"><a className="btn btn-outline-success btn-hover"
                                                    href={`https://www.linkedin.com/shareArticle?mini=true&url=https%3A//applycup.com/jobs/details/${id}&title=${job_role}&summary=${company_name}&source=applycup`}><i className="uil uil-linkedin-alt"></i> linkedin</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        }
                        {this.state.data_loaded === false && <div className="py-5 text-center"><h4 className="fw-bold">Please wait...</h4></div>}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
OpeningDetail.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string
        })
    }),
    location: PropTypes.object
}
export default OpeningDetail;