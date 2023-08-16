import React, {Component, useEffect, useState} from "react";
import {
    Col,DropdownItem,
    DropdownMenu,
    DropdownToggle, Input, Label,
    Row, UncontrolledDropdown
} from "reactstrap";
import MetaTags from "react-meta-tags";
import AddCandidate from "../../Candidate/add-candidate"
import {get, put} from "../../../helpers/api_helper";
import {GET_OPENING_CANDIDATES, UPDATE_CANDIDATE_STAGES} from "../../../helpers/api_url_helper";
import PropTypes from "prop-types";
import toastr from "toastr";
import CheckBox from "./Checkbox";
import parseJwt from "components/Common/parseJwt";
function selectOnlyThis(event) {
    var myCheckbox = document.getElementsByName("filter");
    Array.prototype.forEach.call(myCheckbox, function (el) {
        el.checked = false;
    });
    event.target.checked = true;
}

class Openinglist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            candidates: [],
            stages: [],
            stages_master: [],
            job_name: "",
            filter: "",
            company: "",
            id:"",
            stage_id:"",
            isShowing:false,
            user_data: false,
            is_disable: false,
            checkedItems: new Map()
        };

        // this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleAllChecked = event => {
        let candidates_data = this.state.candidates;
        candidates_data.forEach(value => (value.is_checked = event.target.checked));
        this.setState({ candidates: candidates_data });
    };

    handleCheckChieldElement = event => {
        let candidates_data = this.state.candidates;
        candidates_data.forEach(value => {
            if (value.id === event.target.value)
                value.is_checked = !event.target.checked;
        });
        this.setState({ candidates: candidates_data });
    };
    componentDidMount() {
        this.loadData()
        const user = localStorage.getItem("authUser") !== "" && JSON.parse(localStorage.getItem("authUser"));
        if (!this.state.user_data) {
            const decodedJwt = parseJwt(user.token);
            if (typeof decodedJwt == "object") {
                if (decodedJwt?.id) {
                    // this.setState({user_role:decodedJwt.role_id})
                    if(decodedJwt.role_id === "3"){
                        this.setState({is_disable:true})
                    }
                }
            }
        }
    }

    loadData = () => {
        const params = {filter: this.state.filter, job_id: this.props.match.params.id};
        get(GET_OPENING_CANDIDATES, {params: params}).then(res => {
            if (res.status) {
                this.setState({job_name: res.data.job_name, company: res.data.company})
                let stages_data = [];
                res.data.stages.forEach(stages => {
                    stages_data.push({id: stages['id'], name: stages['name']})
                });
                this.setState({stages: stages_data.slice(0, -4),stages_master:stages_data});
                let candidate = [];
                res.data.stages.forEach(val => {
                    if (val.candidates) {
                        val.candidates.forEach(item => {
                            candidate.push({
                                id: item.id,
                                candidate_name: item.candidate_name,
                                applied_date: item.applied_date,
                                stage: val.name,
                                is_checked: false
                            })
                        });
                    }
                });
                this.setState({candidates: candidate})
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }

    toggle = () => {
        this.setState({isShowing:!this.state.isShowing});
    }

    update_stages = () => {
        let formData = {
            id: this.state.id,
            stage_id:this.state.stage_id
        }
        put(UPDATE_CANDIDATE_STAGES,formData).then((res,key) => {
            if (res.status){
                toastr.success("Candidates stage updated successfully")
                let inputs = document.getElementById('all');
                inputs.checked = false;
                this.loadData()
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }
    update_single = (id,stage_id) => {
        this.setState({id:id,stage_id:stage_id},this.update_stages);
    }
    update_stage_all = (stage_id) => {
        let id = [];
        this.state.candidates.forEach(item => {
            if (item.is_checked === true){
                id.push(item.id)
            }
        });
        this.setState({id:id,stage_id:stage_id},this.update_stages);
    }
    render() {
        const {job_name,company,stages,candidates,stages_master} = this.state
        return(
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>Openings | {process.env.REACT_APP_PROJECTNAME}</title>
                    </MetaTags>
                    <div className="container-fluid">
                        <Row>
                            <Col className="mb-2">
                                <h3 className="text-primary">{job_name} / <small>{company}</small></h3>
                                <p className="font-size-15">CANDIDATE LIST</p>
                            </Col>
                            <Col className="text-sm-end">
                                <button type="button" className="btn-rounded me-2 btn btn-outline-primary" onClick={this.toggle}>
                                    <i className="mdi mdi-plus me-1"></i> Add Candidate
                                </button>
                            </Col>
                        </Row>
                        <div className="list-display-flex">
                            <div className="left-sidebar">
                                <div className="filter-box">
                                    <h4 className="text-primary fw-bold mb-3">FILTERS:</h4>
                                    {/*<h4 className="font-size-15 mb-3">CANDIDATES</h4>*/}
                                    <div className="form-check mb-2">
                                        <Input type="checkbox" className="form-check-input" value={'AllCandidates'}
                                               onClick={event => {
                                                   selectOnlyThis(event);
                                                   this.setState({filter: event.target.value},this.loadData)
                                               }} name="filter" id="All"/>
                                        <Label className="form-check-label" htmlFor="All">All Candidates</Label>
                                    </div>
                                    <div className="form-check mb-2">
                                        <Input type="checkbox" className="form-check-input" value={'AddedByMe'}
                                               onClick={event => {
                                                   selectOnlyThis(event);
                                                   this.setState({filter: event.target.value},this.loadData)
                                               }} name="filter" id="Added"/>
                                        <Label className="form-check-label" htmlFor="Added">Added by me</Label>
                                    </div>
                                    <hr/>
                                    {stages_master.map((val,key) => {return(
                                        <div className="form-check mb-2" key={key}>
                                            <Input type="checkbox" className="form-check-input" value={val.name}
                                                onClick={event => {
                                                    selectOnlyThis(event);
                                                    this.setState({filter: event.target.value},this.loadData)
                                                }} name="filter" id={val.name}/>
                                            <Label className="form-check-label" htmlFor={val.name}>{val.name}</Label>
                                        </div>
                                    )})}
                                </div>
                            </div>
                            <div className="candidate-list-box">
                                {this.state.is_disable === false && 
                                <div className="filter-bar">
                                    <UncontrolledDropdown>
                                        <DropdownToggle href="#" className="btn btn-light mb-3" tag="a">Move To Stage<i
                                            className="bx bx-chevron-down ms-2"/></DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-center">
                                            {stages.map((value, k) => {
                                                return (
                                                    <DropdownItem className="dropdown-list" key={k} onClick={() => this.update_stage_all(value.id)} href="#">{value.name}</DropdownItem>
                                                )
                                            })}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                                }
                                <div className="candidate-list header">
                                    <div className="check-box">
                                        <label className="container">
                                            <input type="checkbox" id="all" disabled={this.state.is_disable} onChange={this.handleAllChecked} value="checkedall"/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                    <div className="candidate-name">Candidates</div>
                                    <div className="can-stage-detail">Current Stage</div>
                                    <div className="candidate-last-update">Applied Date</div>
                                </div>
                                {/* Candidate list ------------------*/}
                                {candidates.map((val, key) => {
                                    return (
                                        <><CheckBox key={key}
                                                    handleCheckChieldElement={this.handleCheckChieldElement} update_single={this.update_single} stages={stages}
                                                    {...val}
                                        /></>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <AddCandidate
                    isShowing={this.state.isShowing}
                    hide={this.toggle}
                />
            </React.Fragment>
        )
    }
}
Openinglist.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string
        })
    }),
    location: PropTypes.object
}
export default Openinglist
