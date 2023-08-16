import React from "react"
import MetaTags from "react-meta-tags"
import {Button, Card, CardBody, Col, Container, Label, Row,} from "reactstrap"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import SimpleReactValidator from 'simple-react-validator'
import {post} from "../../../helpers/api_helper"
import {ADD_REQUIREMENT_STATUS} from "../../../helpers/api_url_helper"
import toastr from "toastr"
import PropTypes from "prop-types"


class RequirementStatusAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      requirement_title: "",
      ordering: "",
      status: true,
      handleResponse: null,
      submit: false
    }
    this.validator = new SimpleReactValidator({autoForceUpdate: this})
  }

  handleInput = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    if (this.validator.allValid()) {
      const formData = {
        "requirement_title": this.state.requirement_title,
        "ordering" : this.state.ordering,
        "status" : this.state.status ? 1 : 0
      }
      this.setState({submit: true})
      post(ADD_REQUIREMENT_STATUS,formData).then(response => {
        if (response.status) {
          this.setState({submit: false})
          toastr.success('Data added successful.')
          // eslint-disable-next-line react/prop-types
          const {history} = this.props
          // eslint-disable-next-line react/prop-types
          history.push('/requirement-status')
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
              Manage Requirement Status | {process.env.REACT_APP_PROJECTNAME}
            </title>
          </MetaTags>
          <Container fluid={true}>
            <Breadcrumbs title="Requirement Status" path="/requirement-status" breadcrumbItem="Add"/>
            <Row>
              <Col xl="12">
                <Card>
                  <CardBody>
                    <form onSubmit={this.handleFormSubmit}>
                      <Row>
                        <Col md="3" className="mb-3">
                          <Label htmlFor="status_title">Requirement Status</Label>
                          <input name="requirement_title" placeholder="Type Requirement Status" defaultValue={this.state.requirement_title} type="text" className={"form-control"} onChange={this.handleInput}/>
                          {this.validator.message('requirement_title', this.state.requirement_title, 'required')}
                        </Col>
                        <Col md="2" className="mb-3">
                          <Label htmlFor="ordering">Ordering</Label>
                          <input name="ordering" placeholder="Type Ordering" defaultValue={this.state.ordering} type="text" className={"form-control"} onChange={this.handleInput}/>
                          {this.validator.message('ordering', this.state.ordering, 'required')}
                        </Col>
                        <Col md="auto" className="mb-3 align-self-end">
                          <div className="form-check form-switch form-switch-lg">
                            <input type="checkbox" className="form-check-input" id="current_status" checked={this.state.status} onClick={() => {this.setState({ status: !this.state.status, })}} />
                            <label className="form-check-label" htmlFor="current_status">Status</label>
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

RequirementStatusAdd.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  location: PropTypes.object
}

export default RequirementStatusAdd
