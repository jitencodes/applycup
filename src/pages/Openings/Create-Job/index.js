import React, { Component } from "react";
import MetaTags from "react-meta-tags";
import {
  Button,
  Card,
  CardBody, CardTitle,
  Col,
  Container,
  FormGroup,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from "reactstrap";

import classnames from "classnames";
import SimpleReactValidator from 'simple-react-validator'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//Import Breadcrumb
// import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {get, post} from "../../../helpers/api_helper";
import toastr from "toastr";
import Select from "react-select";
import CreatableSelect from 'react-select/creatable';
import {ADD_REQUIREMENT_ROLES, ADD_REQUIREMENT, GET_ACTIVE_COMPANY, GET_ALL_MASTERS, ADD_SKILL} from "../../../helpers/api_url_helper";

class AddJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      activeTabVartical: 1,
      passedSteps: [1],
      passedStepsVertical: [1],
      company_master:[],
      location_master:[],
      requirement_role_master:[],
      requirement_status_master:[],
      job_type_master:[],
      qualification_master:[],
      employees_master:[],
      recruiters_master:[],
      salary_currency_master:[],
      skill_master:[],
      notice_period_master:[],
      company_name:"",
      job_type:"",
      number_of_vacancy:"",
      experience_type:"",
      is_industry_standard:"",
      min_experience:"",
      max_experience:"",
      min_salary:"",
      max_salary:"",
      salary_currency:"",
      notice_period:"",
      job_description:"",
      requirement_status:"",
      location_type:"",
      location_id:[],
      job_role:[],
      skills:[],
      qualification:[],
      assigned_to:[],
      created_by:"",
      status:false,
      submit:false,
      isLoading:false
    };
    this.toggleTabVertical.bind(this);
    this.validator = new SimpleReactValidator({autoForceUpdate: this})
  }
  componentDidMount() {
    this.loadCompany()
    this.loadMaster()
  }
  loadCompany = () => {
    get(GET_ACTIVE_COMPANY).then(res => {
      if (res.status){
        this.setState({company_master:res.data})
      }
    }).catch(err => {
      toastr.error(err)
    })
  }
  loadMaster = () => {
    get(GET_ALL_MASTERS, {params: {masters: 'location,requirement_role,requirement_status,job_type,qualification,employees,salary_currency,skill_master,notice_period'}}).then(res => {
      if (res.status) {
        let data = res.data;
        this.setState({location_master:data.location})
        this.setState({requirement_role_master:data.requirement_role})
        this.setState({requirement_status_master:data.requirement_status})
        this.setState({job_type_master:data.job_type})
        this.setState({qualification_master:data.qualification})
        this.setState({employees_master:data.employees})
        this.setState({salary_currency_master:data.salary_currency})
        this.setState({skill_master:data.skill_master})
        this.setState({notice_period_master:data.notice_period})
        // this.setState({recruiters_master:data.recruiters})
      }
    }).catch(err => {
      toastr.error(err)
    })
  }
  toggleTabVertical(tab) {
    if (this.state.activesTab !== tab) {
      if (tab >= 1 && tab <= 3) {
        var modifiedSteps = [...this.state.passedStepsVertical, tab];
        this.setState({
          activeTabVartical: tab,
          passedStepsVertical: modifiedSteps
        });
      }
    }
  }
  handleInput = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }
  handleFormSubmit = (e) => {
    e.preventDefault()
    if (this.validator.allValid()) {
      this.toggleTabVertical(this.state.activeTabVartical + 1)
    }else {
      this.validator.showMessages()
      this.forceUpdate()
    }
  }
  handleMainFormSubmit = (e) => {
    e.preventDefault()
    if (this.validator.allValid()) {
      const formData = {
        company_id:this.state.company_name,
        job_type:this.state.job_type,
        number_of_vacancy:this.state.number_of_vacancy,
        experience_type:this.state.experience_type,
        is_industry_standard:this.state.is_industry_standard,
        min_experience:this.state.min_experience,
        max_experience:this.state.max_experience,
        min_salary:this.state.min_salary,
        max_salary:this.state.max_salary,
        salary_currency:this.state.salary_currency,
        location_type:this.state.location_type,
        location_id:this.state.location_id,
        notice_period_master_id:this.state.notice_period,
        requirement_description:this.state.job_description,
        requirement_status:this.state.requirement_status,
        job_role:this.state.job_role,
        skills:this.state.skills,
        qualification:this.state.qualification,
        assigned_to:this.state.assigned_to,
        created_by:this.state.created_by,
        status:this.state.status,
      }
      if (this.state.activeTabVartical === 2){
        this.setState({submit: true})
        post(ADD_REQUIREMENT,formData).then(response => {
          if (response.status) {
            this.setState({submit: false})
            toastr.success('Requirement added successful.')
            // eslint-disable-next-line react/prop-types
            const {history} = this.props
            // eslint-disable-next-line react/prop-types
            history.push('/openings')
          }
        }).catch(err => {
          toastr.error(err?.response?.data?.message)
          this.setState({submit: false})
        })
      }
    } else {
      this.validator.showMessages()
      this.forceUpdate()
    }
  }
  handleCreate = (inputValue) => {
    this.setState({job_role:{value:"",label:inputValue}})
    const formData = {
        "role":inputValue,
        "ordering" : 1,
        "status" : 1
      }
      post(ADD_REQUIREMENT_ROLES,formData).then(response => {
        if (response.status) {
            this.setState({job_role:{value:response.id,label:inputValue}})
            this.setState({requirement_role_master: [...this.state.requirement_role_master, {value:response.id,label:inputValue}]});
        }else{
            this.setState({job_role:""}) 
            toastr.error(response.message)
        }
      }).catch(err => {
        this.setState({job_role:""})
        toastr.error(err?.response?.data?.message)
      })
  };
  handleCreateSkill = (inputValue) => {
    this.setState({isLoading:true})
    const formData = {
        "skill":inputValue,
        "ordering" : 1,
        "status" : 1
      }
      post(ADD_SKILL,formData).then(response => {
        if (response.status) {
            // this.setState({skills:{value:response.id,label:inputValue}})
            this.setState({skills: [...this.state.skills, {value:response.id,label:inputValue}]});
            this.setState({skill_master: [...this.state.skill_master, {value:response.id,label:inputValue}]});
            this.setState({isLoading:false})
        }else{
            // this.setState({skills:""}) 
            this.setState({isLoading:false})
            toastr.error(response.message)
        }
      }).catch(err => {
        // this.setState({skills:""})
        this.setState({isLoading:false})
        toastr.error(err?.response?.data?.message)
      })
}
  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Create job opening | {process.env.REACT_APP_PROJECTNAME}</title>
          </MetaTags>
          <Container fluid={true}>
            <Row>
              <Col lg="12">
                <h4 className="card-title mb-4">Create job opening</h4>
                <div className="vertical-wizard wizard clearfix vertical">
                  <div className="steps clearfix">
                    <Card>
                      <CardBody>
                        <ul className="form-steps-list">
                          <NavItem
                            className={classnames({
                              current: this.state.activeTabVartical === 1
                            })}>
                            <NavLink
                              className={classnames({
                                active: this.state.activeTabVartical === 1
                              })}
                              onClick={() => {
                                this.toggleTabVertical(1);
                              }}
                            >
                              <span><i className="bx bx-chevron-left-circle"></i> Job Details</span>
                              <span className="step-number">1</span>{" "}
                            </NavLink>
                          </NavItem>
                          <NavItem
                            className={classnames({
                              current: this.state.activeTabVartical === 2
                            })}>
                            <NavLink
                              disabled={!(this.state.passedStepsVertical || []).includes(2)}
                              className={classnames({
                                active: this.state.activeTabVartical === 2
                              })}
                              onClick={() => {
                                this.toggleTabVertical(2);
                              }}
                            >
                              <span><i className="bx bxs-user"></i> Candidate Requirement</span>
                              <span className="step-number">2</span>{" "}
                            </NavLink>
                          </NavItem>
                        </ul>
                      </CardBody>
                    </Card>
                  </div>
                  <div className="content clearfix py-0">
                    <Card>
                      <CardBody>
                        <TabContent
                          activeTab={this.state.activeTabVartical}
                          className="body"
                        >
                          <TabPane tabId={1}>
                            <form id={"form-1"} onSubmit={this.handleFormSubmit}>
                            <CardTitle className="mb-4">JOB DETAILS</CardTitle>
                              <FormGroup className="mb-3">
                                <label htmlFor="company_name">Company Name*</label>
                                <Select isMulti={false} options={this.state.company_master} name="company_name" onChange={e => {this.setState({company_name:e})}} classNamePrefix="select2-selection" />
                                {this.validator.message('company_name', this.state.company_name, 'required')}
                              </FormGroup>
                              <Row className="mb-3">
                                <Col lg="4" className="mb-3">
                                  <label className="control-label">Job Role*</label>
                                  <CreatableSelect isMulti={false} value={this.state.job_role} options={this.state.requirement_role_master} name="job_role" onChange={e => {this.setState({job_role:e})}} classNamePrefix="select2-selection" onCreateOption={this.handleCreate}/>
                                  {this.validator.message("job_role", this.state.job_role, "required")}
                                </Col>
                                <Col lg="4" className="mb-3">
                                  <label className="control-label">Job Type*</label>
                                  <Select isMulti={false} options={this.state.job_type_master} name="job_type" classNamePrefix="select2-selection" onChange={e => {this.setState({job_type:e})}}/>
                                  {this.validator.message("job_type", this.state.job_type, "required")}
                                </Col>
                                <Col lg="4" className="mb-3">
                                  <label className="control-label">Number of vacancy</label>
                                  <input type="text" name="number_of_vacancy" className="form-control" id="number_of_vacancy" onChange={this.handleInput} placeholder="Enter vacancy"/>
                                  {this.validator.message("number_of_vacancy", this.state.number_of_vacancy, "required|numeric|max:99,num")}
                                </Col>
                              </Row>
                              <Row className="g-3 mb-3">
                                <Col xl={12} sm={12}>
                                  <h5 className="font-size-15 mb-3">Job Location*</h5>
                                  <Row>
                                    <Col md={"3"}>
                                      <div className="form-check">
                                        <input className="form-check-input" type="radio" name="location_type" onChange={e => this.setState({location_type:e.target.value})} id="Remote" value="1"/>
                                        <label className="form-check-label" htmlFor="Remote">Remote</label>
                                      </div>
                                    </Col>
                                    <Col md={"3"}>
                                      <div className="form-check">
                                        <input className="form-check-input" type="radio" name="location_type" onChange={e => this.setState({location_type:e.target.value})} id="Onsite" value="2"/>
                                        <label className="form-check-label" htmlFor="Onsite">Onsite</label>
                                      </div>
                                    </Col>
                                    <Col md={"3"}>
                                      <div className="form-check">
                                        <input className="form-check-input" type="radio" name="location_type" onChange={e => this.setState({location_type:e.target.value})} id="Hybrid" value="3"/>
                                        <label className="form-check-label" htmlFor="Hybrid">Hybrid</label>
                                      </div>
                                    </Col>
                                  </Row>
                                  {this.validator.message("location_type", this.state.location_type, "required")}
                                </Col>
                                {(this.state.location_type === '2' || this.state.location_type === '3')  &&
                                    <Col lg="6" className="mb-3">
                                      <Select isMulti={true} options={this.state.location_master} name="job_role" classNamePrefix="select2-selection" onChange={e => {this.setState({location_id:e})}}/>
                                      {this.validator.message("location_id", this.state.location_id, "required")}
                                    </Col>
                                }
                              </Row>
                              <hr/>
                              <Row className="g-3 mb-3">
                                <Col md={12}>
                                  <h5 className="font-size-15 mb-3">Experience*</h5>
                                  <Row>
                                    <Col md={"3"}>
                                      <div className="form-check">
                                        <input className="form-check-input" type="radio" name="experience_type" onChange={e => this.setState({experience_type:e.target.value})} id="Fresher" value="1"/>
                                        <label className="form-check-label" htmlFor="Fresher">Fresher</label>
                                      </div>
                                    </Col>
                                    <Col md={"3"}>
                                      <div className="form-check">
                                        <input className="form-check-input" type="radio" name="experience_type" onChange={e => this.setState({experience_type:e.target.value})} id="Experienced" value="2"/>
                                        <label className="form-check-label" htmlFor="Experienced">Experienced</label>
                                      </div>
                                    </Col>
                                  </Row>
                                  {this.validator.message("experience_type", this.state.experience_type, "required")}
                                </Col>
                              {this.state.experience_type === "2" &&
                                  <Col md={12}>
                                    <h6>Required Experience (in years)*</h6>
                                    <Row>
                                      <Col lg="3" className="mb-3">
                                        <input type="text" name="min_experience" className="form-control" id="min_experience" onChange={this.handleInput} placeholder="Enter Min Exp (in Years)"/>
                                        {this.validator.message('min_experience', this.state.min_experience, 'required|numeric|min:0,num')}
                                      </Col>
                                      <Col lg="3" className="mb-3">
                                        <input type="text" name="max_experience" className="form-control" id="max_experience" onChange={this.handleInput} placeholder="Enter Max Exp (in Years)"/>
                                        {this.validator.message('max_experience', this.state.max_experience, 'required|numeric')}
                                      </Col>
                                    </Row>
                                  </Col>
                              }
                              </Row>
                              <hr/>
                              <h5 className="font-size-15 mb-3">Compensation*</h5>
                              <Row>
                                <Col md={"3"}>
                                  <div className="form-check">
                                    <input className="form-check-input" type="radio" name="is_industry_standard" onChange={e => this.setState({is_industry_standard:e.target.value})} id="industry_standard" value="2" defaultChecked={this.state.is_industry_standard === "2"}/>
                                    <label className="form-check-label" htmlFor="industry_standard">As Industry Standard</label>
                                  </div>
                                </Col>
                                <Col md={"3"}>
                                  <div className="form-check mb-3">
                                    <input className="form-check-input" type="radio" name="is_industry_standard" onChange={e => this.setState({is_industry_standard:e.target.value})} id="Monthly" value="1" defaultChecked={this.state.is_industry_standard === "1"}/>
                                    <label className="form-check-label" htmlFor="Monthly">CTC</label>
                                  </div>
                                </Col>
                              </Row>
                              {this.validator.message("is_industry_standard", this.state.is_industry_standard, "required")}
                              {this.state.is_industry_standard === "1" &&
                                  <Row className="g-3 mb-3">
                                    <Col lg="3" className="mb-3">
                                      <Select isMulti={false} options={this.state.salary_currency_master} name="salary_currency" classNamePrefix="select2-selection" onChange={e => {this.setState({salary_currency:e})}}/>
                                      {this.validator.message("salary_currency", this.state.salary_currency, "required")}
                                    </Col>
                                    <Col lg="3" className="mb-3">
                                      <input type="number" name="min_salary" className="form-control" id="min_salary" onChange={this.handleInput} placeholder="Enter min salary"/>
                                      {this.validator.message('min_salary', this.state.min_salary, 'required|min:0,num')}
                                    </Col>
                                    <Col lg="3" className="mb-3">
                                      <input type="number" name="max_salary" className="form-control" id="max_salary" onChange={this.handleInput} placeholder="Enter max salary"/>
                                      {this.validator.message('max_salary', this.state.max_salary, 'required')}
                                    </Col>
                                  </Row>
                              }
                              <hr/>
                              <Row className="g-3">
                                {/* <Col lg="3" className="mb-3">
                                  <label className="control-label">Created by*</label>
                                  <Select isMulti={false} options={this.state.employees_master} name="created_by" classNamePrefix="select2-selection" onChange={e => {this.setState({created_by:e})}}/>
                                  {this.validator.message("created_by", this.state.created_by, "required")}
                                </Col> */}
                                <Col lg="6" className="mb-3">
                                  <label className="control-label">Assigned To*</label>
                                  <Select isMulti={true} options={this.state.employees_master} name="assigned_to" classNamePrefix="select2-selection" onChange={e => {this.setState({assigned_to:e})}}/>
                                  {this.validator.message("assigned_to", this.state.assigned_to, "required")}
                                </Col>
                              </Row>
                              <div className="actions clearfix">
                                <ul>
                                  <li className={this.state.activeTabVartical === 1 ? "previous disabled" : "previous"}>
                                    <Button type="button" onClick={() => { this.toggleTabVertical(this.state.activeTabVartical - 1);}}>Previous</Button>
                                  </li>
                                  <li className={this.state.activeTabVartical === 4 ? "next disabled"  : "next" }>
                                    <Button type="submit">Next</Button>
                                  </li>
                                </ul>
                              </div>
                            </form>
                          </TabPane>
                          <TabPane tabId={2}>
                            {this.state.activeTabVartical === 2 &&
                                <form id={"form-2"} onSubmit={this.handleMainFormSubmit}>
                                  <Row>
                                    <Col lg="6" className="mb-3">
                                      <label htmlFor="skills">Skills*</label>
                                      <CreatableSelect isMulti={true} value={this.state.skills} options={this.state.skill_master} name="skills"
                                        isDisabled={this.state.isLoading}
                                        isLoading={this.state.isLoading}
                                        onChange={e => {
                                            this.setState({skills: e})
                                        }} classNamePrefix="select2-selection" onCreateOption={this.handleCreateSkill}/>
                                      {this.validator.message('skills', this.state.skills, 'required')}
                                    </Col>
                                    <Col lg="6" className="mb-3">
                                      <label htmlFor="qualification">Qualification*</label>
                                      <Select isMulti={true} options={this.state.qualification_master}
                                              name="qualification" onChange={e => {
                                        this.setState({qualification: e})
                                      }} classNamePrefix="select2-selection"/>
                                      {this.validator.message('qualification', this.state.qualification, 'required')}
                                    </Col>
                                    <Col lg="4">
                                      <label htmlFor="notice_period_master_id">Preferred Time Period for
                                        Joining*</label>
                                      <Select isMulti={false} options={this.state.notice_period_master} name="notice_period" onChange={e => {
                                        this.setState({notice_period: e.value})
                                      }} classNamePrefix="select2-selection"/>
                                      {this.validator.message('notice_period', this.state.notice_period, 'required')}
                                    </Col>
                                    <Col lg="4">
                                      <label htmlFor="requirement_status">Requirements Status</label>
                                      <Select isMulti={false} options={this.state.requirement_status_master}
                                              name="requirement_status" onChange={e => {
                                        this.setState({requirement_status: e.value})
                                      }} classNamePrefix="select2-selection"/>
                                      {this.validator.message('requirement_status', this.state.requirement_status, 'required')}
                                    </Col>
                                    <Col md="auto" className=" align-self-end">
                                      <div className="form-check form-switch form-switch-lg">
                                        <input type="checkbox" className="form-check-input" id="current_status"
                                               checked={this.state.status} onClick={() => {
                                          this.setState({status: !this.state.status,})
                                        }}/>
                                        <label className="form-check-label" htmlFor="current_status">Post to
                                          website</label>
                                      </div>
                                    </Col>
                                  </Row>
                                  <div className="mt-4">
                                    <h5 className="font-size-15 mb-3">Job Description*</h5>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={this.state.data}
                                        onReady={editor => {
                                          console.log('Job description is ready to use!', editor);
                                        }}
                                        onChange={(event, editor) => {
                                          const data = editor.getData();
                                          this.setState({job_description: data})
                                        }}
                                    />
                                    {this.validator.message('job_description', this.state.job_description, 'required')}
                                  </div>
                                  <div className="actions clearfix mt-4">
                                    <ul>
                                      <li className={this.state.activeTabVartical === 1 ? "previous disabled" : "previous"}>
                                        <Button type="button" onClick={() => {
                                          this.toggleTabVertical(this.state.activeTabVartical - 1);
                                        }}>Previous</Button>
                                      </li>
                                      <li className={this.state.activeTabVartical === 1 ? "next disabled" : "next"}>
                                        <Button className={"btn-primary"} type="submit">Submit</Button>
                                      </li>
                                    </ul>
                                  </div>
                                </form>
                            }
                          </TabPane>
                        </TabContent>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default AddJob;
