import React, { useEffect, useRef, useState } from "react";
import Board from "@lourenci/react-kanban";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import { CSVLink } from "react-csv";
import { Col, Container, Row, Modal, Button } from "reactstrap";
import { withRouter } from "react-router-dom";
import "assets/scss/tasks.scss";
import CardTaskBox from "./card-task-box";
import { get, put, post } from "../../../helpers/api_helper";
import { CANDIDATE_FAVOURITE, CANDIDATE_STAGE_MOVE, JOB_BOARDING, JOB_STAGE_MOVE, CANDIDATE_REJECT, JOB_STAGE_UPDATE, JOB_STAGE_ADD, DELETE_CANDIDATE_FEEDBACK, EXPORT_JOB_BOARD, CANDIDATE_HOLD } from "../../../helpers/api_url_helper";
import toastr from "toastr";
import RenderCardTitle from "./render-card-title";
import CandidateFeedback from "./feedback";
import FeedbackView from "./feedback-view";
import InterviewSchedule from "./interview-schedule";
import AddCandidate from "../../Candidate/add-candidate"
import useCandidate from "../../Candidate/useCandidate"
import { lowerCase, upperCase } from "lodash";
import parseJwt from "components/Common/parseJwt";
const notification = (type, msg) => {
    type === 'success' && toastr.success(msg)
    type === 'error' && toastr.error(msg)
}
const TasksKanban = props => {
    const [board, setBoard] = useState();
    const [search, setSearch] = useState("");
    const [job_name, setJobName] = useState("");
    const [job_loction, setJobLocation] = useState("");
    const [stage_id, setStageId] = useState("")
    const [stageName, setStageName] = useState("")
    const [stageOrdering, setStageOrdering] = useState("")
    const [defaultStage, setdefaultStage] = useState("")
    const [tempOrdering, setTempOrdering] = useState("")
    const [stageAction, setStageAction] = useState("0")
    const [candidate_name, setCandidateName] = useState("")
    const [DataLoaded, setDataLoaded] = useState(false);
    const [editStageModal, setEditStageModal] = useState(false)
    const [addStage, setAddStageModal] = useState(false)
    const [stageslist, setStagesList] = useState([])
    const [tempstages, setTempStages] = useState([])
    const [isFeedback, setIsFeedback] = useState(false)
    const [feedBackData, setFeedBackData] = useState([])
    const [BoardReload, setBoardReload] = useState(false)
    const [showCandidateFeedback, setShowCandidateFeedback] = useState(false)
    const [FeedbackParam, setFeedbackParam] = useState([])
    const [InterviewModal, setInterviewModal] = useState(false)
    const [interviewParam, setinterviewParam] = useState([])
    const { isShowing, toggle } = useCandidate();
    const [newData, setNewData] = useState([]);
    const [headers, setHeaders] = useState([]);
    // Reject data set -
    const [isReject, setIsReject] = useState(false)
    const [isDisableBtn, setisDisableBtn] = useState(false)
    const [isRejectBtn, setIsRejectBtn] = useState(false)
    const [rejectFeedback, setRejectFeedback] = useState("")
    const [reject_stage, setRejectStage] = useState("");
    const [reject_type, setRejectType] = useState("");
    const [isRemark, setIsRemark] = useState(false);
    const [user_data, set_user_data] = useState(false);
    const [user_role, setUserRole] = useState("");
    const [requirement_candidate_screening_id, setRequirementCandidateScreeningId] = useState("");
    const user = localStorage.getItem("authUser") !== "" && JSON.parse(localStorage.getItem("authUser"));
    if (!user_data) {
        set_user_data(true)
        const decodedJwt = parseJwt(user.token);
        if (typeof decodedJwt == "object") {
            setUserRole(decodedJwt.role_id)
        }
    }
    const csvInstance = useRef();
    useEffect(() => {
        if(DataLoaded === false){
            BoardCall()
        }
    }, [search, BoardReload]);

    const BoardCall = () => {
        const params = { job_id: props.match.params.id, keyword: search };
        get(JOB_BOARDING, { params: params }).then(res => {
            if (res.status) {
                setDataLoaded(true)
                setBoard({ columns: res.data.requirement_screening })
                setJobName(res.data.requirement_role)
                setJobLocation(res.data.location)
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }

    const ManageFeedback = (id, name, stage_id, type, edit_id) => {
        setFeedBackData({ id: id, name: name, type: type, edit_id: edit_id, job_id: props.match.params.id, stage_id: stage_id })
        setIsFeedback(true)
        setStageId(stage_id)
        setShowCandidateFeedback(false)
        setFeedbackParam([])
    }
    const hidefeedback = (a) => {
        setIsFeedback(a)
    }
    const hideCandidatefeed = () => {
        setShowCandidateFeedback(false)
        setFeedbackParam([])
    }
    const deletefeedback = (id) => {
        let formData = {
            id: id,
            job_id: props.match.params.id
        }
        put(DELETE_CANDIDATE_FEEDBACK, formData).then(res => {
            if (res.status) {
                setShowCandidateFeedback(false)
                setFeedbackParam([])
                toastr.success(res.message)
            }
        }).catch(err => {
            toastr.error(err)
        })
    }
    const reloadBoard = () => {
        setBoardReload(!BoardReload)
    }
    const onCardDragEnd = (data, from, to) => {
        let toColumnId = to.toColumnId, toPosition = to.toPosition, source_id = data.id, fromColumnId = from.fromColumnId, fromPosition = from.fromPosition
        let formData = {
            "requirement_screening_level_id": toColumnId,
            "ordering": toPosition + 1,
            "id": source_id,
            "job_id": props.match.params.id
        }
        put(CANDIDATE_STAGE_MOVE, formData).then(res => {
            if (res.status) {
                setBoard({ columns: res.data.requirement_screening })
                setDataLoaded(true)
                toastr.success(res.message)
            }
        }).catch(err => {
            toastr.error(err)
        })
    }
    // Stages move ----
    const onColumnDragEnd = (data, fromData, toData) => {
        console.log(data);
        if (data.is_fixed === "0") {
            let from = fromData.fromPosition, to = toData.toPosition, job_id = data.requirement_id, stage_id = data.id;
            let formData = {
                "from": from,
                "to": to,
                "job_id": job_id,
                "stage_id": stage_id
            }
            put(JOB_STAGE_MOVE, formData).then(res => {
                if (res.status) {
                    setBoard({ columns: res.data.requirement_screening })
                    setDataLoaded(true)
                    toastr.success(res.message)
                }
            }).catch(err => {
                toastr.error(err?.response?.data?.message)
            })
        } else {

        }
    }

    // Candidate drop, decline, not show and reject -----
    const deleteTask = (id, candidate_name, stage, type, is_remark) => {
        setRequirementCandidateScreeningId(id)
        setCandidateName(candidate_name)
        setIsReject(true)
        setRejectType(type)
        setRejectStage(stage)
        setIsRemark(is_remark)
    }

    const editStage = (id, title, ordering, action) => {
        setStageId(id)
        setStageName(title)
        let stages = [];
        board?.columns?.map((val, key) => {
            stages.push({ id: val.id, title: val.title })
        })
        setStagesList(stages)
        setTempStages(stages)
        let Index = 0
        stages.map((val, key) => {
            if (val.id == id) {
                if (stages.length > (key + 1)) {
                    setdefaultStage(stages[key + 1].id)
                } else {
                    setdefaultStage(stages[key - 1].id)
                }
                Index = key
            }
        });
        setStageOrdering(Index)
        setTempOrdering(Index);
        setStageAction(action)
        setEditStageModal(true);
    }

    const RejectCandidate = () => {
        let formData = {
            'requirement_candidate_screening_id': requirement_candidate_screening_id,
            'feedback': rejectFeedback,
            'reject_stage': reject_stage,
            'remark': isRemark,
            'reject_action_type': reject_type,
            'job_id': props.match.params.id
        }
        if (isRejectBtn === true) { return false }
        setIsRejectBtn(true)
        put(CANDIDATE_REJECT, formData).then(res => {
            if (res.status) {
                setBoard({ columns: res.data.requirement_screening })
                setDataLoaded(true)
                setRequirementCandidateScreeningId("")
                setCandidateName("")
                setRejectFeedback("")
                setIsReject(false)
                setIsRejectBtn(false)
                setRejectType("")
                setRejectStage("")
                setIsRemark(false)
                toastr.success(res.message)
            }
        }).catch(err => {
            toastr.error(err)
            setIsRejectBtn(false)
        })
    }

    const MangeCandidate = (candidate, type) => {
        type === "favorite" && make_favourite(candidate.candidate_name, candidate.id, candidate.is_favourite)
    }

    const TempStage = (e) => {
        let s_boardIndex, t_boardIndex;
        s_boardIndex = stageslist.findIndex((item) => item.id === e.value);
        if (s_boardIndex < 0) return;

        t_boardIndex = stageslist.findIndex((item) => item.id === stage_id);
        if (t_boardIndex < 0) return;
        if (s_boardIndex > 0) {
            s_boardIndex - 1 !== 0 && (s_boardIndex = s_boardIndex - 1)
        }
        const tempBoards = [...stageslist];
        const sourceBoard = tempBoards[t_boardIndex];
        tempBoards.splice(t_boardIndex, 1);
        tempBoards.splice(s_boardIndex, 0, sourceBoard);
        setTempStages(tempBoards);
        setTempOrdering(s_boardIndex);
        setStageOrdering(t_boardIndex)
    }

    const UpdateStage = (e) => {
        let formData = {
            "from": stageOrdering,
            "to": tempOrdering,
            "job_id": props.match.params.id,
            "stage_id": stage_id,
            "stage_name": stageName,
            "action": stageAction,
        }
        setisDisableBtn(true)
        put(JOB_STAGE_UPDATE, formData).then(res => {
            if (res.status) {
                setBoard({ columns: res.data.requirement_screening })
                setDataLoaded(true)
                setisDisableBtn(false)
                setEditStageModal(false);
                toastr.success(res.message)
            }
        }).catch(err => {
            toastr.error(err)
            setisDisableBtn(false)
        })
    }

    const AddStage = (e) => {
        let stages = [];
        board?.columns?.map((val, key) => {
            stages.push({ id: val.id, title: val.title })
        })
        setStagesList(stages)
        setTempStages(stages)
        setAddStageModal(true)
        setTempOrdering(0)
        setStageOrdering(0)
    }

    const AddTempStage = () => {
        let s_boardIndex;
        let before_stage = document.getElementById('stage_position').value
        s_boardIndex = stageslist.findIndex((item) => item.id === before_stage);
        if (s_boardIndex < 0) return;
        let stage_name = document.getElementById('stage_name').value
        if (stage_name) {
            let sourceBoard = {
                id: "0",
                title: stage_name
            }
            const tempBoards = [...stageslist];
            tempBoards.splice(s_boardIndex, 0, sourceBoard);
            setTempStages(tempBoards);
            setTempOrdering(s_boardIndex);
        } else {
            setTempStages(stageslist);
        }
    }

    const SubmitStage = () => {
        let stage_name = document.getElementById('stage_name').value
        if (stage_name !== undefined && stage_name !== '') {
            let formData = {
                "from": 0,
                "to": tempOrdering,
                "job_id": props.match.params.id,
                "stage_name": stage_name,
                "action": stageAction,
            }
            setisDisableBtn(true)
            post(JOB_STAGE_ADD, formData).then(res => {
                if (res.status) {
                    setBoard({ columns: res.data.requirement_screening })
                    setDataLoaded(true)
                    setisDisableBtn(false)
                    setAddStageModal(false);
                    setStageName("")
                    toastr.success(res.message)
                }
            }).catch(err => {
                toastr.error(err)
                setisDisableBtn(false)
            })
        } else {
            toastr.error("Please enter stage name")
        }
    }

    const showFeedback = (candidate_id) => {
        setFeedbackParam({ candidate_id: candidate_id, job_id: props.match.params.id, job_name: job_name })
        setShowCandidateFeedback(true)
    }

    const scheduleInterview = (id, candidate_name, stage_id, stage_name, type) => {
        setinterviewParam({ id: id, candidate_name: candidate_name, stage_id: stage_id, stage_name: stage_name, job_name: job_name, type: type })
        setInterviewModal(true)
    }

    const interview_hide = (e) => {
        setinterviewParam([])
        setInterviewModal(e)
        setBoardReload(!BoardReload)
    }

    const downloadData = () => {
        const params = { job_id: props.match.params.id };
        get(EXPORT_JOB_BOARD, { params: params }).then(response => {
            if (response.status) {
                setHeaders(response.headers)
                setNewData(response.data);
                if (newData && csvInstance.current && csvInstance.current.link) {
                    setTimeout(() => {
                        csvInstance.current.link.click();
                        setNewData([]);
                    });
                }
            } else {
                toastr.error(response.message)
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }

    const selectAction = (id, stage) => {
        let formData = {
            "requirement_screening_level_id": stage,
            "ordering": 1,
            "id": id,
            "job_id": props.match.params.id
        }
        put(CANDIDATE_STAGE_MOVE, formData).then(res => {
            if (res.status) {
                setBoard({ columns: res.data.requirement_screening })
                setDataLoaded(true)
                toastr.success(res.message)
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }

    const holdAction = (id, stage) => {
        let formData = {
            "id": id,
            "requirement_screening_level_id": stage,
            'job_id': props.match.params.id
        }
        put(CANDIDATE_HOLD, formData).then(res => {
            if (res.status) {
                setBoard({ columns: res.data.requirement_screening })
                setDataLoaded(true)
                toastr.success(res.message)
            }
        }).catch(err => {
            toastr.error(err.response.data.message)
        })
    }

    const make_favourite = (candidate_name, id, is_favourite) => {
        let favourite = 0;
        let marked = "remove"
        if (is_favourite == 0) {
            favourite = 1;
            marked = "add"
        }
        let formData = {
            "screen_id": id,
            "is_favourite": favourite
        }
        put(CANDIDATE_FAVOURITE, formData).then(res => {
            if (res.status) {
                setBoardReload(!BoardReload)
                notification('success', `${candidate_name} favorite list in ${marked}`)
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }

    useEffect(() => {
        if (defaultStage) { }
    }, [defaultStage]);
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>{job_name} | {process.env.REACT_APP_PROJECTNAME}</title>
                </MetaTags>
                <Container>
                    <div className="mb-2 row">
                        <div className="col-sm-3">
                            <div className="mt-2">
                                <h4>{job_name}</h4>
                                <p>{job_loction}</p>
                            </div>
                        </div>
                        <div className="col-sm-9 align-self-center">
                            <Row className={"justify-content-end g-2"}>
                                <Col md={"6"}>
                                    <div className="search-box mb-2 me-2">
                                        <div className="position-relative">
                                            <input
                                                type="text" onChange={e => { setSearch(e.target.value) }}
                                                className="form-control bg-light border-light rounded"
                                                placeholder="Search candidates within this job"
                                            />
                                            <i className="bx bx-search-alt search-icon"></i>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={"auto"}>
                                    <div className="text-sm-end">
                                        <button title="Export" type="button" onClick={downloadData} className="btn-rounded mb-2 me-2 btn btn-outline-primary">
                                            <i className="mdi mdi-file-export"></i>
                                        </button>
                                        {headers.length > 0 && <CSVLink data={newData} headers={headers} filename={`${job_name}-opening-board.csv`} target="_blank" ref={csvInstance}></CSVLink>}
                                        <button type="button" onClick={toggle} className="btn-rounded mb-2 me-2 btn btn-outline-primary">
                                            <i className="mdi mdi-plus me-1"></i> Add Candidate
                                        </button>
                                        {user_role !== "3" &&
                                            <button type="button" onClick={AddStage} className="btn-rounded mb-2 me-2 btn btn-outline-primary">
                                                <i className="mdi mdi-plus me-1"></i> Add Stage
                                            </button>
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Container>
                {DataLoaded === true && board && (
                    <Board
                        // initialBoard={board}
                        allowRemoveLane
                        allowRenameColumn
                        disableCardDrag
                        // allowRemoveCard
                        // moveCard={console.log}
                        // onLaneRemove={console.log}
                        // onCardRemove={onCardRemove}
                        // onLaneRename={console.log}
                        // allowAddCard={{ on: "top" }}
                        // onCardNew={console.log}
                        // onCardDragEnd={onCardDragEnd}
                        // onCardDragUpdate={onCardDragEnd}
                        onColumnDragEnd={onColumnDragEnd}
                        renderColumnHeader={({ id, title, ordering, is_fixed, action, cards }) => (
                            <RenderCardTitle title={title} id={id} ordering={ordering} is_fixed={is_fixed} action={action} editStage={editStage} total={cards.length} />
                        )}
                        renderCard={(data) => (
                            (data !==  "" && 
                                <CardTaskBox data={data} action={board} deleteTask={deleteTask} MangeCandidate={MangeCandidate} showFeedback={showFeedback} ManageFeedback={ManageFeedback} scheduleInterview={scheduleInterview} selectAction={selectAction} holdAction={holdAction}>{data}</CardTaskBox>
                            )   
                        )}
                    >{board}</Board>
                )}

            </div>
            <Modal
                isOpen={isReject}
                toggle={() => {
                    tog_center();
                }}
                centered
            >
                <div className="modal-body">
                    <h3>{upperCase(reject_type)} CANDIDATE</h3>
                    <hr />
                    <h5 className="mb-3">Are you sure you want to reject <span className="fw-bold">{candidate_name}</span> ?</h5>
                    <div className="mb-3">
                        <label htmlFor={"form-label"}>{reject_type} feedback</label>
                        <textarea className="form-control" onChange={e => { setRejectFeedback(e.target.value) }} rows={4}></textarea>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                        <Button
                            color="primary"
                            outline
                            onClick={() => {
                                setIsReject(false); setStageId(""); setCandidateName(""); setIsReject(false); setIsRejectBtn(false)
                            }}
                        >
                            CANCEL
                        </Button>
                        <Button onClick={RejectCandidate}
                            color="primary"
                            className="btn btn-primary "
                            disabled={isRejectBtn}
                        >
                            {isRejectBtn === true ? 'Please wait...' : 'REJECT'}
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={editStageModal}
                toggle={() => {
                    tog_center();
                }}
                centered
            >
                <div className="modal-body">
                    <h3>Edit Stage</h3>
                    <hr />
                    {editStageModal === true &&
                        <Row>
                            <Col md="6" className="mb-4">
                                <label htmlFor="stage_name">Stage Name</label>
                                <input className="form-control" onChange={e => { setStageName(e.target.value) }} defaultValue={stageName} />
                            </Col>
                            <Col md="6" className="mb-4">
                                <label htmlFor="stage_postion">Stage Position</label>
                                <select className="form-control" defaultValue={defaultStage} onChange={e => { TempStage(e.target) }}>
                                    {defaultStage !== '' && stageslist?.slice(1, -4).map((val, key) => {
                                        return val.title !== stageName && (
                                            <option key={key} value={val.id}>Before &#8220;{val.title}&#8220; stage</option>
                                        )
                                    })}
                                </select>
                            </Col>
                            <Col md="12" className="mb-4">
                                <label>Does this stage includes scheduling of interview / meetings?</label>
                                <Row>
                                    <Col md={"auto"}>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="action" id="action_yes" onChange={e => { setStageAction(e.target.value) }} defaultChecked={stageAction === "1"} value="1" />
                                            <label className="form-check-label" htmlFor="action_yes">Yes</label>
                                        </div>
                                    </Col>
                                    <Col md={"auto"}>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="action" id="action_no" onChange={e => { setStageAction(e.target.value) }} defaultChecked={stageAction === "0"} value="0" />
                                            <label className="form-check-label" htmlFor="action_no">No</label>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="12" className="mb-4">
                                <label>Layout Preview</label>
                                <div className="stage-container-scroll">
                                    {tempstages?.map((val, key) => {
                                        return (
                                            <div className="stage-preview-card" key={key}>
                                                <span className="stage-preview-num">{key + 1}</span>
                                                <span className="stage-preview-title">
                                                    {val.title}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Col>
                        </Row>
                    }
                    <div className="d-flex flex-wrap gap-2">
                        <Button
                            color="primary"
                            outline
                            onClick={() => {
                                setEditStageModal(false); setdefaultStage("")
                            }}
                        >
                            CANCEL
                        </Button>
                        <Button onClick={UpdateStage}
                            color="primary"
                            className="btn btn-primary "
                            disabled={isDisableBtn}
                        >
                            {isDisableBtn === true ? 'PLEASE WAIT...' : 'EDIT'}
                        </Button>
                    </div>
                </div>
            </Modal>
            {user_role !== "3" &&
                <Modal
                    isOpen={addStage}
                    toggle={() => {
                        tog_center();
                    }}
                    centered
                >
                    <div className="modal-body">
                        <h3>Add Stage</h3>
                        <hr />
                        {addStage === true &&
                            <Row>
                                <Col md="6" className="mb-4">
                                    <label htmlFor="stage_name">Stage Name</label>
                                    <input className="form-control" id="stage_name" placeholder="Enter the stage name" onInput={e => { AddTempStage(e) }} defaultValue={stageName} />
                                </Col>
                                <Col md="6" className="mb-4">
                                    <label htmlFor="stage_postion">Stage Position</label>
                                    <select className="form-control" id="stage_position" onChange={e => { AddTempStage(e) }}>
                                        {stageslist?.slice(1, -4).map((val, key) => {
                                            return val.title !== stageName && (
                                                <option key={key} value={val.id}>Before &#8220;{val.title}&#8220; stage</option>
                                            )
                                        })}
                                    </select>
                                </Col>
                                <Col md="12" className="mb-4">
                                    <label>Does this stage includes scheduling of interview / meetings?</label>
                                    <Row>
                                        <Col md={"auto"}>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="action" id="action_yes" onChange={e => { setStageAction(e.target.value) }} value="1" />
                                                <label className="form-check-label" htmlFor="action_yes">Yes</label>
                                            </div>
                                        </Col>
                                        <Col md={"auto"}>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="action" id="action_no" onChange={e => { setStageAction(e.target.value) }} value="0" />
                                                <label className="form-check-label" htmlFor="action_no">No</label>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md="12" className="mb-4">
                                    <label>Layout Preview</label>
                                    <div className="stage-container-scroll">
                                        {tempstages?.map((val, key) => {
                                            return (
                                                <div className="stage-preview-card" key={key}>
                                                    <span className="stage-preview-num">{key + 1}</span>
                                                    <span className="stage-preview-title">
                                                        {val.title}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Col>
                            </Row>
                        }
                        <div className="d-flex flex-wrap gap-2">
                            <Button
                                color="primary"
                                outline
                                onClick={() => {
                                    setAddStageModal(false);
                                }}
                            >
                                CANCEL
                            </Button>
                            <Button onClick={SubmitStage}
                                color="primary"
                                className="btn btn-primary "
                                disabled={isDisableBtn}
                            >
                                {isDisableBtn === true ? 'PLEASE WAIT...' : 'ADD STAGE'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            }
            {isFeedback === true && <CandidateFeedback feedback={isFeedback} reloadBoard={reloadBoard} data={feedBackData} hidefeedback={hidefeedback} />}
            {showCandidateFeedback === true && <FeedbackView data={FeedbackParam} Candidatefeed={showCandidateFeedback} ManageFeedback={ManageFeedback} deletefeedback={deletefeedback} hideCandidatefeed={hideCandidatefeed} />}
            {InterviewModal === true && <InterviewSchedule InterviewModal={InterviewModal} data={interviewParam} reloadBoard={reloadBoard} interview_hide={interview_hide} />}
            {isShowing === true &&
                <AddCandidate
                    isShowing={isShowing}
                    hide={toggle}
                    reloadBoard={reloadBoard}
                />
            }
        </React.Fragment>
    );
};
TasksKanban.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string
        })
    }),
    location: PropTypes.object
}
export default withRouter(TasksKanban);
