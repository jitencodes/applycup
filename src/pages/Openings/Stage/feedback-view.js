import React from 'react';
import PropTypes from "prop-types";
import { GET_CANDIDATE_FEEDBACK } from 'helpers/api_url_helper';
import { get } from 'helpers/api_helper';
import { Card, CardBody, Col, Modal, Row } from 'reactstrap';
import RatingTooltip from "react-rating-tooltip";
import toastr from 'toastr';
import Moment from 'react-moment';
import { upperCase } from 'lodash';
import Opinion from './opinion';
// import 'moment-timezone';
class FeedbackView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            config: this.props.data,
            feedbackData: [],
            dataload: false,
            styleConfig: {
                counterStyle: {
                    height: '20px',
                    backgroundColor: '#F58220',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    color: '#FFF',
                    lineHeight: '20px',
                },
                starContainer: {
                    fontSize: '14px',
                    backgroundColor: '#F2F2F2',
                    height: '20px',
                },
                statusStyle: {
                    height: '20px',
                    backgroundColor: '#F58220',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    color: '#FFF',
                    lineHeight: '28px',
                    minWidth: '100px',
                    fontSize: '18px',
                    textAlign: 'left',
                },
                tooltipStyle: {
                    fontSize: '14px',
                    padding: '5px',
                }
            }
        }
    }

    componentDidMount() {
        let candidate_id = this.state.config.candidate_id, job_id = this.state.config.job_id
        this.loadEditData(candidate_id, job_id)
    }

    loadEditData = (candidate_id, job_id) => {
        get(GET_CANDIDATE_FEEDBACK, { params: { candidate_id: candidate_id, job_id: job_id } }).then(res => {
            if (res.status) {
                this.setState({ feedbackData: res.data });
                this.setState({ dataload: true });
            } else {
                this.setState({ dataload: true });
                toastr.error("Data not available!")
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }

    render() {
        const { dataload, feedbackData } = this.state;
        const starStyle = {}
        return (
            <React.Fragment>
                <Modal
                    isOpen={this.props.Candidatefeed}
                    toggle={() => {
                        this.props.hideCandidatefeed(false)
                    }}
                    centered
                >
                    <div className="modal-body">
                        <h3>CANDIDATE FEEDBACK</h3>
                        <hr />
                        {feedbackData.length === 0 && <><h4 className='text-center py-4'>No feedback found!</h4></>}
                        {dataload === true && feedbackData.map((val, key) => {
                            return (
                                <Card key={key} className="mb-3">
                                    <CardBody className='p-0'>
                                        <div className='d-flex justify-content-between'>
                                            <h6 className='fw-bold'>{key + 1}. From {val.employee} / {<Moment fromNow>{val.created_at}</Moment>}</h6>
                                            <div>
                                                <a className='text-danger p-1'><i className='bx bxs-trash' onClick={e => { this.props.deletefeedback(val.id) }}></i></a>
                                                <a className='text-success p-1' onClick={e => { this.props.ManageFeedback(val.candidates_id, val.candidate_name, val.requirement_screening_level_id, 'EDIT', val.id) }}><i className='bx bxs-edit-alt'></i></a>
                                            </div>
                                        </div>
                                        <p className='text-muted font-size-12'>{upperCase(val.stage)} | {this.state.config.job_name}</p>
                                        <p className='mb-2'>Overall Feedback</p>
                                        <p className='font-size-12 text-muted mb-4'>{val.overall_feedback}</p>
                                        <Row>
                                            <Col md="3">
                                                <Opinion rating={val.overall_opinion} />
                                            </Col>
                                            <Col md="9">
                                                <Row className='feedback-rating'>
                                                    <Col md="6" className='mb-3'>
                                                        <h6 className='font-size-12 mb-0'>Communication</h6>
                                                        <RatingTooltip disabled={true} styleConfig={this.state.styleConfig} defaultRating={val.communication} max={5} ActiveComponent={<i className="mdi mdi-star text-primary font-size-12" style={starStyle} />} InActiveComponent={<i className="mdi mdi-star-outline text-muted font-size-12" style={starStyle} />} />
                                                    </Col>
                                                    <Col md="6" className='mb-3'>
                                                        <h6 className='font-size-12 mb-0'>Attitude</h6>
                                                        <RatingTooltip disabled={true} styleConfig={this.state.styleConfig} defaultRating={val.attitude} max={5} ActiveComponent={<i className="mdi mdi-star text-primary font-size-12" style={starStyle} />} InActiveComponent={<i className="mdi mdi-star-outline text-muted font-size-12" style={starStyle} />} />
                                                    </Col>
                                                    <Col md="6" className='mb-3'>
                                                        <h6 className='font-size-12 mb-0'>Potential To Learn</h6>
                                                        <RatingTooltip disabled={true} styleConfig={this.state.styleConfig} defaultRating={val.potential_learn} max={5} ActiveComponent={<i className="mdi mdi-star text-primary font-size-12" style={starStyle} />} InActiveComponent={<i className="mdi mdi-star-outline text-muted font-size-12" style={starStyle} />} />
                                                    </Col>
                                                    <Col md="6" className='mb-3'>
                                                        <h6 className='font-size-12 mb-0'>Technical Skills</h6>
                                                        <RatingTooltip disabled={true} styleConfig={this.state.styleConfig} defaultRating={val.technical_skills} max={5} ActiveComponent={<i className="mdi mdi-star text-primary font-size-12" style={starStyle} />} InActiveComponent={<i className="mdi mdi-star-outline text-muted font-size-12" style={starStyle} />} />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            )
                        })}
                        {dataload === false && <div>
                            <Card className="shadow-none border mb-3" aria-hidden="true">
                                <CardBody>
                                    <p className="card-text placeholder-glow">
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
                                </CardBody>
                            </Card>
                            <Card className="shadow-none border mb-3" aria-hidden="true">
                                <CardBody>
                                    <p className="card-text placeholder-glow">
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
                                </CardBody>
                            </Card>
                        </div>}
                    </div>
                </Modal>
            </React.Fragment>
        )
    }

}

FeedbackView.propTypes = {
    data: PropTypes.any,
    Candidatefeed: PropTypes.bool,
    hideCandidatefeed: PropTypes.func,
    ManageFeedback: PropTypes.func,
    deletefeedback: PropTypes.func
}

export default FeedbackView;