import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Input, Button } from "reactstrap";
import MetaTags from 'react-meta-tags'
import Pagination from 'components/Common/Pagination';
import {TableHeader, Search} from "components/Datatable/index";
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import useFullPageLoader from "../../../components/Common/useFullPageLoader"
import { Link } from "react-router-dom";
import {get} from "../../../helpers/api_helper";
import {GET_CANDIDATE_STATUS} from "../../../helpers/api_url_helper";
import toastr from "toastr";
const CandidateStatus = () => {
  const [tableData, settableData] = useState([]);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const TableColum = [
    {name: "#", field: "id", sortable: false},
    {name: "Candidate Status", field: "name", sortable: false},
    {name: "Ordering", field: "ordering", sortable: false},
    {name: "Status", field: "status", sortable: false},
    {name: "Action", field: "", sortable: false},
  ];
  let PageSize = 15;
  useEffect(() => {
    showLoader()
    const params = {keyword: search, length: PageSize, start: currentPage};
    get(GET_CANDIDATE_STATUS, {params: params}).then(res => {
      hideLoader()
      if (res) {
        settableData(res.data)
        setTotalItems(res.total)
      }
    }).catch(err => {
      hideLoader()
      toastr.error(err)
    })
  }, [currentPage, search])  // pass `value` as a dependency
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Candidate Status | {process.env.REACT_APP_PROJECTNAME}</title>
        </MetaTags>
        <div className="container-fluid">
          <Breadcrumbs title="Dashboard" breadcrumbItem="Candidate Status" />
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
                        <a href="/candidate-status/add"
                           className="btn btn-primary waves-effect waves-light"><i
                          className="bx bx-plus font-size-16 align-middle me-2"></i> Add</a>
                      </div>
                      <div className={"me-3"}>
                        <div className="input-group">
                          <Input type="file" className="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
                          <Button color="primary" type="button" id="inputGroupFileAddon04">Import</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <TableHeader
                        headers={TableColum}
                        // onSorting={(field, order) =>
                        //     setSorting({field, order})
                        // }
                      />
                      <tbody className="">{loader && <tr><th colSpan={TableColum.length}><h4 className="text-center">Loading...</h4></th></tr>}
                      {(!loader && tableData.length === 0) && <tr><th colSpan={TableColum.length}><h4 className="text-center">No data found</h4></th></tr>}
                      {!loader && tableData.map((value,index) => (
                        <tr key={++index}>
                          <th scope="row">
                            {PageSize * (currentPage - 1) + (index + 1)}
                          </th>
                          <td>{value.name}</td>
                          <td>{value.ordering}</td>
                          <td>{value.status === "1" ? <span className="badge badge-pill bg-success font-size-13">Active</span> : <span className="badge badge-pill bg-danger font-size-13">Inactive</span>}</td>
                          <td><Link to={`/candidate-status/edit/${value.id}`}><i className="bx bxs-edit-alt"></i> </Link></td>
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

export default CandidateStatus
