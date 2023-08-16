import React, {useEffect, useState} from "react";

import Board from "./Components/Board/Board";

import "./borading.css";
import Editable from "./Components/Editabled/Editable";
import {get} from "../../helpers/api_helper";
import {JOB_BOARDING} from "../../helpers/api_url_helper";
import toastr from "toastr";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import {Col, Container, Row} from "reactstrap";

function Boarding(props) {
    const [boards, setBoards] = useState([]);
    const [search, setSearch] = useState("");
    const [job_name, setJobName] = useState("");
    const [job_loction, setJobLocation] = useState("");
    useEffect(() => {
        const params = {job_id: props.match.params.id, keyword: ""};
        get(JOB_BOARDING, {params: params}).then(res => {
            if (res) {
                setBoards(res.data.requirement_screening)
                setJobName(res.data.requirement_role)
                setJobLocation(res.data.location)
                // setDataLoaded(true)
            }
        }).catch(err => {
            toastr.error(err)
        })
    }, [search]);
    const [targetCard, setTargetCard] = useState({
        bid: "",
        cid: "",
    });

    const [targetBoard, setTargetBoard] = useState({
        index: ""
    });

    const addboardHandler = (name) => {
        const tempBoards = [...boards];
        tempBoards.push({
            id: Date.now() + Math.random() * 2,
            title: name,
            cards: [],
        });
        setBoards(tempBoards);
    };

    const removeBoard = (id) => {
        const index = boards.findIndex((item) => item.id === id);
        if (index < 0) return;

        const tempBoards = [...boards];
        tempBoards.splice(index, 1);
        setBoards(tempBoards);
    };

    const addCardHandler = (id, title) => {
        const index = boards.findIndex((item) => item.id === id);
        if (index < 0) return;

        const tempBoards = [...boards];
        tempBoards[index].cards.push({
            id: Date.now() + Math.random() * 2,
            candidate_name: title,
            labels: [],
            date: "",
            tasks: [],
        });
        setBoards(tempBoards);
    };

    const removeCard = (bid, cid) => {
        const index = boards.findIndex((item) => item.id === bid);
        if (index < 0) return;

        const tempBoards = [...boards];
        const cards = tempBoards[index].cards;

        const cardIndex = cards.findIndex((item) => item.id === cid);
        if (cardIndex < 0) return;

        cards.splice(cardIndex, 1);
        setBoards(tempBoards);
    };

    const dragEnded = (bid, cid) => {
        let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
        s_boardIndex = boards.findIndex((item) => item.id === bid);
        if (s_boardIndex < 0) return;

        s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
            (item) => item.id === cid
        );
        if (s_cardIndex < 0) return;

        t_boardIndex = boards.findIndex((item) => item.id === targetCard.bid);
        if (t_boardIndex < 0) return;

        t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
            (item) => item.id === targetCard.cid
        );
        if (t_cardIndex < 0) return;
        const tempBoards = [...boards];
        const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
        tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
        tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
        setBoards(tempBoards);

        setTargetCard({
            bid: "",
            cid: "",
        });
    };

    const dragEntered = (bid, cid) => {
        if (targetCard.cid === cid) return;
        setTargetCard({
            bid,
            cid,
        });
    };

    const dragBoardEnded = (index) => {
        let s_boardIndex,t_boardIndex;
        s_boardIndex = boards.findIndex((item,key) => key === index);
        if (s_boardIndex < 0) return;
        t_boardIndex = boards.findIndex((item,key) => key === targetBoard.index);
        if (t_boardIndex < 0) return;
        const tempBoards = [...boards];
        const sourceBoard = tempBoards[s_boardIndex];
        tempBoards.splice(s_boardIndex, 1);
        tempBoards.splice(t_boardIndex, 0, sourceBoard);
        setBoards(tempBoards);
    }

    const dragBoardEntered = (index) => {
        if (targetBoard.index === index) return;
        setTargetBoard({
            index
        });
    }

    const updateCard = (bid, cid, card) => {
        const index = boards.findIndex((item) => item.id === bid);
        if (index < 0) return;

        const tempBoards = [...boards];
        const cards = tempBoards[index].cards;

        const cardIndex = cards.findIndex((item) => item.id === cid);
        if (cardIndex < 0) return;

        tempBoards[index].cards[cardIndex] = card;

        setBoards(tempBoards);
    };

    useEffect(() => {
        localStorage.setItem("prac-kanban", JSON.stringify(boards));
    }, [boards]);

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>{job_name} | {process.env.REACT_APP_PROJECTNAME}</title>
                </MetaTags>
                <Container>
                    <div className="mb-2 row">
                        <div className="col-sm-4">
                            <div className="mt-2">
                                <h4>{job_name}</h4>
                                <p>{job_loction}</p>
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <Row className={"justify-content-end g-2"}>
                                <Col md={"6"}>
                                    <div className="search-box mb-2 me-2">
                                        <div className="position-relative">
                                            <input
                                                type="text"
                                                className="form-control bg-light border-light rounded"
                                                placeholder="Search candidates within this job"
                                            />
                                            <i className="bx bx-search-alt search-icon"></i>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={"auto"}>
                                    <div className="text-sm-end">
                                        {/*<button type="button" className="btn-rounded mb-2 me-2 btn btn-outline-primary"><i className="mdi mdi-plus me-1"></i> Add Candidate</button>*/}
                                        <Editable
                                            displayClass="app_boards_add-board"
                                            editClass="app_boards_add-board_edit"
                                            placeholder="Enter Stage Name"
                                            text="Add Stage"
                                            buttonText="Add Stage"
                                            onSubmit={addboardHandler}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="app">
                        <div className="app_boards_container">
                            <div className="app_boards">
                                {boards.map((item,index) => (
                                    <Board
                                        dragBoardEnded={dragBoardEnded}
                                        dragBoardEntered={dragBoardEntered}
                                        key={item.id}
                                        index={index}
                                        board={item}
                                        addCard={addCardHandler}
                                        removeBoard={() => removeBoard(item.id)}
                                        removeCard={removeCard}
                                        dragEnded={dragEnded}
                                        dragEntered={dragEntered}
                                        updateCard={updateCard}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
}

Boarding.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string
        })
    }),
    location: PropTypes.object
}
export default Boarding;