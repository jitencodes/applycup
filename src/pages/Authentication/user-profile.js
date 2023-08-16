import MetaTags from "react-meta-tags";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from 'react-hook-form';
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody, Modal
} from "reactstrap";

import toastr from "toastr";
//redux
import { useSelector, useDispatch } from "react-redux";
import SimpleReactValidator from 'simple-react-validator';
import { withRouter } from "react-router-dom";

// import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import { get, put } from "helpers/api_helper";
import { GET_USERS } from "helpers/url_helper";
import { CHANGE_PASSWORD, UPDATE_PROFILE } from "helpers/api_url_helper";
function sortName(str) {
  const matches = str.match(/\b(\w)/g);
  return matches.join("")
}
const UserProfile = props => {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [email, setemail] = useState("");
  const [first_name, setfirstName] = useState("");
  const [temp_first_name, setTempFirstName] = useState();
  const [last_name, setlast_name] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const [data_res, setDataRes] = useState();
  const [role, setrole] = useState("");
  const [mobile, setmobile] = useState();
  const [dataload, setdataload] = useState(false);
  const [modal_center, setmodal_center] = useState(false);
  const [old_password, setOldPassword] = useState();
  const [new_password, setNewPassword] = useState();
  const [confirm_password, setConfirmPassword] = useState();
  const [submit, setSubmit] = useState(false);
  // profile update ----------------
  const { register, handleSubmit, formState: { errors } } = useForm();
  const user = localStorage.getItem("authUser") !== "" && JSON.parse(localStorage.getItem("authUser"));
  const { error, success } = useSelector(state => ({
    error: state.Profile.error,
    success: state.Profile.success
  }));
  const simpleValidator = useRef(new SimpleReactValidator())
  useEffect(() => {
    let params = { id: user?.user_id, keyword: "", length: 0, start: 0 };
    get(GET_USERS, { params: params }).then(res => {
      if (res?.status === "1") {
        setemail(res.email)
        setfirstName(res.first_name)
        setTempFirstName(res.first_name)
        setlast_name(res.last_name)
        setrole(res.role_id)
        setmobile(res.mobile)
        setDateOfBirth(res.dob)
        setDataRes(res)
        setdataload(true)
      }
    }).catch(err => {
      toastr.error(err)
    })
  }, [dispatch, success]);

  function tog_center() {
    setmodal_center(!modal_center);
    document.body.classList.add("no_padding");
  }

  let full_name = first_name + ' ' + last_name

  const handlePasswordForm = (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid()
    if (!formValid) {
      simpleValidator.current.showMessages()
      simpleValidator.current.forceUpdate()
    }else{
      let formData = {
        user_id : user.user_id,
        old_password : old_password,
        new_password : new_password,
        confirm_password : confirm_password
      }
      setSubmit(true)
      put(CHANGE_PASSWORD,formData).then(response => {
        if (response.status) {
          setOldPassword("")
          setNewPassword("")
          setConfirmPassword("")
          toastr.success('Password change successful.')
          setmodal_center(false)
        }else{
          toastr.error(response.message)
        }
        setSubmit(false)
      }).catch(err => {
        setSubmit(false)
        toastr.error(err.response.data.message)
      })
    }
  }

  const handleSubmitDetail = (e) => {
    let formData = {
      user_id : user.user_id,
      first_name : e.first_name,
      last_name : e.last_name,
      date_of_birth : e.date_of_birth
    }
    setSubmit(true)
    put(UPDATE_PROFILE,formData).then(response => {
      if (response.status) {
        setEdit(false)
        toastr.success('Profile update successful.')
        location.reload()
      }else{
        toastr.error(response.message)
      }
      setSubmit(false)
    }).catch(err => {
      setSubmit(false)
      toastr.error(err.response.data.message)
    })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Profile | Applycup Hiring Solutions</title>
        </MetaTags>
        <Container>
          <Row>
            <Col lg="12">
              {error ? <Alert color="danger">{error}</Alert> : ""}
              {success ? <Alert color="success">{success}</Alert> : ""}
              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      {/* <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      /> */}
                      <div className="user-avatar-lg me-3">
                        {dataload === true && <span className="user-avatar-string">{sortName(full_name)}</span>}
                      </div>
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{first_name}{" "}{last_name}</h5>
                        <p className="mb-1">{email}</p>
                        <p className="mb-0">Role: {role === "1" && 'Super admin'}{role === "2" && 'Team lead'}{role === "3" && 'Recruiters'}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card>
                <CardBody>
                  <div className="profile-heading">
                    Account Details
                    <div className="profile-action">
                      <span onClick={() => { setEdit(!edit) }}><i className="bx bx-pencil"></i> Edit Profile</span>
                      <span onClick={() => { tog_center(); }}><i className="bx bx-key"></i> Change Password</span>
                    </div>
                  </div>
                  <hr />
                  {(edit === true && dataload === true) &&
                    <form onSubmit={handleSubmit(handleSubmitDetail)}>
                      
                      <div className="profile-meta-container">
                        <div className="profile-meta"><label className="userLabels">First
                          Name:</label><span><input name="first_name" className="form-control form-control-sm" defaultValue={temp_first_name} {...register("first_name", {required: true, maxLength: 80})}/>
                          {errors.first_name && <span className="font-size-11 text-danger">This field is required</span>}
                          </span></div>
                        <div className="profile-meta"><label className="userLabels">Last
                          Name:</label><span><input name="last_name" className="form-control form-control-sm" defaultValue={last_name} {...register("last_name", {required: false, maxLength: 80})}/></span>
                          </div>
                        <div className="profile-meta"><label className="userLabels">Date Of Birth:</label><span><input name="date_of_birth" type="date" className="form-control form-control-sm" defaultValue={date_of_birth} {...register("date_of_birth", {required: true, maxLength: 80})}/>{errors.date_of_birth && <span className="font-size-11 text-danger">This field is required</span>}</span></div>
                        <div className="profile-meta"><label
                          className="userLabels">Email:</label><span>{email}</span>
                          <div className="userDetailsAL">{role === "1" && 'Super admin'}{role === "2" && 'Team lead'}{role === "3" && 'Recruiters'}</div>
                        </div>
                        <div className="profile-meta"><label
                          className="userLabels">Mobile:</label><span>{mobile}</span>
                        </div>
                        <div className="profile-meta"><label
                          className="userLabels">Location:</label><span>{data_res.location_name}</span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button type="button" onClick={() => { setEdit(!edit) }} className="btn btn-outline-primary text-uppercase me-2">Cancel</button>
                        <button type="submit" className="btn btn-primary text-uppercase" disabled={submit}>{submit ? 'Please wait..':'Save'}</button>
                      </div>
                    </form>
                  }
                  {(edit === false && dataload === true) &&
                    <div className="profile-meta-container">
                      <div className="profile-meta"><label className="userLabels">First
                        Name:</label><span>{first_name}</span></div>
                        <div className="profile-meta"><label className="userLabels">Last
                        Name:</label><span>{last_name}</span></div>
                      <div className="profile-meta"><label
                        className="userLabels">Email:</label><span>{email}</span>
                        <div className="userDetailsAL">{role === "1" && 'Super admin'}{role === "2" && 'Team lead'}{role === "3" && 'Recruiters'}</div>
                      </div>
                      <div className="profile-meta"><label
                        className="userLabels">Date Of Birth:</label><span>{data_res.dob}</span>
                      </div>
                      <div className="profile-meta"><label
                        className="userLabels">Mobile:</label><span>{mobile}</span>
                      </div>
                      <div className="profile-meta"><label
                          className="userLabels">Employment Type:</label><span>{data_res.employment_type}</span>
                      </div>
                      <div className="profile-meta"><label
                          className="userLabels">Department:</label><span>{data_res.department}</span>
                      </div>
                      <div className="profile-meta"><label
                          className="userLabels">Location:</label><span>{data_res.location_name}</span>
                      </div>
                      <div className="profile-meta"><label
                          className="userLabels">Requirement enable:</label><span>{(data_res.requirement_enable == 1 || (data_res.role_id == 1 || data_res.role_id == 2)) ? "Yes" : "No"}</span>
                      </div>
                      <div className="profile-meta"><label
                          className="userLabels">Remark:</label><span>{(data_res.remark !== null && data_res.remark !== "") ? data_res.remark : "N/A"}</span>
                      </div>
                    </div>
                  }
                </CardBody>
              </Card>
            </Col>
            <Col md={6}></Col>
          </Row>
        </Container>
      </div>
      <Modal
        size="sm"
        isOpen={modal_center}
        toggle={() => {
          tog_center();
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">CHANGE PASSWORD</h5>
          <button
            type="button"
            onClick={() => {
              setmodal_center(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handlePasswordForm} method="post">
            <div className="mb-3">
              <input className="form-control" defaultValue={old_password} type="password" name="old_password" onChange={e => {setOldPassword(e.target.value)}} placeholder="Enter old password" onBlur={()=>simpleValidator.current.showMessageFor('old_password')}/>
              {simpleValidator.current.message('old_password', old_password, 'required')}
            </div>
            <div className="mb-3">
              <input className="form-control" defaultValue={new_password} onChange={e => {setNewPassword(e.target.value)}} name="new_password" placeholder="Enter new password" onBlur={()=>simpleValidator.current.showMessageFor('new_password')}/>
              {simpleValidator.current.message('new_password', new_password, 'required')}
            </div>
            <div className="mb-3">
              <input className="form-control" defaultValue={confirm_password} onChange={e => {setConfirmPassword(e.target.value)}} type="password" name="confirm_password" placeholder="Confirm password" onBlur={()=>simpleValidator.current.showMessageFor('confirm_password')}/>
              {simpleValidator.current.message('confirm_password', confirm_password, 'required')}
            </div>
            <button type="button" onClick={() => { setmodal_center(false); }} className="btn btn-outline-primary text-uppercase me-2">Cancel</button>
            <button type="submit" className="btn btn-primary text-uppercase" disabled={submit}>{submit ? 'Please wait..':'Save'}</button>
          </form>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
