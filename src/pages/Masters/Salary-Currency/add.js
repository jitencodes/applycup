import React from "react"
import MetaTags from "react-meta-tags"
import {Button, Card, CardBody, Col, Container, Label, Row,} from "reactstrap"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import SimpleReactValidator from 'simple-react-validator'
import {post} from "../../../helpers/api_helper"
import {ADD_CURRENCY} from "../../../helpers/api_url_helper"
import toastr from "toastr"
import PropTypes from "prop-types"


class SalaryCurrencyAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currency: "",
      symbol: "",
      sort_name: "",
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
    e.preventDefault();
    if (this.validator.allValid()) {
      const formData = {
        currency: this.state.currency,
        symbol: this.state.symbol,
        sort_name: this.state.sort_name,
        ordering: this.state.ordering,
        status: this.state.status ? 1 : 0 ,
      }
      this.setState({ submit: true });
      post(ADD_CURRENCY, formData).then(response => {
        if (response.status) {
          this.setState({ submit: false });
          toastr.success("Currency add successful.");
          // eslint-disable-next-line react/prop-types
          const { history } = this.props;
          // eslint-disable-next-line react/prop-types
          history.push("/salary-currency");
        }
      }).catch(err => {
        toastr.error(err.message);
        this.setState({ submit: false });
        alert(err.message);
      });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>
              Manage Salary Currency | {process.env.REACT_APP_PROJECTNAME}
            </title>
          </MetaTags>
          <Container fluid={true}>
            <Breadcrumbs title="Manage Salary Currency" path="/salary-currency" breadcrumbItem="Add Salary Currency"/>
            <Row>
              <Col xl="12">
                <Card>
                  <CardBody>
                    <form onSubmit={this.handleFormSubmit}>
                      <Row>
                        <Col md="3" className="mb-3">
                          <Label htmlFor="currency">Currency Name</Label>
                          <input name="currency" placeholder="Type Currency Name" defaultValue={this.state.currency} type="text" className={"form-control"}
                                 onChange={this.handleInput} />
                          {this.validator.message("currency", this.state.currency, "required")}
                        </Col>
                        <Col md="3" className="mb-3">
                          <Label htmlFor="sort_name">Sort Name</Label>
                          <input name="sort_name" placeholder="Type Sort Name"
                                 defaultValue={this.state.sort_name} type="text" className={"form-control"}
                                 onChange={this.handleInput} />
                          {this.validator.message("sort_name", this.state.sort_name, "required")}
                        </Col>
                        <Col md="3" className="mb-3">
                          <Label htmlFor="symbol">Currency Symbol</Label>
                          <input name="symbol" placeholder="Type Currency Symbol" defaultValue={this.state.symbol} type="text" className={"form-control"}
                                 onChange={this.handleInput} />
                          {this.validator.message("role", this.state.symbol, "required")}
                        </Col>
                        <Col md="auto" className="mb-3">
                          <Label htmlFor="ordering">Ordering</Label>
                          <input name="ordering" placeholder="Type Ordering" defaultValue={this.state.ordering} type="text" className={"form-control"}
                                 onChange={this.handleInput} />
                          {this.validator.message("ordering", this.state.ordering, "required|numeric")}
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

SalaryCurrencyAdd.propTypes = {
  location: PropTypes.object
}

export default SalaryCurrencyAdd
