import React from "react"
import { Container, Row, Col } from "reactstrap"
import { Link } from "react-router-dom"

//Import Components
import FooterLink from "./footer-link"

const Features = () => {
  const footerLinks = [
    {
      title: "Company",
      links: [
        { title: "About Us", link: "#" },
        { title: "Features", link: "#" },
        { title: "Team", link: "#" },
        { title: "Login", link: "#" }
      ],
    },
    {
      title: "Information",
      links: [
        { title: "Privacy Policy", link: "#" },
        { title: "Terms & Conditions", link: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { title: "Blog", link: "#" }
      ],
    },
  ]

  return (
    <React.Fragment>
      <footer className="landing-footer">
        <Container>
          <Row>
            {footerLinks.map((footerLink, key) => (
              <Col lg="3" sm="6" key={key}>
                <div className="mb-4 mb-lg-0">
                  <h5 className="mb-3 footer-list-title">{footerLink.title}</h5>
                  <ul className="list-unstyled footer-list-menu">
                    {footerLink.links.map((Flink, key) => (
                      <li key={key}>
                        <Link to={Flink.link}>{Flink.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            ))}

            <Col lg="3" sm="6">
              <div className="mb-4 mb-lg-0">
                <h5 className="mb-3 footer-list-title">Contact Us</h5>
                <div className="blog-post mb-5">
                  <a rel="noreferrer" href="mailto:info@applycup.com" className="post">
                    <h5 className="post-title">info@applycup.com</h5>
                  </a>
                </div>
                <h5 className="mb-3 footer-list-title">Whatsapp Support No :</h5>
                <div className="blog-post">
                  <a rel="noreferrer" href="https://wa.me/7796699982?text=Hi" className="post">
                    <h5 className="post-title">+91 7796699982 (9AM - 7PM)</h5>
                  </a>
                </div>
              </div>
            </Col>
          </Row>

          <hr className="footer-border my-3" />

          <FooterLink />
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Features
