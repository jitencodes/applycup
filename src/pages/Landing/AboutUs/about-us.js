import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//Images
import client1 from "../../../assets/images/brands/apollo.png";
import client2 from "../../../assets/images/brands/cred.png";
import client3 from "../../../assets/images/brands/godrej.png";
import client4 from "../../../assets/images/brands/hero.png";
import client5 from "../../../assets/images/brands/instamojo.png";
import client6 from "../../../assets/images/brands/zolo.png";
import { Image } from "react-bootstrap";

const AboutUs = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1
  };
  return (
    <React.Fragment>
      <section className="section pt-4 bg-white" id="about">
        <Container>
          <Row>
            <Col lg="12">
              <Col lg="12">
                <div className="hori-timeline">
                  <Slider {...settings}>
                    <div className="client-logo">
                      <Image className="img-fluid" src={client1}/>
                    </div>
                    <div className="client-logo">
                      <Image className="img-fluid" src={client2}/>
                    </div>
                    <div className="client-logo">
                      <Image className="img-fluid" src={client3}/>
                    </div>
                    <div className="client-logo">
                      <Image className="img-fluid" src={client4}/>
                    </div>
                    <div className="client-logo">
                      <Image className="img-fluid" src={client5}/>
                    </div>
                    <div className="client-logo">
                      <Image className="img-fluid" src={client6}/>
                    </div>
                  </Slider>
                </div>
              </Col>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default AboutUs;
