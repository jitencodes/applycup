import React from "react";
import { Row, Col, Input, Label, Modal, Button } from "reactstrap";
import Select from "react-select";
import PropTypes from "prop-types";
import SimpleReactValidator from "simple-react-validator";
import { get } from "../../helpers/api_helper";
import { ADD_CANDIDATE_DATA, GET_ALL_MASTERS } from "../../helpers/api_url_helper";
import accessToken from "../../helpers/jwt-token-access/accessToken";
import axios from "axios"
import toastr from "toastr";
class AddCandidate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location_master: [],
      employees_master: [],
      notice_period_master: [],
      current_openings: [],
      candidate_source_master: [],
      candidate_status_master: [],
      job_role: "",
      candidate_name: "",
      gender: "",
      mobile: "",
      email: "",
      exprience: "",
      relevant_tech_exprience: "",
      current_organisation: "",
      current_ctc: "",
      expected_ctc: "",
      notice_period: "",
      current_city: "",
      preferred_city: "",
      candidate_source: "",
      candidate_status: "",
      resume: "",
      remark:"",
      submit: false,
      isShowing: false,
      handleResponse: null,
      formSubmitSuccess: false
    }
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
  }

  componentDidMount() {
    this.loadMaster();
  }

  loadMaster = () => {
    get(GET_ALL_MASTERS, { params: { masters: 'location,employees,notice_period,candidate_source,candidate_status,current_openings' } }).then(res => {
      if (res.status) {
        let data = res.data;
        this.setState({ location_master: data.location, employees_master: data.employees, notice_period_master: data.notice_period, candidate_source_master: data.candidate_source, candidate_status_master: data.candidate_status, current_openings: data.current_openings })
      }
    }).catch(err => {
      toastr.error(err)
    })
  }
  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleResume = () => {
    let resume = document.getElementById('resume').files[0]
    this.setState({ resume: resume});
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      const formData = new FormData()
      formData.append('candidate_name', this.state.candidate_name)
      formData.append('job_role', this.state.job_role.value !== undefined && this.state.job_role.value)
      formData.append('gender', this.state.gender.value !== undefined && this.state.gender.value)
      formData.append('mobile', this.state.mobile)
      formData.append('email', this.state.email)
      formData.append('exprience', this.state.exprience)
      formData.append('relevant_tech_exprience', this.state.relevant_tech_exprience)
      formData.append('current_organisation', this.state.current_organisation)
      formData.append('current_ctc', this.state.current_ctc)
      formData.append('expected_ctc', this.state.expected_ctc)
      formData.append('notice_period', this.state.notice_period.value !== undefined && this.state.notice_period.value)
      formData.append('current_city', this.state.current_city.value !== undefined && this.state.current_city.value)
      this.state.preferred_city.length > 0 && this.state.preferred_city.forEach(val => {
        formData.append('preferred_city[]', val.value)
      });
      this.state.resume !== "" && formData.append('resume',this.state.resume)
      formData.append('candidate_source', this.state.candidate_source.value !== undefined && this.state.candidate_source.value)
      formData.append('candidate_status', this.state.candidate_status.value !== undefined && this.state.candidate_status.value)
      formData.append('remark', this.state.remark)

      this.setState({ submit: true });
      axios({
        method: "post", url: `${process.env.REACT_APP_APIURL}${ADD_CANDIDATE_DATA}`, data: formData, headers: {
          'Content-Type': 'application/json',
          "Authorization": accessToken,
        }
      }).then(response => {
        if (response.status) {
          this.setState({ submit: false })
          this.setState({
            isShowing: false
          });
          toastr.success('Candidate added successful.')
          // this.setState({ formSubmitSuccess: true })
          this.props.hide(false)
          this.setState({
            job_role: "",
            candidate_name: "",
            gender: "",
            mobile: "",
            email: "",
            exprience: "",
            relevant_tech_exprience: "",
            current_organisation: "",
            current_ctc: "",
            expected_ctc: "",
            notice_period: "",
            current_city: "",
            preferred_city: "",
            candidate_source: "",
            candidate_status: "",
            remark:""
          })
          this.props.reloadBoard(true)
        }
      }).catch(err => {
        toastr.error(err.message)
        this.setState({ submit: false })
        alert(err.message)
      })
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  render() {
    const { location_master, notice_period_master, candidate_source_master, current_openings, formSubmitSuccess } = this.state
    return (
      <React.Fragment>
        <Modal
          size="lg"
          isOpen={this.props.isShowing}
          toggle={this.props.hide}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">ADD CANDIDATE</h5>
            <button
              id="close_model"
              type="button"
              onClick={this.props.hide}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {formSubmitSuccess === false &&
              <form onSubmit={this.handleFormSubmit}>
                <Row>
                  <Col md="6" className="mb-3">
                    <Label htmlFor="candidate_name">Candidate Name<span className="text-danger">*</span></Label>
                    <Input name="candidate_name" placeholder="Type Candidate Name" type="text" className={"form-control"}
                      onChange={this.handleInput} />
                    {this.validator.message("candidate_name", this.state.candidate_name, "required|string")}
                  </Col>
                  <Col md="6" className="mb-3">
                    <label className="control-label">Opening<span className="text-danger">*</span></label>
                    <Select isMulti={false} options={current_openings} classNamePrefix="select2-selection" onChange={e => this.setState({ job_role: e })} />
                    {this.validator.message("job_role", this.state.job_role, "required")}
                  </Col>
                  <Col md="4" className="mb-3">
                    <label className="control-label">Gender<span className="text-danger">*</span></label>
                    <Select isMulti={false} options={[{ label: "Male", value: 1 }, { label: "Female", value: 2 }, { label: "Other", value: 3 }]} classNamePrefix="select2-selection" onChange={e => this.setState({ gender: e })} />
                    {this.validator.message("gender", this.state.gender, "required")}
                  </Col>
                  <Col md="4" className="mb-3">
                    <Label htmlFor="Mobile">Mobile<span className="text-danger">*</span></Label>
                    <Input name="mobile" placeholder="Type Mobile" type="tel" className={"form-control"}
                      onChange={this.handleInput} />
                    {this.validator.message("mobile", this.state.mobile, "required")}
                  </Col>
                  <Col md="4" className="mb-3">
                    <Label htmlFor="Email">Email<span className="text-danger">*</span></Label>
                    <input name="email" placeholder="Type Email Address" type="email" className={"form-control"}
                      onChange={this.handleInput} />
                    {this.validator.message("email", this.state.email, "required")}
                  </Col>
                  <Col md="4" className="mb-3">
                    <Label htmlFor="exp">Exp (in Years)<span className="text-danger">*</span></Label>
                    <Input name="exprience" placeholder="Enter Experience in years" type="text" className={"form-control"}
                      onChange={this.handleInput} />
                      {this.validator.message("exprience", this.state.exprience, "required")}
                  </Col>
                  <Col md="4" className="mb-3">
                    <Label htmlFor="rel_exp">Relevant Tech Stack Exp <small>(in Years)</small></Label>
                    <Input name="relevant_tech_exprience" placeholder="Enter Relevant Tech Stack Exp" type="text" className={"form-control"}
                      onChange={this.handleInput} />
                  </Col>
                  <Col md="4" className="mb-3">
                    <Label htmlFor="current_organisation">Current Organization<span className="text-danger">*</span></Label>
                    <Input name="current_organisation" placeholder="Type Current Organization" type="text" className={"form-control"}
                      onChange={this.handleInput} />
                      {this.validator.message("current_organisation", this.state.current_organisation, "required")}
                  </Col>
                  <Col md="4" className="mb-3">
                    <Label htmlFor="current_ctc">Current CTC<span className="text-danger">*</span></Label>
                    <Input name="current_ctc" placeholder="Enter Current CTC" type="number" className={"form-control"}
                      onChange={this.handleInput} />
                      {this.validator.message("current_ctc", this.state.current_ctc, "required")}
                  </Col>
                  <Col md="4" className="mb-3">
                    <Label htmlFor="expected_ctc">Expected CTC<span className="text-danger">*</span></Label>
                    <Input name="expected_ctc" placeholder="Enter Expected CTC" type="number" className={"form-control"}
                      onChange={this.handleInput} />
                      {this.validator.message("expected_ctc", this.state.expected_ctc, "required")}
                  </Col>
                  <Col md="4" className="mb-3">
                    <Label htmlFor="notice_period">Notice Period<span className="text-danger">*</span></Label>
                    <Select isMulti={false} options={notice_period_master} onChange={e => this.setState({ notice_period: e })} classNamePrefix="select2-selection" />
                    {this.validator.message("notice_period", this.state.notice_period, "required")}
                  </Col>
                  <Col md="4" className="mb-3">
                    <label className="control-label">Current City</label>
                    <Select isMulti={false} options={location_master} onChange={e => this.setState({ current_city: e })} classNamePrefix="select2-selection" />
                    {/* {this.validator.message("current_city", this.state.current_city, "required")} */}
                  </Col>
                  <Col md="8" className="mb-3">
                    <label className="control-label">Preferred City<span className="text-danger">*</span></label>
                    <Select isMulti={true} options={location_master} onChange={e => this.setState({ preferred_city: e })} classNamePrefix="select2-selection" />
                    {this.validator.message("preferred_city", this.state.preferred_city, "required")}
                  </Col>
                  <Col md="4" className="mb-3">
                    <label className="control-label">Candidate Source<span className="text-danger">*</span></label>
                    <Select isMulti={false} options={candidate_source_master} onChange={e => this.setState({ candidate_source: e })} classNamePrefix="select2-selection" />
                    {this.validator.message("candidate_source", this.state.candidate_source, "required")}
                  </Col>
                  {/* <Col md="4" className="mb-3">
                    <label className="control-label">Candidate Status<span className="text-danger">*</span></label>
                    <Select isMulti={false} options={candidate_status_master} onChange={e => this.setState({ candidate_status: e })} classNamePrefix="select2-selection" />
                    {this.validator.message("candidate_status", this.state.candidate_status, "required")}
                  </Col> */}
                  <Col md="4" className="mb-3">
                    <label className="control-label">Resume<span className="text-danger">*</span></label>
                    <input className={"form-control"} id="resume" name="resume" accept=".pdf,.docx,.doc,image/*" onChange={e => {this.handleResume(e)}} placeholder="Select Resume" type="file" />
                    {this.validator.message("resume", this.state.resume, "required")}
                  </Col>
                  <Col md="4" className="mb-3">
                    <Label htmlFor="remark">Remark/Notes</Label>
                    <textarea name="remark" placeholder="Type Remark/Notes" rows={3} className={"form-control"}
                      onChange={this.handleInput} />
                  </Col>
                </Row>

                <div className="d-flex flex-wrap gap-2 justify-content-end">
                  <Button color="primary" type="submit" disabled={this.state.submit}>
                    {this.state.submit === true ? "Please wait..." : "Submit Data"}
                  </Button>
                </div>
              </form>
            }
            {formSubmitSuccess === true &&
              <div className="text-center mb-4"><div className="avatar-md mx-auto mb-4"><div className="avatar-title bg-light  rounded-circle text-primary h1"><i className="bx bx-user-check"></i></div></div><div className="row justify-content-center"><div className="col-xl-10"><h4 className="text-primary">Success !</h4><p className="text-muted font-size-14 mb-4">Candidate add successful.</p><button type="button" id="button-addon2" onClick={e => this.setState({formSubmitSuccess:false})} className="btn btn-primary">Add New Candidate</button></div></div></div>
            }
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}

AddCandidate.propTypes = {
  attribs: PropTypes.any,
  isShowing: PropTypes.any,
  hide: PropTypes.any,
  reloadBoard: PropTypes.func
};

export default AddCandidate