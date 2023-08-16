import React, { Component } from 'react';
import {
    Button,
    Col, FormGroup, InputGroup, Label,
    Modal,
    Row
} from "reactstrap";
import PropTypes from "prop-types";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SimpleReactValidator from 'simple-react-validator';
import { upperCase } from 'lodash';
import { get, post } from 'helpers/api_helper';
import toastr from "toastr"
import { CNADIDATE_INTERVIEW_SECHUDLE, GET_ALL_MASTERS, GET_CANDIDATE_INTERVIEW } from 'helpers/api_url_helper';
import moment from 'moment';
let duration_array = [{ value: 30, label: "30 mins" }, { value: 45, label: "45 mins" }, { value: 60, label: "1 hr" }, { value: 120, label: "2 hrs" }, { value: 180, label: "3 hrs" }];
class InterviewSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employees_master: [],
            handleResponse: null,
            interview_mode: "1",
            interviewer: [],
            interview_date: "",
            selectedDate: "",
            duration: "",
            start_time: "",
            end_time: "",
            candidate_number: "",
            interview_address: "",
            google_meet: "",
            defaultDate: "",
            submit: false,
            dataLoad: false
        }
        this.validator = new SimpleReactValidator({ autoForceUpdate: this })
    }

    sortName = (str) => {
        if (!str) { return false }
        const matches = str.match(/\b(\w)/g);
        return matches.join("")
    }
    componentDidMount() {
        this.loadMaster();
        if (this.props.data.type === 'EDIT') {
            this.loadEdit(this.props.data.id)
        }
    }

    loadEdit = (id) => {
        get(GET_CANDIDATE_INTERVIEW, { params: { id: id } }).then(res => {
            if (res.status) {
                let data = res.data;
                duration_array.forEach((val) => {
                    if (val.value == data.interview_duration) {
                        this.setState({ duration: val });
                    }
                })
                this.setState({
                    interview_mode: data.interview_type,
                    interviewer: data.interviewers,
                    interview_date: data.interview_date,
                    start_time: data.interview_start_time,
                    end_time: data.interview_end_time,
                    candidate_number: data.interview_input,
                    interview_address: data.interview_input,
                    google_meet: data.interview_input,
                });
                this.setState({selectedDate: new Date(data.interview_date)})
                // var interview_date = new Date(data.interview_date);
                // this.setState({ interview_date: interview_date });
                this.setState({ dataLoad: true });
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }

    handleInput = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleFormSubmit = (e) => {
        e.preventDefault()
        if (this.validator.allValid()) {
            const formData = {
                id: this.props.data.id,
                interview_mode: this.state.interview_mode,
                interviewer: this.state.interviewer,
                interview_date: moment(this.state.interview_date).format('YYYY-MM-DD'),
                duration: this.state.duration.value,
                start_time: this.state.start_time,
                end_time: this.state.end_time,
                candidate_number: this.state.candidate_number,
                interview_address: this.state.interview_address,
                google_meet: this.state.google_meet,
                type: this.props.data.type
            }
            this.setState({ submit: true })
            post(CNADIDATE_INTERVIEW_SECHUDLE, formData).then(response => {
                if (response.status) {
                    this.setState({ submit: false })
                    toastr.success('Interview schedule successfully')
                    this.props.interview_hide()
                    this.props.reloadBoard(true)
                }
            }).catch(err => {
                toastr.error(err?.response?.data?.message)
                this.setState({ submit: false })
            })
        } else {
            this.validator.showMessages()
            this.forceUpdate()
        }
    }

    loadMaster = () => {
        get(GET_ALL_MASTERS, { params: { masters: 'employees' } }).then(res => {
            if (res.status) {
                let data = res.data;
                this.setState({ employees_master: data.employees })
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }

    timeCal = () => {
        let start_time = this.state.start_time, duration = this.state.duration
        if (start_time && duration) {
            var date = moment(start_time, 'HH:mm')
                .add(duration.value, 'minutes')
                .format('HH:mm');
            this.setState({ end_time: date });
        }
    }

    trim = (el) => {
        el.value = el.value.
            replace(/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
            replace(/[ ]{2,}/gi, " "). // replaces multiple spaces with one space 
            replace(/\n +/, "\n"); // Removes spaces after newlines
        return;
    }

    render() {
        const { interview_mode, interviewer, candidate_number, employees_master, google_meet, interview_address, duration, start_time, end_time, submit, interview_date, defaultDate } = this.state
        return (<React.Fragment>
            <Modal isOpen={this.props.InterviewModal} toggle={() => { this.props.interview_hide() }} centered>
                <div className="modal-body">
                    <div className="d-flex">
                        <div className="flex-shrink-0 user-avatar-lg me-3">
                            <span className="user-avatar-string">{this.sortName(this.props.data.candidate_name)}</span>
                        </div>
                        <div className="flex-grow-1"><h5>{this.props.data.candidate_name}</h5>
                            <p className="mb-0"><span className="text-muted">Job opening:</span> {this.props.data.job_name}</p>
                            <p className="mb-0"><span className="text-muted">Stage:</span> {upperCase(this.props.data.stage_name)}</p>
                        </div>
                    </div>
                    <hr />
                    <form onSubmit={this.handleFormSubmit}>
                        <div className="interview-form">
                            <Row>
                                <Col md={6} className="mb-3">
                                    <label htmlFor="">Type of Interview *</label>
                                    <select className="form-control" defaultValue={interview_mode} onChange={this.handleInput} name="interview_mode">
                                        <option value="">Select type of interview</option>
                                        <option value={"1"}>Telephonic</option>
                                        <option value={"2"}>Face to Face</option>
                                        <option value={"3"}>Google Meet</option>
                                    </select>
                                </Col>
                                {interview_mode === "1" &&
                                    <Col md={6}>
                                        <label htmlFor=''>Candidate Phone Number*</label>
                                        <input className='form-control' name='candidate_number' defaultValue={candidate_number} onChange={this.handleInput} onInput={e => { return this.trim(e.target) }} placeholder='Enter mobile number with country code' required={interview_mode === "1"} />
                                        {/* {interview_mode === "1" && this.validator.message('candidate_number', this.state.candidate_number, 'required|phone')} */}
                                    </Col>
                                }
                                {interview_mode === "2" &&
                                    <Col md={6}>
                                        <label htmlFor=''>Address*</label>
                                        <input className='form-control' name='interview_address' defaultValue={interview_address} onChange={this.handleInput} placeholder='Enter enter interview address' required={interview_mode === "2"} />
                                        {/* {interview_mode === "2" && this.validator.message('interview_address', this.state.interview_address, 'required')} */}
                                    </Col>
                                }
                                {interview_mode === "3" &&
                                    <Col md={6}>
                                        <label htmlFor=''>Google Meet Link*</label>
                                        <input className='form-control' name='google_meet' defaultValue={google_meet} onChange={this.handleInput} placeholder='Enter google meeting link' required={interview_mode === "3"} />
                                        {/* {interview_mode === "3" && this.validator.message('google_meet', this.state.google_meet, 'required|url')} */}
                                    </Col>
                                }
                                <Col md={12} className="mb-3">
                                    <label className="control-label">Interviewer(s)</label>
                                    <Select isMulti={true} options={employees_master} value={interviewer} onChange={e => this.setState({ interviewer: e })} classNamePrefix="select2-selection" />
                                </Col>
                                <Col md={6} className="mb-3">
                                    <FormGroup className="mb-4">
                                        <Label>Date*</Label>
                                        {this.props.data.type === 'EDIT' ?
                                            this.state.dataLoad === true && <DatePicker dateFormat="dd-MM-yyyy" placeholderText={"dd-mm-yyyy"} minDate={new Date()} selected={this.state.selectedDate} className={'form-control'} onChange={(date) => {
                                                this.setState({interview_date: date});
                                                this.setState({selectedDate: new Date(date)})
                                            }} />
                                            : <DatePicker dateFormat="dd-MM-yyyy" placeholderText={"dd-mm-yyyy"} minDate={new Date()} selected={interview_date} className={'form-control'} onChange={(date) => this.setState({interview_date:date})} />
                                        }
                                    </FormGroup>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <label className="control-label">Duration</label>
                                    <Select
                                        isMulti={false} value={duration} onChange={e => { this.setState({ duration: e }, this.timeCal) }}
                                        options={duration_array}
                                        classNamePrefix="select2-selection"
                                    />
                                </Col>
                                <Col md={6}>
                                    <label>Start Time *</label>
                                    <input className="form-control" name='start_time' defaultValue={start_time} onChange={e => { this.setState({ start_time: e.target.value }, this.timeCal); }} type="time" />
                                </Col>
                                <Col md={6}>
                                    <label>End Time *</label>
                                    <input className="form-control" name='end_time' defaultValue={end_time} onChange={this.handleInput} type="time" readOnly={true} />
                                </Col>
                            </Row>
                            <div className="d-flex flex-wrap gap-2 justify-content-end mt-3">
                                <button className="btn btn-outline-primary" type="button" onClick={event => { this.props.interview_hide(false) }}>Back</button>
                                <Button color="primary" type="submit" disabled={submit}>{submit === true ? 'Please wait...' : 'Schedule'}</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </React.Fragment>);
    }
}
InterviewSchedule.propTypes = {
    interview_hide: PropTypes.func,
    InterviewModal: PropTypes.bool,
    data: PropTypes.any,
    reloadBoard: PropTypes.func
}
export default InterviewSchedule;