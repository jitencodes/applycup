import React from "react";
import {
  Container,
  Row,
  Col
} from "reactstrap";
import { Link } from "react-router-dom";
import main_hero from "../../../assets/images/main-hero-img.svg"
let isToken = localStorage.getItem("authUser")
const Section = () => {
  return (
    <React.Fragment>
      <section className="section hero-section bg-ico-hero" id="home">
        <div className="bg-overlay bg-primary" />
        <Container>
          <Row className="align-items-center">
            <Col lg="5">
              <div className="text-white-50">
                <h1 className="text-white font-weight-semibold mb-3 hero-title">
                  Applicant Tracking System that is <strong>FREE FOREVER</strong>
                </h1>
                <p className="font-size-24">
                  Quicker hiring means two things: One, you save time. Two, you hire before others do.
                </p>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  {isToken === '' && <Link to="/login" className="btn btn-lg btn-success me-1">Login</Link>}
                  {!isToken !== '' && <Link to="/dashboard" className="btn btn-lg btn-success me-1">Dashboard</Link>}
                </div>
              </div>
            </Col>
            <Col lg="5" md="8" sm="10" className="ms-lg-auto">
              <img className="img-fluid" src={main_hero}/>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default Section;
