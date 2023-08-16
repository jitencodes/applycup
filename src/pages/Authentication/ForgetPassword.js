import PropTypes from "prop-types";
import React, { Component } from "react";
import { Alert, Card, CardBody, Col, Container, Label, Row } from "reactstrap";
import SimpleReactValidator from "simple-react-validator";
import { put } from "../../helpers/api_helper";
import { FORGET_PASSWORD } from "../../helpers/api_url_helper";
import toastr from "toastr";
// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo-small.png";

class ForgetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submit: false,
      email: "",
      employee_id: "",
      link: process.env.REACT_APP_DOMAIN,
      handleResponse: null,
    };
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
  }
  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      var data = {
        "empID": this.state.employee_id,
        "email": this.state.email,
        "link": this.state.link
      };
      this.setState({ submit: true });
      put(FORGET_PASSWORD, data).then(response => {
        if (response.status) {
          this.setState({ submit: false });
          toastr.success("Password reset link has been sent to your email");
          // eslint-disable-next-line react/prop-types
          const { history } = this.props;
          // eslint-disable-next-line react/prop-types
          history.push("/login");
        }
      }).catch(err => {
        toastr.error(err.message);
        this.setState({ submit: false });
      });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  render() {
    const { submit } = this.state
    return (
      <React.Fragment>
        <div className="home-btn d-none d-sm-block">
          <Link to="/" className="text-dark">
            <i className="bx bx-home h2" />
          </Link>
        </div>
        <div className="account-pages my-5 pt-sm-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="overflow-hidden">
                  <div className="bg-primary bg-soft">
                    <Row>
                      <Col className="col-7">
                        <div className="text-primary p-4">
                          <h5 className="text-primary">Welcome Back !</h5>
                          <p>Sign in to continue to {process.env.REACT_APP_PROJECTNAME} .</p>
                        </div>
                      </Col>
                      <Col className="col-5 align-self-end">
                        <img src={profile} alt="" className="img-fluid" />
                      </Col>
                    </Row>
                  </div>
                  <CardBody className="pt-0">
                    <div>
                      <Link to="/">
                        <div className="avatar-md profile-user-wid mb-4">
                          <span className="avatar-title rounded-circle bg-light">
                            <img
                              src={logo}
                              alt=""
                              className="rounded-circle"
                              height="34"
                            />
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="p-2">
                      <form className="form-horizontal" onSubmit={this.handleSubmit}>
                        <div className="mb-3">
                          <Label for="email" className="form-label">
                            Employee ID
                          </Label>
                          <input
                            name="employee_id"
                            placeholder="Enter Employee ID"
                            type="text"
                            className={"form-control"} onChange={this.handleInput}
                          />
                          {this.validator.message("employee_id", this.state.employee_id, "required")}
                        </div>
                        <div className="mb-3">
                          <Label for="email" className="form-label">
                            Employee Email
                          </Label>
                          <input
                            name="email"
                            type="email"
                            placeholder="Enter Employee Email"
                            className={"form-control"} onChange={this.handleInput}
                          />
                          {this.validator.message("email", this.state.email, "required|email")}
                        </div>
                        <div className="text-end">
                          <button
                            className="btn btn-primary w-md"
                            type="submit" disabled={submit}
                          >
                            {submit ? 'Please wait...' : 'Reset'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-5 text-center">
                  <p>
                    Go back to{" "}
                    <Link to="login" className="fw-medium text-primary">
                      Login
                    </Link>{" "}
                  </p>
                  <p>
                    © {new Date().getFullYear()} {process.env.REACT_APP_PROJECTNAME}
                    <i className="mdi mdi-heart text-danger ms-2 me-2" />by Innowrap
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

ForgetPasswordPage.propTypes = {
  forgetError: PropTypes.func,
  forgetSuccessMsg: PropTypes.string,
  history: PropTypes.object,
  userForgetPassword: PropTypes.any,
  location: PropTypes.object
};

const mapStateToProps = state => {
  const { forgetError, forgetSuccessMsg } = state.ForgetPassword;
  return { forgetError, forgetSuccessMsg };
};

export default withRouter(
  connect(mapStateToProps)(ForgetPasswordPage)
);