import React, { Component } from "react"
import { Row, Col, CardTitle } from "reactstrap"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
    PaginationProvider, PaginationListStandalone,
    SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import PropTypes from "prop-types";

// import "../../assets/scss/datatables.scss"


class ReportTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            sizePerPage: 30,
        }
    }

    componentDidMount() {
        this.loadYear()
    }

    loadYear = () => {
        let dateDropdown = document.getElementById('date-dropdown');
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

    render() {
        const columns = [{
            dataField: 'emp_id',
            text: 'Employee Id',
            sort: true,
        }, {
            dataField: 'first_name',
            text: 'Recruiter Name',
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
            totalSize: this.props.data.length, // replace later with size(customers),
            custom: true,
        }

        const { SearchBar } = Search;
        return (
            <React.Fragment>
                <PaginationProvider
                    pagination={paginationFactory(pageOptions)}
                    keyField='id'
                    columns={columns}
                    data={this.props.data}
                >
                    {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                            keyField='id'
                            columns={columns}
                            data={this.props.data}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <Row className="mb-2 justify-content-between">
                                        <Col md="auto">
                                            <p className='font-size-12 mb-2'>Reports</p>
                                            <CardTitle>CV Source Report</CardTitle>
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
                                            <div className="d-flex align-content-center" style={{ maxWidth: "200px", minWidth: "100px" }}><label style={{ alignSelf: "center", marginBottom: "0", fontSize: "16px", marginRight: "5px" }}>Year</label><select value={this.props.year} onChange={e => this.props.filterYear(e)} className='form-control' id='date-dropdown'></select></div>
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
ReportTable.propTypes = {
    data: PropTypes.array,
    filterYear: PropTypes.func,
    year: PropTypes.string
};
export default ReportTable