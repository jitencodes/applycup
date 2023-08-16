import React from "react";
import MetaTags from "react-meta-tags";
import { Button, Card, CardBody, CardTitle, Col, Container, Label, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import {get, post} from "../../helpers/api_helper";
import SimpleReactValidator from "simple-react-validator";
import toastr from "toastr";
import PropTypes from "prop-types";
import {ADD_CLIENTS, GET_ALL_MASTERS, GET_EMPLOYMENT_TYPE, GET_ROLES} from "../../helpers/api_url_helper";

class ClientAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location_master: [],
      person_list: [],
      client_status_master: [],
      client_source_master: [],
      designation: "",
      client_source: "",
      client_status: "",
      department: "",
      contact_person: "",
      location: "",
      mobile: "",
      phone: "",
      email: "",
      status: false,
      handleResponse: null,
      submit: false
    };
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
  }

  componentDidMount(){
    this.loadMaster()
  }

  loadMaster = () => {
    get(GET_ALL_MASTERS, {params: {masters: 'location,client_status,client_source,employees'}}).then(res => {
      if (res.status) {
        let data = res.data;
        this.setState({location_master:data.location})
        this.setState({client_status_master:data.client_status})
        this.setState({client_source_master:data.client_source})
        this.setState({person_list:data.employees})
      }
    }).catch(err => {
      toastr.error(err?.response?.data?.message)
    })
  }

  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleFormSubmit = (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      var data = {
        "company": this.state.company,
        "location": this.state.location,
        "client_source_master_id": this.state.client_source,
        "client_status": this.state.client_status,
        "employe_assign_to": this.state.person,
        "contact_person": this.state.contact_person,
        "mobile": this.state.mobile,
        "mobile_2": this.state.mobile_2,
        "email": this.state.email,
        "notes": this.state.notes,
        "designation": this.state.designation,
        "status": this.state.status
      };
      this.setState({ submit: true });
      post(ADD_CLIENTS, data).then(response => {
        if (response.status) {
          this.setState({ submit: false });
          toastr.success("Client added successful.");
          // eslint-disable-next-line react/prop-types
          const { history } = this.props;
          // eslint-disable-next-line react/prop-types
          history.push("/clients");
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
    const { submit } = this.state;
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>
              Manage Clients | {process.env.REACT_APP_PROJECTNAME}
            </title>
          </MetaTags>
          <Container fluid={true}>
            <Breadcrumbs title="Clients" path="/clients" breadcrumbItem="Add Clients" />
            <Row>
              <Col xl="12">
                <Card>
                  <CardBody>
                    <form onSubmit={this.handleFormSubmit}>
                      <Row>
                        <Col md={12}>
                          <h5 className="fw-bold text-primary mb-3">Company detail</h5>
                        </Col>
                        <Col md="4" className="mb-3">
                          <Label htmlFor="company">Name<span className="text-danger">*</span></Label>
                          <input name="company" placeholder="Type Company Name" type="text" className={"form-control"}
                                 onChange={this.handleInput} />
                          {this.validator.message("company", this.state.company, "required|string")}
                        </Col>
                        <Col md="3" className="mb-3">
                          <label className="control-label">Location<span className="text-danger">*</span></label>
                          <Select
                            isMulti={false}
                            options={this.state.location_master}
                            onChange={e => this.setState({location: e.value})}
                            classNamePrefix="select2-selection"
                          />
                          {this.validator.message("location", this.state.location, "required")}
                        </Col>
                        <Col md="3" className="mb-3">
                          <label className="control-label">Client Source</label>
                          <Select
                            isMulti={false}
                            options={this.state.client_source_master}
                            onChange={e => this.setState({client_source: e.value})}
                            classNamePrefix="select2-selection"
                          />
                          {this.validator.message("client_source", this.state.client_source, "required")}
                        </Col>
                        <Col md="3" className="mb-3">
                          <label className="control-label">Client Status<span className="text-danger">*</span></label>
                          <Select
                            isMulti={false}
                            options={this.state.client_status_master}
                            onChange={e => this.setState({client_status: e.value})}
                            classNamePrefix="select2-selection"
                          />
                          {this.validator.message("client_status", this.state.client_status, "required")}
                        </Col>
                        <Col md="3" className="mb-3">
                          <label className="control-label">Responsible Person<span className="text-danger">*</span></label>
                          <Select
                            isMulti={false}
                            options={this.state.person_list}
                            onChange={e => this.setState({person: e.value})}
                            classNamePrefix="select2-selection"
                          />
                          {this.validator.message("person", this.state.person, "required")}
                        </Col>
                        <Col md="auto" className="mb-3 align-self-end">
                          <div className="form-check form-switch form-switch-lg">
                            <input type="checkbox" className="form-check-input" id="current_status" checked={this.state.status} onClick={() => {this.setState({ status: !this.state.status, })}} />
                            <label className="form-check-label" htmlFor="current_status">Status</label>
                          </div>
                        </Col>
                        <Col md={12}>
                          <h5 className="fw-bold text-primary mb-3">Company Person detail</h5>
                        </Col>
                        <Col md="3" className="mb-3">
                          <Label htmlFor="contact_person">Person<span className="text-danger">*</span></Label>
                          <input name="contact_person" placeholder="Type Contact Person" type="text" className={"form-control"} onChange={this.handleInput} />
                          {this.validator.message("contact_person", this.state.contact_person, "required")}
                        </Col>
                        <Col md="3" className="mb-3">
                          <label className="control-label">Designation<span className="text-danger">*</span></label>
                          <input name="designation" placeholder="Type Contact Person" type="text" className={"form-control"} onChange={this.handleInput} />
                          {this.validator.message("designation", this.state.designation, "required")}
                        </Col>
                        <Col md="3" className="mb-3">
                          <Label htmlFor="mobile">Mobile<span className="text-danger">*</span></Label>
                          <input name="mobile" placeholder="Type Mobile Number" type="tel" className={"form-control"}
                                 onChange={this.handleInput} />
                          {this.validator.message("mobile", this.state.mobile, "required|phone")}
                        </Col>
                        <Col md="3" className="mb-3">
                          <Label htmlFor="phone">Phone</Label>
                          <input name="phone" placeholder="Type Phone Number" type="tel" className={"form-control"}
                                 onChange={this.handleInput} />
                          {/* {this.validator.message("phone", this.state.phone, "phone")} */}
                        </Col>
                        <Col md="3" className="mb-3">
                          <Label htmlFor="email">Email</Label>
                          <input name="email" placeholder="Type Email Address" type="email" className={"form-control"}
                                 onChange={this.handleInput} />
                          {/* {this.validator.message("email", this.state.email, "required|email")} */}
                        </Col>
                        <Col md="6" className="mb-3">
                          <Label htmlFor="notes">Notes</Label>
                          <textarea name="notes" placeholder="Type Notes" rows={3} className={"form-control"}
                            onChange={this.handleInput} />
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
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

ClientAdd.propTypes = {
  location: PropTypes.object
};

export default ClientAdd;