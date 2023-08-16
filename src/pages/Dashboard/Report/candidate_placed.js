import React, { Component } from "react"
import { Row, Col} from "reactstrap"
// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
    PaginationProvider, PaginationListStandalone,
    SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import PropTypes from "prop-types";

// import "./datatables.scss"


class CandidatePlaced extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            sizePerPage: 10,
            productData: this.props.data
        }
    }

    render() {
        const columns = [{
            dataField: 'id',
            text: 'Id',
            sort: true,
        }, {
            dataField: 'recruiter',
            text: 'Recruiter Name',
            sort: true
        }, {
            dataField: 'total',
            text: 'Candidates Placed',
            sort: true
        }];

        const defaultSorted = [{
            dataField: 'Total',
            order: 'desc'
        }];

        const pageOptions = {
            sizePerPage: 10,
            totalSize: this.props.data.length, // replace later with size(customers),
            custom: true,
        }

        // Custom Pagination Toggle
        const sizePerPageList = [
            { text: '5', value: 5 },
            { text: '10', value: 10 },
            { text: '15', value: 15 },
            { text: '20', value: 20 },
            { text: '25', value: 25 },
            { text: 'All', value: (this.state.productData).length }];

        const { SearchBar } = Search;

        return (
            <React.Fragment>
                <PaginationProvider
                    pagination={paginationFactory(pageOptions)}
                    keyField='id'
                    columns={columns}
                    data={this.state.productData}
                >
                    {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                            keyField='id'
                            columns={columns}
                            data={this.state.productData}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>

                                    <Row className="mb-2">
                                        <Col md="4">
                                            <div className="search-box me-2 mb-2 d-inline-block">
                                                <div className="position-relative">
                                                    <SearchBar
                                                        {...toolkitProps.searchProps}
                                                    />
                                                    <i className="bx bx-search-alt search-icon" />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

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
                                                        "table align-middle table-nowrap table-sm"
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
                                            <div className="d-inline">
                                                <SizePerPageDropdownStandalone
                                                    {...paginationProps}
                                                />
                                            </div>
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
CandidatePlaced.propTypes = {
    data: PropTypes.array
};
export default CandidatePlaced