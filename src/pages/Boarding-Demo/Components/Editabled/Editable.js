import React, { useState } from "react";

import { X } from "react-feather";

import "./Editable.css";
import PropTypes from "prop-types";

function Editable(props) {
  const [isEditable, setIsEditable] = useState(false);
  const [inputText, setInputText] = useState(props.defaultValue || "");

  const submission = (e) => {
    e.preventDefault();
    if (inputText && props.onSubmit) {
      setInputText("");
      props.onSubmit(inputText);
    }
    setIsEditable(false);
  };

  return (
    <div className="editable">
      {isEditable ? (
        <form
          className={`editable_edit ${props.editClass ? props.editClass : ""}`}
          onSubmit={submission}
        >
          <input
            type="text"
            value={inputText}
            placeholder={props.placeholder || props.text}
            onChange={(event) => setInputText(event.target.value)}
            autoFocus
          />
          <div className="editable_edit_footer">
            <button type="submit">{props.buttonText || "Add"}</button>
            <X onClick={() => setIsEditable(false)} className="closeIcon" />
          </div>
        </form>
      ) : (
        <button onClick={() => setIsEditable(true)} type="button" className={`btn-rounded mb-2 me-2 btn btn-outline-primary ${
        props.displayClass ? props.displayClass : ""
      }`}><i className="mdi mdi-plus me-1"></i> {props.text}</button>
      )}
    </div>
  );
}
Editable.propTypes = {
  defaultValue:PropTypes.any,
  onSubmit:PropTypes.any,
  editClass:PropTypes.any,
  placeholder:PropTypes.any,
  text:PropTypes.any,
  buttonText:PropTypes.any,
  displayClass:PropTypes.any
}
export default Editable;
