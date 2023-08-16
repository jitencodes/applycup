import React, { useEffect, useRef } from "react";

import "./Dropdown.css";
import PropTypes from "prop-types";

function Dropdown(props) {
  const dropdownRef = useRef();

  const handleClick = (event) => {
    if (
      dropdownRef &&
      !dropdownRef.current?.contains(event.target) &&
      props.onClose
    )
      props.onClose();
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  return (
    <div
      ref={dropdownRef}
      className={`is-dropdown ${props.class ? props.class : ""}`}
    >
      {props.children}
    </div>
  );
}
Dropdown.propTypes = {
  onClose:PropTypes.any,
  children:PropTypes.any,
  class:PropTypes.any
}
export default Dropdown;
