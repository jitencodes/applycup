import React from "react"
import MetaTags from "react-meta-tags"
import {Button, Card, CardBody, Col, Container, Label, Row,} from "reactstrap"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import SimpleReactValidator from 'simple-react-validator'
import {get, put} from "../../../helpers/api_helper"
import {EDIT_QUALIFICATION, GET_QUALIFICATION} from "../../../helpers/api_url_helper"
import toastr from "toastr"
import PropTypes from "prop-types"


class QualificationEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      qualification: "",
      status: true,
      handleResponse: null,
      submit: false
    }
    this.validator = new SimpleReactValidator({autoForceUpdate: this})
  }
  handleInput = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }
  componentDidMount() {
    this.getQualification(this.props.match.params.id)
  }

  getQualification(id) {
    get(GET_QUALIFICATION, {params: {id: id}}).then(res => {
      if (res.data) {
        this.setState({
          id: res.data.id,
          qualifications: res.data.name,
          ordering: res.data.ordering,
          status: (res.data.status === "1"),
        })
      } else {
        toastr.error("Data load issue try again!")
      }
    }).catch(err => {
      toastr.error(err?.response?.data?.message)
      // eslint-disable-next-line react/prop-types
      const {history} = this.props;
      // eslint-disable-next-line react/prop-types
      history.push("/qualifications");
    })
  }
  handleFormSubmit = (e) => {
    e.preventDefault()
    if (this.validator.allValid()) {
      const formData = {
        "id":this.props.match.params.id,
        "qualification":this.state.qualifications,
        "ordering" : this.state.ordering,
        "status" : this.state.status ? 1 : 0
      }
      put(EDIT_QUALIFICATION,formData).then(response => {
        if (response.status) {
          this.setState({submit: false})
          toastr.success('Qualification update successful.')
          // eslint-disable-next-line react/prop-types
          const {history} = this.props
          // eslint-disable-next-line react/prop-types
          history.push('/qualifications')
        }
      }).catch(err => {
        toastr.error(err?.response?.data?.message)
        this.setState({submit: false})
      })
    } else {
      this.validator.showMessages()
      this.forceUpdate()
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>
              Manage Qualifications | {process.env.REACT_APP_PROJECTNAME}
            </title>
          </MetaTags>
          <Container fluid={true}>
            <Breadcrumbs title="Qualifications" path="/qualifications" breadcrumbItem="Edit"/>
            <Row>
              <Col xl="12">
                <Card>
                  <CardBody>
                    <form onSubmit={this.handleFormSubmit}>
                      <Row>
                        <Col md="4" className="mb-3">
                          <Label htmlFor="qualifications">Qualifications Name</Label>
                          <input name="qualifications" placeholder="Type Skill Name" defaultValue={this.state.qualifications} type="text"
                                 className={"form-control"} onChange={this.handleInput}/>
                          {this.validator.message('qualifications', this.state.qualifications, 'required')}
                        </Col>
                        <Col md="4" className="mb-3">
                          <Label htmlFor="ordering">Ordering</Label>
                          <input name="ordering" placeholder="Type Ordering"
                                 defaultValue={this.state.ordering} type="text"
                                 className={"form-control"} onChange={this.handleInput}/>
                          {this.validator.message('ordering', this.state.ordering, 'required')}
                        </Col>
                        <Col md="auto" className="mb-3 align-self-end">
                          <div className="form-check form-switch form-switch-lg">
                            <input type="checkbox" className="form-check-input"
                                   id="current_status" checked={this.state.status}
                                   onClick={() => {
                                     this.setState({status: !this.state.status,})
                                   }}/>
                            <label className="form-check-label"
                                   htmlFor="current_status">Status</label>
                          </div>
                        </Col>
                      </Row>
                      <div className="d-flex flex-wrap gap-2 justify-content-end">
                        <Button color="primary" type="submit" disabled={this.state.submit}>
                          {this.state.submit === true ? 'Please wait...' : 'Submit Data'}
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
    )
  }
}

QualificationEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  location: PropTypes.object
}

export default QualificationEdit
