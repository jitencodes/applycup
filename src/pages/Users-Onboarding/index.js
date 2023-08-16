import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap"
import MetaTags from 'react-meta-tags'
import Pagination from 'components/Common/Pagination';
import { TableHeader, Search } from "components/Datatable/index";
import Breadcrumbs from "../../components/Common/Breadcrumb"
import useFullPageLoader from "../../components/Common/useFullPageLoader"
import { Link } from "react-router-dom";
import { get } from "../../helpers/api_helper";
import { GET_USERS } from "../../helpers/url_helper";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const UserBoarding = (props) => {
    let PageSize = 15;
    const [tableData, settableData] = useState([])
    const [loader, showLoader, hideLoader] = useFullPageLoader()
    const [totalItems, setTotalItems] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")

    useEffect(() => {
        showLoader()
        const params = { keyword: search, length: PageSize, start: currentPage };
        get(GET_USERS, { params: params }).then(res => {
            if (res) {
                settableData(res.data)
                setTotalItems(res.total)
            }
            hideLoader()
        }).catch(err => {
            hideLoader()
            toastr.error(err?.response?.data?.message)
        })
    }, [currentPage, search])  // pass `value` as a dependency

    const TableColum = [
        { name: "#", field: "id", sortable: false },
        { name: "Role", field: "name", sortable: false },
        { name: "Employment Type", field: "employment_type", sortable: false },
        { name: "Department", field: "department", sortable: false },
        { name: "First Name", field: "first_name", sortable: false },
        { name: "Last Name", field: "last_name", sortable: false },
        { name: "Employee Id", field: "emp_id", sortable: false },
        { name: "Mobile 1", field: "phone", sortable: false },
        { name: "Mobile 2", field: "mobile", sortable: false },
        { name: "Email", field: "email", sortable: false },
        { name: "DOB", field: "dob", sortable: false },
        { name: "Location", field: "location", sortable: false },
        { name: "Remarks", field: "remarks", sortable: false },
        { name: "Job-Post Enable", field: "", sortable: false },
        { name: "Status", field: "", sortable: false },
        { name: "Action", field: "", sortable: false },
    ];
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>User Boarding | Applycup Hiring Solutions</title>
                </MetaTags>
                <div className="container-fluid">
                    <Breadcrumbs title="Dashboard" breadcrumbItem="User Boarding" />
                    <Row>
                        <Col className="col-12">
                            <Card>
                                <CardBody>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Search
                                                onSearch={value => {
                                                    setSearch(value);
                                                    setCurrentPage(1);
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-6 d-flex flex-row-reverse">
                                            <div>
                                                <a href="/user-boarding/add"
                                                    className="btn btn-primary waves-effect waves-light"><i
                                                        className="bx bx-plus font-size-16 align-middle me-2"></i> Add</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <TableHeader headers={TableColum} />
                                            <tbody className="">{loader && <tr>
                                                <th colSpan={TableColum.length}><h4
                                                    className="text-center">Loading...</h4></th>
                                            </tr>}
                                                {(!loader && tableData.length === 0) && <tr>
                                                    <th colSpan={TableColum.length}><h4 className="text-center">No data
                                                        found</h4></th>
                                                </tr>}
                                                {!loader && tableData.map((value, index) => (
                                                    <tr key={++index}>
                                                        <th scope="row">
                                                            {PageSize * (currentPage - 1) + (index + 1)}
                                                        </th>
                                                        <td>{value.role_name}</td>
                                                        <td>{value.employment_type}</td>
                                                        <td>{value.department}</td>
                                                        <td>{value.first_name}</td>
                                                        <td>{value.last_name}</td>
                                                        <td>{value.emp_id}</td>
                                                        <td>{value.mobile}</td>
                                                        <td>{value.mobile_2}</td>
                                                        <td>{value.email}</td>
                                                        <td>{value.dob}</td>
                                                        <td>{value.location_name}</td>
                                                        <td>{value.remark}</td>
                                                        <td>{value.requirement_enable === "1" ? <span className="badge badge-pill bg-success font-size-13">Yes</span> :
                                                            <span className="badge badge-pill bg-danger font-size-13">No</span>}</td>
                                                        <td>{value.status === "1" ? <span className="badge badge-pill bg-success font-size-13">Active</span> :
                                                            <span className="badge badge-pill bg-danger font-size-13">Inactive</span>}</td>
                                                        <td><Link to={`/user-boarding/edit/${value.id}`}><i
                                                            className="bx bxs-edit-alt"></i> </Link></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {!loader && <Row className="justify-content-center">
                                        <Col className="col-auto">
                                            <Pagination
                                                className="pagination-bar"
                                                currentPage={currentPage}
                                                totalCount={totalItems}
                                                pageSize={PageSize}
                                                onPageChange={page => setCurrentPage(page)}
                                            />
                                        </Col>
                                    </Row>
                                    }
                                </CardBody>̵
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    )
}

export default UserBoarding
