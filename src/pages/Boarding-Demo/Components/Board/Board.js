import React, { useState } from "react";
import { MoreHorizontal } from "react-feather";

import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import Editable from "../Editabled/Editable";

import "./Board.css";
import PropTypes from "prop-types";

function Board(props) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="board" draggable
         onDragEnd={() => props.dragBoardEnded(props.index)}
         onDragEnter={() => props.dragBoardEntered(props.index)}>
      <div className="board_header">
        <p className="board_header_title">
            <span className="card-count">{props.board?.cards?.length || 0}</span>
            <span>{props.board?.title}</span>
        </p>
        <div
          className="board_header_title_more"
          onClick={() => setShowDropdown(true)}
        >
          <MoreHorizontal />
          {showDropdown && (
            <Dropdown
              class="board_dropdown"
              onClose={() => setShowDropdown(false)}
            >
              <a href="#" onClick={() => props.removeBoard()}>Delete Stage</a>
            </Dropdown>
          )}
        </div>
      </div>
      <div className="board_cards custom-scroll">
          <Editable
              text="Add Candidate"
              placeholder="Enter Card Title"
              displayClass="board_add-card"
              editClass="board_add-card_edit"
              onSubmit={(value) => props.addCard(props.board?.id, value)}
          />
        {props.board?.cards?.map((item) => (
          <Card
            key={item.id}
            card={item}
            boardId={props.board.id}
            removeCard={props.removeCard}
            dragEntered={props.dragEntered}
            dragEnded={props.dragEnded}
            updateCard={props.updateCard}
          />
        ))}
      </div>
    </div>
  );
}
Board.propTypes = {
    board:PropTypes.object,
    removeBoard:PropTypes.any,
    dragEntered:PropTypes.any,
    dragEnded:PropTypes.any,
    removeCard:PropTypes.any,
    updateCard:PropTypes.any,
    addCard:PropTypes.any,
    dragBoardEnded:PropTypes.any,
    dragBoardEntered:PropTypes.any,
    index:PropTypes.number
}
export default Board;
