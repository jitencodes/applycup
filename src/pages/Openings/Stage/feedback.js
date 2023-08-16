import PropTypes from "prop-types";
import React from 'react';
import RatingTooltip from "react-rating-tooltip";
import {
    Button,
    Col, Input, Label,
    Modal,
    Row, UncontrolledTooltip
} from "reactstrap";
import SimpleReactValidator from 'simple-react-validator';
import { get, post } from "../../../helpers/api_helper";
import { GET_FEEDBACK_BY_ID, MANAGE_CANDIDATE_FEEDBACK } from "../../../helpers/api_url_helper";
import toastr from "toastr";
class CandidateFeedback extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            config: this.props.data,
            candidates_id: this.props.data.id,
            requirements_id: this.props.data.job_id,
            requirement_screening_level_id: this.props.data.stage_id,
            Communication: 0,
            Attitude: 0,
            Potential: 0,
            Technical: 0,
            overall_opinion: 0,
            overall_feedback: "",
            interview: false,
            status: true,
            handleResponse: null,
            submit: false,
            dataLoad: false
        }
        this.validator = new SimpleReactValidator({ autoForceUpdate: this })
        this.handleOpinion = this.handleOpinion.bind(this);
        console.log(this.props.data)
    }

    componentDidMount() {
        if (this.state.config.type === "EDIT") {
            this.loadEditData(this.state.config.edit_id)
        } else {
            this.setState({ dataLoad: true });
        }
    }

    loadEditData = (id) => {
        get(GET_FEEDBACK_BY_ID, { params: { id: id } }).then(res => {
            if (res.data) {
                let edit = res.data
                this.setState({
                    candidates_id: edit.candidates_id,
                    requirements_id: edit.requirements_id,
                    requirement_screening_level_id: edit.requirement_screening_level_id,
                    Communication: parseInt(edit.communication),
                    Attitude: parseInt(edit.attitude),
                    Potential: parseInt(edit.potential_learn),
                    Technical: parseInt(edit.technical_skills),
                    overall_opinion: parseInt(edit.overall_opinion),
                    overall_feedback: edit.overall_feedback,
                    interview: edit.is_not_interview === "1" ? true : false
                })
                this.setState({ dataLoad: true });
            } else {
                toastr.error("Data load issue try again!")
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }

    handleInput = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    handleOpinion = (e) => {
        this.setState({ overall_opinion: e })
    }
    handleFormSubmit = (e) => {
        e.preventDefault()
        if (this.validator.allValid()) {
            const formData = {
                id: this.state.config.edit_id,
                candidates_id: this.state.candidates_id,
                requirements_id: this.state.requirements_id,
                requirement_screening_level_id: this.state.requirement_screening_level_id,
                communication: this.state.Communication,
                attitude: this.state.Attitude,
                potential: this.state.Potential,
                technical: this.state.Technical,
                overall_opinion: this.state.overall_opinion,
                overall_feedback: this.state.overall_feedback,
                interview: this.state.interview
            }
            this.setState({ submit: true })
            post(MANAGE_CANDIDATE_FEEDBACK, formData).then(response => {
                if (response.status) {
                    this.setState({ submit: false })
                    toastr.success('Feedback saved successfully')
                    this.props.hidefeedback(false)
                    this.props.reloadBoard(true)
                }
            }).catch(err => {
                toastr.error(err?.response?.data?.message);
                this.setState({ submit: false })
            })
        } else {
            this.validator.showMessages()
            this.forceUpdate()
        }
    }
    render() {
        const starStyle = {};
        const { overall_opinion, Communication, Attitude, Potential, Technical, config } = this.state;
        return (
            <React.Fragment>
                <Modal
                    isOpen={this.props.feedback}
                    toggle={() => {
                        this.props.hidefeedback(false)
                    }}
                    centered
                >
                    <div className="modal-body">
                        <h3>{config.type} FEEDBACK - Candidate</h3>
                        <hr />
                        {this.state.dataLoad === false && 
                            <div>
                                <p className="card-text placeholder-glow">
                                    <span className="placeholder col-7"></span>
                                    <span className="placeholder col-4"></span>
                                    <span className="placeholder col-7"></span>
                                    <span className="placeholder col-4"></span>
                                    <span className="placeholder col-7"></span>
                                    <span className="placeholder col-4"></span>
                                    <span className="placeholder col-7"></span>
                                    <span className="placeholder col-4"></span>
                                    <span className="placeholder col-7"></span>
                                    <span className="placeholder col-4"></span>
                                </p>
                                <h5 className="card-title placeholder-glow">
                                    <span className="placeholder col-6"></span>
                                </h5>
                                <p className="card-text placeholder-glow">
                                    <span className="placeholder col-7"></span>
                                    <span className="placeholder col-4"></span>
                                    <span className="placeholder col-4"></span>
                                    <span className="placeholder col-6"></span>
                                    <span className="placeholder col-8"></span>
                                </p>
                            </div>
                        }
                        {this.state.dataLoad === true &&
                            <form onSubmit={this.handleFormSubmit}>
                                <h5 className="mb-4">Your rating based on these skills</h5>
                                <Row>
                                    <Col md={6}><span className="fw-bold font-size-12">Communication*</span></Col>
                                    <Col md={6}>
                                        <RatingTooltip defaultRating={Communication} max={5} onChange={rate => { this.setState({ Communication: rate }) }} ActiveComponent={<i className="mdi mdi-star text-primary" style={starStyle} />} InActiveComponent={
                                            <i className="mdi mdi-star-outline text-muted" style={starStyle} />} />
                                    </Col>
                                    <Col md="12">{this.validator.message('Communication', this.state.Communication, 'required')}</Col>
                                </Row>
                                <Row>
                                    <Col md={6}><span className="fw-bold font-size-12">Attitude*</span></Col>
                                    <Col md={6}>
                                        <RatingTooltip defaultRating={Attitude} max={5} onChange={rate => { this.setState({ Attitude: rate }) }} ActiveComponent={<i className="mdi mdi-star text-primary" style={starStyle} />} InActiveComponent={
                                            <i className="mdi mdi-star-outline text-muted" style={starStyle} />} />
                                    </Col>
                                    <Col md="12">{this.validator.message('Attitude', this.state.Attitude, 'required')}</Col>
                                </Row>
                                <Row>
                                    <Col md={6}><span className="fw-bold font-size-12">Potential to learn*</span></Col>
                                    <Col md={6}>
                                        <RatingTooltip defaultRating={Potential} max={5} onChange={rate => { this.setState({ Potential: rate }) }} ActiveComponent={<i className="mdi mdi-star text-primary" style={starStyle} />} InActiveComponent={
                                            <i className="mdi mdi-star-outline text-muted" style={starStyle} />} />
                                    </Col>
                                    <Col md="12">{this.validator.message('Potential', this.state.Potential, 'required')}</Col>
                                </Row>
                                <Row>
                                    <Col md={6}><span className="fw-bold font-size-12">Technical Skills*</span></Col>
                                    <Col md={6}>
                                        <RatingTooltip defaultRating={Technical} max={5} onChange={rate => { this.setState({ Technical: rate }) }} ActiveComponent={<i className="mdi mdi-star text-primary" style={starStyle} />} InActiveComponent={
                                            <i className="mdi mdi-star-outline text-muted" style={starStyle} />} />
                                    </Col>
                                    <Col md="12">{this.validator.message('Technical', this.state.Technical, 'required')}</Col>
                                </Row>
                                <hr />
                                <h5>Your overall opinion on the candidate*</h5>
                                <div className="opinion-option-list">
                                    <div className={`openion-icon ${overall_opinion === 1 && 'active'}`} id={"opinion-1"} onClick={e => this.handleOpinion(1)}><i className="bx bxs-no-entry"></i><UncontrolledTooltip placement="top" target={`opinion-1`}>Not Fit</UncontrolledTooltip> </div>
                                    <div className={`openion-icon ${overall_opinion === 2 && 'active'}`} id={"opinion-2"} onClick={e => this.handleOpinion(2)}><i className="bx bxs-dislike"></i><UncontrolledTooltip placement="top" target={`opinion-2`}>Not Good</UncontrolledTooltip> </div>
                                    <div className={`openion-icon ${overall_opinion === 3 && 'active'}`} id={"opinion-3"} onClick={e => this.handleOpinion(3)}><i className="bx bxs-meh"></i><UncontrolledTooltip placement="top" target={`opinion-3`}>Not Sure</UncontrolledTooltip> </div>
                                    <div className={`openion-icon ${overall_opinion === 4 && 'active'}`} id={"opinion-4"} onClick={e => this.handleOpinion(4)}><i className="bx bxs-like"></i> <UncontrolledTooltip placement="top" target={`opinion-4`}>Good</UncontrolledTooltip></div>
                                    <div className={`openion-icon ${overall_opinion === 5 && 'active'}`} id={"opinion-5"} onClick={e => this.handleOpinion(5)}><i className="bx bxs-chevron-down-square"></i><UncontrolledTooltip placement="top" target={`opinion-5`}>Must Hire</UncontrolledTooltip> </div>
                                </div>
                                {this.validator.message('overall_opinion', this.state.overall_opinion, 'required')}
                                <hr />
                                <h5>Overall Feedback*</h5>
                                <textarea className="form-control mb-3" name='overall_feedback' defaultValue={this.state.overall_feedback} rows={6} placeholder={"Enter your feedback here"} onChange={this.handleInput}></textarea>
                                {this.validator.message('overall_feedback', this.state.overall_feedback, 'required')}
                                <hr />
                                <div className="d-flex flex-wrap gap-2">
                                    <Button
                                        color="primary"
                                        outline
                                        onClick={() => {
                                            this.props.hidefeedback(false)
                                        }}
                                    >
                                        CANCEL
                                    </Button>
                                    <Button
                                        color="primary"
                                        className="btn btn-primary "
                                    >
                                        {config.type}
                                    </Button>
                                </div>
                            </form>
                        }
                    </div>
                </Modal>
            </React.Fragment>
        )
    }
}

CandidateFeedback.propTypes = {
    feedback: PropTypes.bool,
    hidefeedback: PropTypes.func,
    data: PropTypes.any,
    reloadBoard: PropTypes.func
}

export default CandidateFeedback;