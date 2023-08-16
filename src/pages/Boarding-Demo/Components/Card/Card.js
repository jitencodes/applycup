import React, { useState } from "react";
import { CheckSquare, Clock, MoreHorizontal } from "react-feather";

import Dropdown from "../Dropdown/Dropdown";

import "./Card.css";
import CardInfo from "./CardInfo/CardInfo";
import PropTypes from "prop-types";
import {CardBody} from "reactstrap";
import {Link} from "react-router-dom";
function sortName(str){
  const matches = str.match(/\b(\w)/g);
  return matches.join("")
}
function Card(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { id, candidate_name, is_favourite } = props.card;

  return (
    <>
      {showModal && (
        <CardInfo
          onClose={() => setShowModal(false)}
          card={props.card}
          boardId={props.boardId}
          updateCard={props.updateCard}
        />
      )}
      <div
          className="card"
          draggable
          onDragEnd={() => props.dragEnded(props.boardId, id)}
          onDragEnter={() => props.dragEntered(props.boardId, id)}
          onClick={() => setShowModal(true)}
      >
        <CardBody className="p-2">
          <div className="d-flex">
            <div className="user-avatar-lg me-3">
              <span className="user-avatar-string">{sortName(candidate_name)}</span>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex">
                <div className="flex-grow-1 align-self-center">
                  <div className="text-muted">
                    <h6 className="candidate-name">{candidate_name}</h6>
                  </div>
                </div>

                <div
                    className="card_top_more"
                    onClick={(event) => {
                      event.stopPropagation();
                      setShowDropdown(true);
                    }}
                >
                  <MoreHorizontal />
                  {showDropdown && (
                      <Dropdown
                          class="board_dropdown"
                          onClose={() => setShowDropdown(false)}
                      >
                        <Link to="#" onClick={() => props.removeCard(props.boardId, id)}>Reject</Link>
                        <Link className="dropdown-item" to="#">Add Favourite</Link>
                        <Link className="dropdown-item" to="#">Add Note</Link>
                        {/* eslint-disable-next-line react/prop-types */}
                        <Link className="dropdown-item" to="#">Reschedule Interview</Link>
                        <Link className="dropdown-item" to="#">Add Feedback</Link>
                        <Link className="dropdown-item" to="#">Edit Details</Link>
                        <Link className="dropdown-item" to="#">Archive</Link>
                        <Link className="dropdown-item" to="#">Reject</Link>
                        <Link className="dropdown-item" to="#">Mark Joined</Link>
                      </Dropdown>
                  )}
                </div>
              </div>
              <div className="d-flex border-top-bar">
                <div className="card-coordinator-icon">
                  {is_favourite === "1" && <i className="bx bxs-star text-warning"></i>}
                  {is_favourite === "0" && <i className="bx bx-star"></i>}
                </div>
                {/*{data.action === "1" && <div className="card-coordinator-icon"><i className="bx bx-calendar"></i></div>}*/}
                <div className="card-coordinator-icon"><i className="bx bx-x-circle"></i></div>
              </div>
            </div>
          </div>
        </CardBody>
      </div>
    </>
  );
}
Card.propTypes = {
  card:PropTypes.object,
  boardId:PropTypes.any,
  updateCard:PropTypes.any,
  dragEnded:PropTypes.any,
  dragEntered:PropTypes.any,
  removeCard:PropTypes.any,
}
export default Card;
