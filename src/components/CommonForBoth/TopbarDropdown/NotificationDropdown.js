import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
//i18n
import { withTranslation } from "react-i18next";

const NotificationDropdown = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className="bx bx-bell bx-tada" />
          <span className="badge bg-danger rounded-pill">0</span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
          {/*<div className="p-3">*/}
          {/*  <Row className="align-items-center">*/}
          {/*    <Col>*/}
          {/*      <h6 className="m-0"> {props.t("Notifications")} </h6>*/}
          {/*    </Col>*/}
          {/*    <div className="col-auto">*/}
          {/*      <a href="#" className="small">*/}
          {/*        {" "}*/}
          {/*        View All*/}
          {/*      </a>*/}
          {/*    </div>*/}
          {/*  </Row>*/}
          {/*</div>*/}

          <SimpleBar style={{ height: "auto" }}>
            <h6 className="text-center p-3">No Notification</h6>
          </SimpleBar>
          {/*<div className="p-2 border-top d-grid">*/}
          {/*  <Link className="btn btn-sm btn-link font-size-14 text-center" to="#">*/}
          {/*    <i className="mdi mdi-arrow-right-circle me-1"></i> <span key="t-view-more">{props.t("View More..")}</span>*/}
          {/*  </Link>*/}
          {/*</div>*/}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(NotificationDropdown);

NotificationDropdown.propTypes = {
  t: PropTypes.any
};