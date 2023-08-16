import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Row, Col, Collapse } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import classname from "classnames";

//i18n
import { withTranslation } from "react-i18next";

import { connect } from "react-redux";

const Navbar = props => {
  const [master, setmaster] = useState(false);
  const user = localStorage.getItem("authUser") !== "" && JSON.parse(localStorage.getItem("authUser"));
  useEffect(() => {
    var matchingMenuItem = null;
    var ul = document.getElementById("navigation");
    var items = ul.getElementsByTagName("a");
    for (var i = 0; i < items.length; ++i) {
      if (props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  });

  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      parent2.classList.add("active"); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add("active"); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add("active"); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("active"); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add("active"); // li
            }
          }
        }
      }
    }
    return false;
  }

  return (
    <React.Fragment>
      {/*<div className="topnav">*/}
      {/*  <div className="container-fluid">*/}
      <nav
        className="navbar navbar-light navbar-expand-lg topnav-menu"
        id="navigation"
      >
        <Collapse
          isOpen={props.leftMenu}
          className="navbar-collapse"
          id="topnav-menu-content"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/dashboard"
              >
                {props.t("Dashboard")}
              </Link>
            </li>
            {user.role_id === "1" &&
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/user-boarding"
                >
                  {props.t("Users")}
                </Link>
              </li>
            }
            {(user.role_id === "1" || user.role_id === "2") &&
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/clients"
                >
                  {props.t("Clients")}
                </Link>
              </li>
            }
            {user.role_id === "1" && <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle arrow-none"
                onClick={e => {
                  e.preventDefault();
                  setmaster(!master);
                }}
                to="/#"
              >
                {props.t("Masters")} {props.menuOpen}
                <div className="arrow-down"></div>
              </Link>
              <div
                className={classname("dropdown-menu", { show: master })}
              >
                <Link to="/job-roles" className="dropdown-item">
                  {props.t("Job Role")}
                </Link>
                <Link to="/location" className="dropdown-item">
                  {props.t("Location/City")}
                </Link>
                <Link to="/skills" className="dropdown-item">
                  {props.t("Skills")}
                </Link>
                <Link to="/qualifications" className="dropdown-item">
                  {props.t("Qualifications")}
                </Link>
                <Link to="/client-source" className="dropdown-item">
                  {props.t("Client Source")}
                </Link>
                <Link to="/candidate-source" className="dropdown-item">
                  {props.t("Candidate Source")}
                </Link>
                <Link to="/client-status" className="dropdown-item">
                  {props.t("Client Status")}
                </Link>
                <Link to="/requirement-status" className="dropdown-item">
                  {props.t("Requirement Status")}
                </Link>
                {/* <Link to="/candidate-status" className="dropdown-item">
                  {props.t("Candidate Status")}
                </Link> */}
                <Link to="/salary-currency" className="dropdown-item">
                  {props.t("Salary Currency")}
                </Link>
                <Link to="/notice-period" className="dropdown-item">
                  {props.t("Notice Period")}
                </Link>
              </div>
            </li>
            }
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/openings"
              >
                {props.t("Openings")}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/candidates"
              >
                {props.t("Candidates")}
              </Link>
            </li>

            {/* <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/todo"
                  >
                    {props.t("Todo List")}
                  </Link>
                </li> */}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/reports"
              >
                {props.t("Reports")}
              </Link>
            </li>
            {user.role_id === "1" && <li className="nav-item">
              <Link className="nav-link" to="/blogs">
                {props.t("Blogs")}
              </Link>
            </li>}
          </ul>
        </Collapse>
      </nav>
      {/*  </div>*/}
      {/*</div>*/}
    </React.Fragment>
  );
};

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout;
  return { leftMenu };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
);
