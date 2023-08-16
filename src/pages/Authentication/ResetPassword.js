import PropTypes from "prop-types";
import React, { Component } from "react";
import { Card, CardBody, Col, Container, Label, Row } from "reactstrap";
import SimpleReactValidator from "simple-react-validator";
import { get, put } from "../../helpers/api_helper";
import { RESET_PASSWORD, VERIFY_LINK } from "../../helpers/api_url_helper";
import toastr from "toastr";
// Redux
import { Link } from "react-router-dom";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo-small.png";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submit: false,
            password: "",
            form_error: false,
            confirm_password: "",
            link: process.env.REACT_APP_DOMAIN,
            handleResponse: null,
        };
        this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    }

    componentDidMount() {
        this.check_link()
    }

    check_link = () => {
        get(VERIFY_LINK, {params: {token: this.props.match.params.id}}).then(res => {
            if(res.status === "false"){
                toastr.error(res.msg)
                // eslint-disable-next-line react/prop-types
                const { history } = this.props;
                // eslint-disable-next-line react/prop-types
                history.push("/login");
            }
        }).catch(error => {
            toastr.error(error.response.msg)
            // eslint-disable-next-line react/prop-types
            const { history } = this.props;
            // eslint-disable-next-line react/prop-types
            history.push("/login");
        })
    }

    handleInput = (e) => {
        this.setState({ [e.target.name]: e.target.value },this.check_password_eq);
    };
    check_password_eq = () => {
        if(this.state.password !== "" && this.state.confirm_password !== ""){
            if(this.state.password !== this.state.confirm_password){
                this.setState({form_error:true})
            }else{
                this.setState({form_error:false})
            }
        }
        
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.validator.allValid()) {
            if(this.state.password !== this.state.confirm_password){
                return false
            }
            var data = {
                "password": this.state.password,
                "confirm_password": this.state.confirm_password,
                "token": this.props.match.params.id,
                "link": this.state.link
            };
            this.setState({ submit: true });
            put(RESET_PASSWORD, data).then(response => {
                if (response.status) {
                    this.setState({ submit: false });
                    toastr.success("Password change successfully");
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
                                                    <p>Reset password.</p>
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
                                                        New Password
                                                    </Label>
                                                    <input
                                                        name="password"
                                                        placeholder="Enter Password"
                                                        type="password"
                                                        className={"form-control"} onChange={this.handleInput}
                                                    />
                                                    {this.validator.message("password", this.state.password, "required")}
                                                </div>
                                                <div className="mb-3">
                                                    <Label for="email" className="form-label">
                                                        Confirm Password
                                                    </Label>
                                                    <input
                                                        name="confirm_password"
                                                        type="password"
                                                        placeholder="Enter Confirm Password"
                                                        className={"form-control"} onChange={this.handleInput}
                                                    />
                                                    {this.validator.message("confirm_password", this.state.confirm_password, "required")}
                                                    {this.state.form_error === true && <div className="srv-validation-message">Password and confirm password does not match</div>}
                                                </div>
                                                <div className="text-end">
                                                    <button
                                                        className="btn btn-primary w-md"
                                                        type="submit" disabled={submit}
                                                    >
                                                        {submit ? 'Please wait...' : 'Submit'}
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

ResetPassword.propTypes = {
    history: PropTypes.object,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string
        })
    }),
    location: PropTypes.object
};


export default ResetPassword