import React from "react";
import MetaTags from "react-meta-tags";
import { Button, Card, CardBody, CardTitle, Col, Container, Label, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { get, put } from "../../helpers/api_helper";
import { UPDATE_USER, GET_LOCATION, GET_USERS } from "../../helpers/url_helper";
import SimpleReactValidator from "simple-react-validator";
import toastr from "toastr";
import PropTypes from "prop-types";
import { GET_EMPLOYMENT_TYPE, GET_ROLES } from "../../helpers/api_url_helper";

class UserEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location_master: [],
            employment_types: [{ value: "1", label: "Full Time" }, { value: "2", label: "Part Time" }, { value: "3", label: "Internship" }, { value: "4", label: "Freelancer" }],
            roles: [{ value: "1", label: "Super Admin" }, { value: "2", label: "Team Lead" }, { value: "3", label: "Recruiter" }],
            role: "",
            role_id: "",
            employment_type: "",
            employment_type_id: "",
            department: "",
            first_name: "",
            last_name: "",
            emp_id: "",
            location: "",
            mobile: "",
            phone: "",
            email: "",
            dob: "",
            remark: "",
            status: false,
            dataLoaded: false,
            requirement_enable: false,
            handleResponse: null,
            submit: false
        };
        this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    }

    componentDidMount() {
        this.loadMaster()
        this.loadUserDetail()
    }
    loadMaster = () => {
        get(GET_LOCATION, { params: { status: 1 } }).then(res => {
            if (res) {
                let list = [];
                for (let i = 0; i < res.data.length; i++) {
                    list.push({ value: res.data[i].id, label: res.data[i].name })
                }
                this.setState({ location_master: list })
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
        get(GET_ROLES, { params: { status: 1 } }).then(res => {
            if (res.data) {
                this.setState({ roles: res.data })
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
        get(GET_EMPLOYMENT_TYPE, { params: { status: 1 } }).then(res => {
            if (res.data) {
                this.setState({ employment_types: res.data })
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }
    loadUserDetail = () => {
        get(GET_USERS, { params: { id: this.props.match.params.id } }).then(res => {
            if (res) {
                this.setState({
                    role: { value: res.role_id, label: res.role_name },
                    role_id: res.role_id,
                    employment_type: { value: res.employement_type, label: res.employment_type },
                    employment_type_id: res.employement_type,
                    department: res.department,
                    first_name: res.first_name,
                    last_name: res.last_name,
                    emp_id: res.emp_id,
                    location: { value: res.location, label: res.location_name },
                    mobile: res.mobile,
                    phone: res.mobile_2,
                    email: res.email,
                    dob: res.dob,
                    requirement_enable: res.requirement_enable ? true : false,
                    remark: res.remark,
                    status: (res.status === "1" ? true : false),
                    dataLoaded: true
                })
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
            // eslint-disable-next-line react/prop-types
            const { history } = this.props;
            // eslint-disable-next-line react/prop-types
            history.push("/user-boarding");
        })
    }
    handleLocation = selected => {
        this.setState({ location: selected })
    }
    handleRole = selected => {
        this.setState({ role: selected, role_id: selected.value })
    }
    handleEmployment = selected => {
        this.setState({ employment_type: selected, employment_type_id: selected.value })
    }
    handleInput = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };
    handleFormSubmit = (e) => {
        e.preventDefault();
        if (this.validator.allValid()) {
            var data = {
                "id": parseInt(this.props.match.params.id),
                "first_name": this.state.first_name,
                "last_name": this.state.last_name,
                "emp_id": this.state.emp_id,
                "mobile": this.state.mobile,
                "email": this.state.email,
                "mobile_2": this.state.phone,
                "dob": this.state.dob,
                "department": this.state.department,
                "employement_type": this.state.employment_type_id,
                "role_id": this.state.role_id,
                "location": this.state.location.value,
                "remark": this.state.remark,
                "requirement_enable": this.state.requirement_enable,
                "status": this.state.status
            };
            this.setState({ submit: true });
            put(UPDATE_USER, data).then(response => {
                if (response.status) {
                    this.setState({ submit: false });
                    toastr.success("User update successful.");
                    // eslint-disable-next-line react/prop-types
                    const { history } = this.props;
                    // eslint-disable-next-line react/prop-types
                    history.push("/user-boarding");
                }
            }).catch(err => {
                toastr.error(err?.response?.data?.message);
                this.setState({ submit: false });
            });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    };

    render() {
        const { submit, dataLoaded } = this.state;
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>
                            Manage Coupons | {process.env.REACT_APP_PROJECTNAME}
                        </title>
                    </MetaTags>
                    <Container fluid={true}>
                        <Breadcrumbs title="User Boarding" path="/user-boarding" breadcrumbItem="Add User" />
                        {dataLoaded === true &&
                            <Row>
                                <Col xl="12">
                                    <Card>
                                        <CardBody>
                                            <form onSubmit={this.handleFormSubmit}>
                                                <Row>
                                                    <Col md="3" className="mb-3">
                                                        <label className="control-label">Role</label>
                                                        <Select
                                                            value={this.state.role}
                                                            isMulti={false}
                                                            onChange={this.handleRole}
                                                            options={this.state.roles}
                                                            classNamePrefix="select2-selection"
                                                        />
                                                        {this.validator.message("role", this.state.role, "required")}
                                                    </Col>
                                                    <Col md="3" className="mb-3">
                                                        <label className="control-label">Employment Type</label>
                                                        <Select
                                                            value={this.state.employment_type}
                                                            isMulti={false}
                                                            onChange={this.handleEmployment}
                                                            options={this.state.employment_types}
                                                            classNamePrefix="select2-selection"
                                                        />
                                                        {this.validator.message("employment_type", this.state.employment_type, "required")}
                                                    </Col>
                                                    <Col md="3" className="mb-3">
                                                        <label className="control-label">Department</label>
                                                        <input name="department" placeholder="Type Department Name" defaultValue={this.state.department} type="text" className={"form-control"}
                                                            onChange={this.handleInput} />
                                                        {this.validator.message("department", this.state.department, "required")}
                                                    </Col>
                                                    <Col md={12}><CardTitle className="text-danger">User Details</CardTitle><hr /></Col>
                                                    <Col md="auto" className="mb-3">
                                                        <Label htmlFor="first_name">First Name*</Label>
                                                        <input name="first_name" placeholder="Type First Name" defaultValue={this.state.first_name} type="text" className={"form-control"}
                                                            onChange={this.handleInput} />
                                                        {this.validator.message("first_name", this.state.first_name, "required|string")}
                                                    </Col>
                                                    <Col md="auto" className="mb-3">
                                                        <Label htmlFor="last_name">Last Name</Label>
                                                        <input name="last_name" placeholder="Type Last Name" defaultValue={this.state.last_name} type="text" className={"form-control"}
                                                            onChange={this.handleInput} />
                                                    </Col>
                                                    <Col md="auto" className="mb-3">
                                                        <Label htmlFor="username">Employee ID</Label>
                                                        <input name="emp_id" placeholder="Type Employee ID" type="text" defaultValue={this.state.emp_id} className={"form-control"}
                                                            onChange={this.handleInput} />
                                                        {this.validator.message("emp_id", this.state.emp_id, "required")}
                                                    </Col>
                                                    <Col md="auto" className="mb-3">
                                                        <Label htmlFor="mobile">Mobile</Label>
                                                        <input name="mobile" placeholder="Type Mobile Number" defaultValue={this.state.mobile} type="tel" className={"form-control"}
                                                            onChange={this.handleInput} />
                                                        {this.validator.message("mobile", this.state.mobile, "required|phone")}
                                                    </Col>
                                                    <Col md="auto" className="mb-3">
                                                        <Label htmlFor="phone">Phone</Label>
                                                        <input name="phone" placeholder="Type Phone Number" type="tel" defaultValue={this.state.phone} className={"form-control"}
                                                            onChange={this.handleInput} />
                                                        {this.validator.message("phone", this.state.phone, "phone")}
                                                    </Col>
                                                    <Col md="auto" className="mb-3">
                                                        <Label htmlFor="email">Email</Label>
                                                        <input name="email" placeholder="Type Email Address" type="email" defaultValue={this.state.email} className={"form-control"}
                                                            onChange={this.handleInput} />
                                                        {this.validator.message("email", this.state.email, "required|email")}
                                                    </Col>
                                                    <Col md="auto" className="mb-3">
                                                        <Label htmlFor="dob">Date Of Birth</Label>
                                                        <input name="dob" placeholder="Select Date Of Birth" type="date" defaultValue={this.state.dob} className={"form-control"}
                                                            onChange={this.handleInput} />
                                                        {this.validator.message("dob", this.state.dob, "required")}
                                                    </Col>
                                                    <Col md="4" className="mb-3">
                                                        <label className="control-label">Location</label>
                                                        <Select
                                                            value={this.state.location}
                                                            isMulti={false}
                                                            onChange={this.handleLocation}
                                                            options={this.state.location_master}
                                                            classNamePrefix="select2-selection"
                                                        />
                                                        {this.validator.message("location", this.state.location, "required")}
                                                    </Col>
                                                    <Col md="6" className="mb-3">
                                                        <Label htmlFor="remark">Remark</Label>
                                                        <input name="remark" placeholder="Type Remark" type="text" defaultValue={this.state.remark} className={"form-control"}
                                                            onChange={this.handleInput} />
                                                    </Col>
                                                    <Col md="auto" className="mb-3 align-self-end">
                                                        <div className="form-check form-switch form-switch-lg">
                                                            <input type="checkbox" className="form-check-input" id="requirement_enable" checked={this.state.requirement_enable} onClick={() => { this.setState({ requirement_enable: !this.state.requirement_enable, }) }} />
                                                            <label className="form-check-label" htmlFor="requirement_enable">Requirement enable</label>
                                                        </div>
                                                    </Col>
                                                    <Col md="auto" className="mb-3 align-self-end">
                                                        <div className="form-check form-switch form-switch-lg">
                                                            <input type="checkbox" className="form-check-input" id="current_status" checked={this.state.status} onClick={() => { this.setState({ status: !this.state.status, }) }} />
                                                            <label className="form-check-label" htmlFor="current_status">Status</label>
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <div className="d-flex flex-wrap gap-2 justify-content-end">
                                                    <Button color="primary" type="submit" disabled={submit}>
                                                        {submit === true ? "Please wait..." : "Submit Data"}
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        }
                        {dataLoaded === false && <div className="py-4 text-center"><h4>Please wait...</h4></div>}
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

UserEdit.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string
        })
    }),
    location: PropTypes.object
};

export default UserEdit;