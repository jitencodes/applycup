import PropTypes from 'prop-types'
import React, { useState } from "react"
import {
  CardTitle,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"

const RenderCardTitle = props => {
  return (
    <React.Fragment>
        {props.is_fixed === "0" &&  <UncontrolledDropdown className="float-end">
        <DropdownToggle href="#" className="arrow-none" tag="i">
          <i className="mdi mdi-dots-vertical m-0 text-muted h5"/>
        </DropdownToggle><DropdownMenu right>
          <DropdownItem onClick={() => props.editStage(props.id,props.title,props.ordering,props.action)}>Edit Stage</DropdownItem>
        </DropdownMenu> </UncontrolledDropdown>}
      
      <CardTitle style={{minWidth:"230px"}} className="mb-4"><span className="candidate-count">{props.total}</span> {props.title}</CardTitle>
    </React.Fragment>
  )
}

RenderCardTitle.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  ordering: PropTypes.string,
  total: PropTypes.number,
  action: PropTypes.string,
  is_fixed: PropTypes.string,
  editStage: PropTypes.func
}

export default RenderCardTitle
