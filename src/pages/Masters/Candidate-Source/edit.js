import React from "react"
import MetaTags from "react-meta-tags"
import {Button, Card, CardBody, Col, Container, Label, Row,} from "reactstrap"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import SimpleReactValidator from 'simple-react-validator'
import {get, put} from "../../../helpers/api_helper"
import toastr from "toastr"
import PropTypes from "prop-types"
import {EDIT_CANDIDATE_SOURCE, GET_CANDIDATE_SOURCE} from "../../../helpers/api_url_helper";


class CandidateSourceEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: "",
      source: "",
      ordering: "",
      status: false,
      handleResponse: null,
      submit: false
    }
    this.validator = new SimpleReactValidator({autoForceUpdate: this})
  }

  componentDidMount() {
    this.getCandidateSource()
  }

  getCandidateSource = () => {
    get(GET_CANDIDATE_SOURCE, {params: {id: this.props.match.params.id}}).then(res => {
      if (res.data) {
        this.setState({
          id: res.data.id,
          source: res.data.name,
          ordering: res.data.ordering,
          status: (res.data.status === "1") ,
        })
      }else {
        toastr.error("Data load issue try again!")
      }
    }).catch(err => {
      toastr.error(err)
      // eslint-disable-next-line react/prop-types
      const { history } = this.props;
      // eslint-disable-next-line react/prop-types
      history.push("/candidate-source");
    })
  }

  handleInput = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    if (this.validator.allValid()) {
      const formData = {
        "id": this.props.match.params.id,
        "source": this.state.source,
        "ordering" : this.state.ordering,
        "status" : this.state.status ? 1 : 0
      }
      put(EDIT_CANDIDATE_SOURCE,formData).then(response => {
        if (response.status) {
          this.setState({submit: false})
          toastr.success('Candidate source update successful.')
          // eslint-disable-next-line react/prop-types
          const {history} = this.props
          // eslint-disable-next-line react/prop-types
          history.push('/candidate-source')
        }
      }).catch(err => {
        toastr.error(err.message)
        this.setState({submit: false})
        alert(err.message)
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
              Manage Candidate Source | {process.env.REACT_APP_PROJECTNAME}
            </title>
          </MetaTags>
          <Container fluid={true}>
            <Breadcrumbs title="Manage Candidate Source" path="/candidate-source" breadcrumbItem="Edit"/>
            <Row>
              <Col xl="12">
                <Card>
                  <CardBody>
                    <form onSubmit={this.handleFormSubmit}>
                      <Row>
                        <Col md="4" className="mb-3">
                          <Label htmlFor="source">Candidate Source Name</Label>
                          <input name="source" placeholder="Type Candidate Source Name" defaultValue={this.state.source} type="text" className={"form-control"}
                                 onChange={this.handleInput}/>
                          {this.validator.message('source', this.state.source, 'required')}
                        </Col>
                        <Col md="4" className="mb-3">
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

CandidateSourceEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  location: PropTypes.object
}

export default CandidateSourceEdit
