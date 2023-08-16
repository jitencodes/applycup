import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Input, Label, Modal} from "reactstrap";
import {get, post, put} from "../../../helpers/api_helper";
import {
    ADD_CANDIDATE_OPENING_NOTE, DELETE_CANDIDATE_OPENING_NOTE, EDIT_CANDIDATE_OPENING_NOTE,
    GET_CANDIDATE_OPENING_NOTE
} from "../../../helpers/api_url_helper";
import toastr from "toastr";
import SimpleReactValidator from "simple-react-validator";
import moment from "moment";

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_private: false,
            id:"",
            notes: "",
            notes_data: [],
            add_new: false,
            edit:false,
            submit:false
        }
        this.validator = new SimpleReactValidator({autoForceUpdate: this})
    }

    componentDidMount() {
        this.loadNotes(this.props.id)
    }

    loadNotes = (id) => {
        const params = {id: id};
        get(GET_CANDIDATE_OPENING_NOTE, {params: params}).then(res => {
            if (res.status) {
                this.setState({notes_data: res.data});
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        if (this.validator.allValid()) {
            if (this.state.edit === true){
                const formData = {
                    "id":this.state.id,
                    "notes" : this.state.notes,
                    "is_private" : this.state.is_private ? 1 : 0
                }
                this.setState({submit: true})
                put(EDIT_CANDIDATE_OPENING_NOTE,formData).then(response => {
                    if (response.status) {
                        this.setState({submit: false})
                        toastr.success('Notes update successful.')
                        this.loadNotes(this.props.id)
                        this.setState({add_new:false,edit:false});
                        this.setState({
                            id:"",
                            notes : "",
                            is_private : false,
                        });
                    }
                }).catch(err => {
                    toastr.error(err?.response?.data?.message)
                    this.setState({submit: false})
                })
            }else {
                const formData = {
                    "requirement_candidate_screening_id":this.props.id,
                    "notes" : this.state.notes,
                    "is_private" : this.state.is_private ? 1 : 0
                }
                this.setState({submit: true})
                post(ADD_CANDIDATE_OPENING_NOTE,formData).then(response => {
                    if (response.status) {
                        this.setState({submit: false})
                        toastr.success('Notes add successful.')
                        this.loadNotes(this.props.id)
                        this.setState({add_new:false});
                        this.setState({
                            id:"",
                            notes : "",
                            is_private : false,
                        });
                    }
                }).catch(err => {
                    toastr.error(err.message)
                    this.setState({submit: false})
                })
            }
        } else {
            this.validator.showMessages()
            this.forceUpdate()
        }
    }

    handleEdit = (e) => {
        this.setState({
            id:e.id,
            notes : e.remark,
            is_private : e.is_private === "1" ? 1 : 0,
            add_new:true,
            edit:true
        });
    }
    handleDelete = (e) => {
        const formData = {
            "id":e
        }
        put(DELETE_CANDIDATE_OPENING_NOTE,formData).then(response => {
            if (response.status) {
                toastr.success('Notes delete successful.')
                this.loadNotes(this.props.id)
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }
    render() {
        const {is_private,notes_data,add_new,submit,edit} = this.state;
        return (
            <Modal
                size={"md"}
                isOpen={this.props.OpenNoteModel}
                toggle={() => {
                    this.props.CloseNoteModel();
                }}
                centered
            >
                <div className="modal-body">
                    <h3>ADD/VIEW INTERNAL NOTE</h3>
                    <hr/>
                    { add_new === false && notes_data.map((val,key) => {
                        return (
                            <>
                                <div key={key} style={{border:"1px solid #eee",borderRadius:"4px",padding:"14px 12px"}}>
                                    <div className="d-flex justify-content-between">
                                        <h6>{val.created_by} <span className="fw-light font-size-12">added a {val.is_private === "1" ?'private':'public'} note {moment(val.created_at, "YYYY-MM-DD hh:mm:ss").fromNow()}</span></h6>
                                        <div>
                                            <a className='text-danger p-1'><i className='bx bxs-trash' onClick={e => {this.handleDelete(val.id)}}></i></a>
                                            <a className='text-success p-1' onClick={e => {this.handleEdit(val)}}><i className='bx bxs-edit-alt'></i></a>
                                        </div>
                                    </div>
                                    <div className="font-size-12 text-muted">{val.remark}</div>
                                </div>
                                <hr/>
                            </>
                        )
                    })}
                    <form onSubmit={this.handleSubmit}>
                        {(add_new === true || notes_data.length === 0) &&
                            <>
                                <h5 className="mb-3">{edit === true ? 'Edit':'New'} Note:</h5>
                                <div className="mb-3">
                                    <textarea className="form-control" rows={6} defaultValue={this.state.notes} onChange={e => this.setState({notes: e.target.value})} placeholder={"Enter your note here"}></textarea>
                                    {this.validator.message('notes', this.state.notes, 'required')}
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <div className="form-check">
                                        <Input type="checkbox" className="form-check-input" id="mark-as-private"
                                               defaultChecked={this.state.is_private}
                                               onClick={() => this.setState({is_private: !is_private})}/>
                                        <Label className="form-check-label" htmlFor="mark-as-private">Mark as private <i
                                            className="bx bx-lock"></i> </Label>
                                    </div>
                                    <div className="font-size-14">{this.props.candidate_name}</div>
                                </div>
                                <h6><i
                                    className="bx bxs-info-circle"></i> {this.state.is_private === true ? 'This internal note is visible to you, admins and super admins' : 'This internal note is visible to everyone.'}
                                </h6>
                                <hr/>
                                <div className="d-flex flex-wrap gap-2">
                                    <Button color="primary" outline onClick={() => {this.props.CloseNoteModel();}}>CLOSE</Button>
                                    <Button type="submit" color="primary" className="btn btn-primary" disabled={submit}>{submit === true ? 'Please wait..':(edit === true ? 'EDIT':'ADD')}</Button>
                                </div>
                            </>
                        }
                    </form>
                    {(add_new === false && notes_data.length > 0) &&
                        <div className="d-flex flex-wrap gap-2">
                            <Button color="primary" outline onClick={() => {this.props.CloseNoteModel();}}>CLOSE</Button>
                            <Button type="button" color="primary" className="btn btn-primary " onClick={e => this.setState({add_new: true})}>ADD NEW</Button>
                        </div>
                    }
                </div>
            </Modal>
        );
    }
}

Notes.propTypes = {
    OpenNoteModel: PropTypes.bool,
    CloseNoteModel: PropTypes.func,
    candidate_name: PropTypes.string,
    id: PropTypes.any
};

export default Notes;