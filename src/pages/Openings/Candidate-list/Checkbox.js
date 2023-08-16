import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle, UncontrolledDropdown
} from "reactstrap";
import Moment from "react-moment";
import parseJwt from "components/Common/parseJwt";
export const CheckBox = props => {
    const [user_data, set_user_data] = useState(false);
    const [login_user_role, setLoginUserRole] = useState("");
    const [isDisable, setIsDisable] = useState(false);
    // const [login_user, setLoginUser] = useState("");
    const user = localStorage.getItem("authUser") !== "" && JSON.parse(localStorage.getItem("authUser"));
    if (!user_data) {
        set_user_data(true)
        const decodedJwt = parseJwt(user.token);
        if (typeof decodedJwt == "object") {
            if (decodedJwt?.id) {
                setLoginUserRole(decodedJwt.role_id)
                if(decodedJwt.role_id === "3"){
                    setIsDisable(true)
                }
                // setLoginUser(decodedJwt.id)
            }
        }
    }
    return (
        <div className="candidate-list">
            <div className="check-box"><label className="container" htmlFor={`id-${props.id}`}><input key={props.id} type="checkbox" className="stage" checked={props.is_checked} onClick={e => props.handleCheckChieldElement(e)} disabled={isDisable} id={`id-${props.id}`} value={props.id} /><span className="checkmark"></span></label></div>
            <div className="candidate-name">{props.candidate_name}</div>
            <UncontrolledDropdown>
                <DropdownToggle href="#" className="card-drop can-stage-detail" tag="a">{props.stage}<i className="bx bx-chevron-down ms-2" /></DropdownToggle>
                {(user_data && login_user_role !== "3") &&
                    <DropdownMenu className="dropdown-menu-center">
                        {props.stages.map((value, k) => {
                            return (
                                <DropdownItem className="dropdown-list" onClick={() => props.update_single(props.id, value.id)} key={k} href="#">{value.name}</DropdownItem>
                            )
                        })}
                    </DropdownMenu>
                }

            </UncontrolledDropdown>
            <div className="candidate-last-update"><Moment format="D MMM YYYY" withTitle>{props.applied_date}</Moment></div>
        </div >

    );
};
CheckBox.propTypes = {
    handleCheckChieldElement: PropTypes.func,
    update_single: PropTypes.func,
    id: PropTypes.any,
    is_checked: PropTypes.bool,
    value: PropTypes.any,
    candidate_name: PropTypes.string,
    applied_date: PropTypes.string,
    stage: PropTypes.string,
    stages: PropTypes.any
}
export default CheckBox;
