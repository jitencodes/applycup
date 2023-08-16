import React, { Component } from "react"
import { Row, Col, CardTitle } from "reactstrap"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
    PaginationProvider, PaginationListStandalone,
    SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import PropTypes from "prop-types";
import { GET_CANDIDATE_SOURCE_REPORT } from 'helpers/api_url_helper';
import { get } from "helpers/api_helper";
// import "../../assets/scss/datatables.scss"


class CandidateSourceTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            sizePerPage: 30,
            source_id:"",
            year: "",
            data:[],
            candidate_source_report: "",
            placement_data_load: false
        }
    }

    componentDidMount() {
        this.loadYear()
        this.loadPlacementReport()
    }

    loadYear = () => {
        let dateDropdown = document.getElementById('date-dropdown-source');
        let currentYear = new Date().getFullYear();
        let earliestYear = 2021;
        while (currentYear >= earliestYear) {
            let dateOption = document.createElement('option');
            dateOption.text = currentYear;
            dateOption.value = currentYear;
            dateDropdown.add(dateOption);
            currentYear -= 1;
        }
    }

    filterYear = (e) => {
        this.setState({year:e.target.value},this.loadPlacementReport)
    }

    loadPlacementReport = () => {
        get(GET_CANDIDATE_SOURCE_REPORT, { params: { year: this.state.year,source_id: this.state.source_id } }).then(res => {
            if (res.status) {
                this.setState({ data: res.data })
                this.setState({ placement_data_load: true });
            }
        }).catch(err => {
            toastr.error(err?.response?.data?.message)
        })
    }

    render() {
        const columns = [{
            dataField: 'name',
            text: 'Source Name',
            sort: true
        }, {
            dataField: 'January',
            text: 'January',
            sort: true
        }, {
            dataField: 'February',
            text: 'February',
            sort: true
        }, {
            dataField: 'March',
            text: 'March',
            sort: true
        }, {
            dataField: 'April',
            text: 'April',
            sort: true
        }, {
            dataField: 'May',
            text: 'May',
            sort: true
        }, {
            dataField: 'June',
            text: 'June',
            sort: true
        }, {
            dataField: 'July',
            text: 'July',
            sort: true
        }, {
            dataField: 'August',
            text: 'August',
            sort: true
        }, {
            dataField: 'September',
            text: 'September',
            sort: true
        }, {
            dataField: 'October',
            text: 'October',
            sort: true
        }, {
            dataField: 'November',
            text: 'November',
            sort: true
        }, {
            dataField: 'December',
            text: 'December',
            sort: true
        }];

        const defaultSorted = [{
            dataField: 'id',
            order: 'asc'
        }];

        const pageOptions = {
            sizePerPage: 10,
            totalSize: this.state.data.length, // replace later with size(customers),
            custom: true,
        }

        const { SearchBar } = Search;
        return (
            <React.Fragment>
                <PaginationProvider
                    pagination={paginationFactory(pageOptions)}
                    keyField='id'
                    columns={columns}
                    data={this.state.data}
                >
                    {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                            keyField='id'
                            columns={columns}
                            data={this.state.data}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <Row className="mb-2 justify-content-between">
                                        <Col md="auto">
                                            <p className='font-size-12 mb-2'>Reports</p>
                                            <CardTitle>Candidates Source Report</CardTitle>
                                        </Col>
                                        <Col md="auto">
                                            <div className="search-box me-2 mb-2 d-inline-block">
                                                <div className="position-relative">
                                                    <SearchBar
                                                        {...toolkitProps.searchProps}
                                                    />
                                                    <i className="bx bx-search-alt search-icon" />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="auto">
                                            <div className="d-flex align-content-center" style={{ maxWidth: "200px", minWidth: "100px" }}><label style={{ alignSelf: "center", marginBottom: "0", fontSize: "16px", marginRight: "5px" }}>Year</label><select value={this.state.year} onChange={(e) => this.filterYear(e)} className='form-control' id='date-dropdown-source'></select></div>
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col xl="12">
                                            <div className="table-responsive">
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    responsive
                                                    bordered={false}
                                                    striped={false}
                                                    defaultSorted={defaultSorted}
                                                    classes={
                                                        "table table-striped table-bordered align-middle table-nowrap"
                                                    }
                                                    headerWrapperClasses={"thead-light"}
                                                    {...toolkitProps.baseProps}
                                                    {...paginationTableProps}
                                                />

                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className="align-items-md-center mt-30">
                                        <Col className="inner-custom-pagination d-flex">
                                            <div className="text-md-right ms-auto">
                                                <PaginationListStandalone
                                                    {...paginationProps}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider>
                    )
                    }</PaginationProvider>
            </React.Fragment>
        )
    }
}
export default CandidateSourceTable