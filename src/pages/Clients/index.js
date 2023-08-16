import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, Input, Button } from "reactstrap";
import MetaTags from 'react-meta-tags'
import Pagination from 'components/Common/Pagination';
import {TableHeader, Search} from "components/Datatable/index";
import Breadcrumbs from "../../components/Common/Breadcrumb"
import useFullPageLoader from "../../components/Common/useFullPageLoader"
import { Link } from "react-router-dom";
import {get} from "../../helpers/api_helper";
import {GET_CLIENTS} from "../../helpers/api_url_helper";
import toastr from "toastr";
const Clients = () => {
  const [tableData, settableData] = useState([]);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState([]);
  const TableColum = [
    {name: "#", field: "id", sortable: false},
    {name: "Company Name", field: "name", sortable: false},
    {name: "Contact Person", field: "contact_person", sortable: false},
    {name: "Designation", field: "designation", sortable: false},
    {name: "Mobile 1", field: "mobile", sortable: false},
    {name: "Mobile 2", field: "mobile_2", sortable: false},
    {name: "Email", field: "email", sortable: false},
    {name: "Location", field: "location", sortable: false},
    {name: "Client Source", field: "client_source", sortable: false},
    {name: "Client Status", field: "client_status", sortable: false},
    {name: "Responsible Person", field: "first_name", sortable: false},
    {name: "Notes", field: "notes", sortable: false},
    {name: "Status", field: "status", sortable: false},
    {name: "Action", field: "", sortable: false},
  ];
  let PageSize = 15;
  useEffect(() => {
    showLoader()
    const params = {keyword: search, length: PageSize, start: currentPage,sort: sorting};
    get(GET_CLIENTS, {params: params}).then(res => {
      hideLoader()
      if (res) {
        settableData(res.data)
        setTotalItems(res.total)
      }
    }).catch(err => {
      hideLoader()
      toastr.error(err?.response?.data?.message)
    })
  }, [currentPage, search, sorting])  // pass `value` as a dependency
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Manage Clients | Applycup Hiring Solutions</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Dashboard" breadcrumbItem="Manage Clients" />
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
                        <a href="/clients/add"
                           className="btn btn-primary waves-effect waves-light"><i
                          className="bx bx-plus font-size-16 align-middle me-2"></i> Add</a>
                      </div>
                      {/* <div className={"me-3"}><Button color="primary" type="button" id="inputGroupFileAddon04">Export</Button></div> */}
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <TableHeader
                        headers={TableColum}
                        onSorting={(field, order) =>
                            setSorting({field, order})
                        }
                      />
                      <tbody className="">{loader && <tr><th colSpan={TableColum.length}><h4 className="text-center">Loading...</h4></th></tr>}
                      {(!loader && tableData.length === 0) && <tr><th colSpan={TableColum.length}><h4 className="text-center">No data found</h4></th></tr>}
                      {!loader && tableData.map((value,index) => (
                        <tr className="font-size-12" key={++index}>
                          <th scope="row">
                            {PageSize * (currentPage - 1) + (index + 1)}
                          </th>
                          <th>{value.name}</th>
                          <td>{value.contact_person}</td>
                          <td>{value.designation}</td>
                          <td>{value.mobile}</td>
                          <td>{value.mobile_2}</td>
                          <td>{value.email}</td>
                          <td>{value.location}</td>
                          <td>{value.client_source}</td>
                          <td>{value.client_status}</td>
                          <td>{value.first_name} {value.last_name}</td>
                          <td>{value.notes}</td>
                          <td>{value.status === "1" ? <span className="badge badge-pill badge-soft-success font-size-13">Active</span> : <span className="badge badge-pill badge-soft-danger font-size-13">Inactive</span>}</td>
                          <td><Link to={`/clients/edit/${value.id}`}><i className="bx bxs-edit-alt"></i> </Link></td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                  <Row className="justify-content-center">
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Clients
