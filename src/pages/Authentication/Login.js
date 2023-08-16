import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import { Alert, Card, CardBody, Col, Container, Row, Label } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

//Social Media Imports
// import { GoogleLogin } from "react-google-login";
// import TwitterLogin from "react-twitter-auth"
// import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

//Import config
// import { facebook, google } from "../../config";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// actions
import { apiError, loginUser , socialLogin} from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo-small.png";
import lightlogo from "../../assets/images/logo-light.svg";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'password_show':false
    };
  }

  componentDidMount() {
    this.props.apiError("");
  }

  handlePasswordView = () => {
    if (this.state.password_show){
      this.setState({password_show:false})
    }else {
      this.setState({password_show:true})
    }
  }


  render() {
    return (
      <React.Fragment>
        <MetaTags>
        <title>Login | Applycup Hiring Solutions</title>
      </MetaTags>
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
                          <p>Sign in to continue to Appy-Cup ATS.</p>
                        </div>
                      </Col>
                      <Col className="col-5 align-self-end">
                        <img src={profile} alt="" className="img-fluid" />
                      </Col>
                    </Row>
                  </div>
                  <CardBody className="pt-0">
                    <div className="auth-logo">
                      <Link to="/" className="auth-logo-light">
                        <div className="avatar-md profile-user-wid mb-4">
                          <span className="avatar-title rounded-circle bg-light">
                            <img
                              src={lightlogo}
                              alt=""
                              className="rounded-circle"
                              // height="34"
                            />
                          </span>
                        </div>
                      </Link>
                      <Link to="/" className="auth-logo-dark">
                        <div className="avatar-md profile-user-wid mb-4">
                          <span className="avatar-title bg-light">
                            <img
                              src={logo}
                              alt=""
                              className="rounded-circle"
                              height="55" width="55"
                            />
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="p-2">
                    {this.props.error && this.props.error ? (
                      <Alert color="danger">{this.props.error}</Alert>
                    ) : null}
                      <Formik
                        enableReinitialize={true}
                        initialValues={{
                          emp_id:
                            (this.state && this.state.emp_id) ||
                            "",
                          password:
                            (this.state && this.state.password) || "",
                        }}
                        validationSchema={Yup.object().shape({
                          emp_id: Yup.string().required(
                            "Please Enter Your Employee ID"
                          ),
                          password: Yup.string().required(
                            "Please Enter Valid Password"
                          ),
                        })}
                        onSubmit={values => {
                          this.props.loginUser(values, this.props.history);
                        }}
                      >
                        {({ errors, status, touched }) => (
                          
                          <Form className="form-horizontal">
                            <div className="mb-3">
                              <Label for="emp_id" className="form-label">
                              Employee ID
                              </Label>
                              <Field
                                name="emp_id"
                                type="text"
                                className={
                                  "form-control" +
                                  (errors.emp_id && touched.emp_id
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <ErrorMessage
                                name="emp_id"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                            <div className="mb-3">
                              <Label for="password" className="form-label">
                                Password
                              </Label>
                              <div className="input-group auth-pass-inputgroup">
                                <Field
                                  name="password"
                                  type={this.state.password_show === true ? 'text':'password'}
                                  autoComplete="true"
                                  className={
                                    "form-control" +
                                    (errors.password && touched.password
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <button
                                  className="btn btn-light"
                                  type="button"
                                  id="password-addon" onClick={this.handlePasswordView}
                                >
                                  <i className={this.state.password_show === true ? 'mdi mdi-eye-off-outline':'mdi mdi-eye-outline'}></i>
                                </button>
                              </div>
                              <ErrorMessage
                              name="password"
                              component="div"
                              className="invalid-feedback"
                            />
                            </div>
                

                            <div className="mt-3 d-grid">
                              <button
                                className="btn btn-primary btn-block"
                                type="submit"
                              >
                                Log In
                              </button>
                            </div>

                            <div className="mt-4 text-center">
                              <Link
                                to="/forgot-password"
                                className="text-muted"
                              >
                                <i className="mdi mdi-lock me-1" /> Forgot your
                                password?
                              </Link>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-5 text-center">
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

Login.propTypes = {
  apiError: PropTypes.any,
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
  socialLogin: PropTypes.func,
};

const mapStateToProps = state => {
  const { error } = state.Login;
  return { error };
};

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError, socialLogin })(Login)
);
