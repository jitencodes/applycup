import React from "react";

import "./Modal.css";
import PropTypes from "prop-types";

function Modal(props) {
  return (
    <div
      className="modal"
      onClick={() => (props.onClose ? props.onClose() : "")}
    >
      <div
        className="modal_content custom-scroll"
        onClick={(event) => event.stopPropagation()}
      >
        {props.children}
      </div>
    </div>
  );
}
Modal.propTypes = {
  onClose:PropTypes.any,
  children:PropTypes.any
}
export default Modal;
