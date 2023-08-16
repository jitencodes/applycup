import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import Pagination from 'components/Common/Pagination';
import { TableHeader, Search } from "components/Datatable/index";
import useFullPageLoader from "../../components/Common/useFullPageLoader"
import { get, post } from "../../helpers/api_helper";
import { GET_ALL_MASTERS, GET_JOB_PREFORM, GET_JOB_PREFORM_QUICK_VIEW } from "../../helpers/api_url_helper";
import toastr from "toastr";
import { Link } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
const JobPerformance = () => {
    const [tableData, settableData] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState([]);
    const [filter_job, setFilterJob] = useState([]);
    const [filter_job_status, setFilterJobStatus] = useState([]);
    const [filter_clients, setFilterClients] = useState([]);
    const [Masterloaded, setMasterloaded] = useState(false);
    const [quick_view_load, setQuickViewLoad] = useState(false);
    const [quick_view_data, setQuickViewData] = useState([]);
    const [job_status, setJobStatus] = useState([]);
    const [openings, setOpenings] = useState([]);
    const [active_clients, setActiveClients] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [newData, setNewData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const csvInstance = useRef();
    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        setCurrentPage(1)
      };
    const TableColum = [
        { name: "#", field: "id", sortable: false },
        { name: "Job Title", field: "job_title", sortable: false },
        { name: "Job Status", field: "job_status", sortable: false },
        { name: "Open Duration", field: "open_duration", sortable: false },
        { name: "Client", field: "client", sortable: false },
        { name: "Candidates in Progress", field: "candidate_data", sortable: false },
        { name: "Added Candidates", field: "candidate_data", sortable: false },
        { name: "Rejected", field: "candidate_data", sortable: false },
        { name: "Offered", field: "candidate_data", sortable: false },
        { name: "Joined", field: "candidate_data", sortable: false },
        { name: "Recruiter in Charge", field: "recruiter", sortable: false },
        { name: "Assigned To", field: "assign_to", sortable: false },
        { name: "First Created", field: "first_created", sortable: false }
    ];
    let PageSize = 20;
    useEffect(() => {
        showLoader()
        let job = (filter_job !== null && filter_job !== undefined) && filter_job
        let clients = (filter_clients !== null && filter_clients !== undefined) && filter_clients
        let job_status = (filter_job_status !== null && filter_job_status !== undefined) && filter_job_status
        const formData = { keyword: search, length: PageSize, start: currentPage, sort: sorting, clients: clients, start_date: startDate, end_date: endDate, jobs: job, job_status: job_status };
        post(GET_JOB_PREFORM, formData).then(res => {
            hideLoader()
            if (res) {
                settableData(res.data)
                setTotalItems(res.total)
            }
        }).catch(err => {
            hideLoader()
            toastr.error(err)
        })
    }, [currentPage, endDate, filter_job, filter_job_status, filter_clients])  // pass `value` as a dependency

    useEffect(() => {
        if (quick_view_load == false) {
            setQuickViewLoad(true)
            get(GET_JOB_PREFORM_QUICK_VIEW).then(res => {
                if (res.status) {
                    setQuickViewData(res.data)
                }
            }).catch(err => {
                toastr.error(err)
            })
        }
    })

    useEffect(() => {
        if (Masterloaded == false) {
            setMasterloaded(true)
            get(GET_ALL_MASTERS, { params: { masters: 'requirement_status,current_openings,active_clients' } }).then(res => {
                if (res.status) {
                    let data = res.data;
                    setJobStatus(data.requirement_status)
                    setOpenings(data.current_openings)
                    setActiveClients(data.active_clients)
                }
            }).catch(err => {
                toastr.error(err)
            })
        }
    })

    const downloadData = () => {
        let job = (filter_job !== null && filter_job !== undefined) && filter_job
        let clients = (filter_clients !== null && filter_clients !== undefined) && filter_clients
        let job_status = (filter_job_status !== null && filter_job_status !== undefined) && filter_job_status
        const formData = { keyword: search, length: 100000, start: 1, sort: sorting, clients: clients, start_date: startDate, end_date: endDate, jobs: job, job_status: job_status };
        post(GET_JOB_PREFORM, formData).then(response => {
            if (response.status) {
                setHeaders([
                    { label: "Job Title", key: "job_title"},
                    { label: "Job Status", key: "job_status"},
                    { label: "Open Duration", key: "open_duration"},
                    { label: "Client", key: "client"},
                    { label: "Candidates in Progress", key: "candidate_data.candidates_progress"},
                    { label: "Added Candidates", key: "candidate_data.added_candidates"},
                    { label: "Rejected", key: "candidate_data.reject"},
                    { label: "Offered", key: "candidate_data.offered"},
                    { label: "Joined", key: "candidate_data.joining"},
                    { label: "Recruiter in Charge", key: "recruiter_charge"},
                    { label: "Assigned To", key: "employees"},
                    { label: "First Created", key: "first_created"}
                ])
                setNewData(response.data);
                if (newData && csvInstance.current && csvInstance.current.link) {
                    setTimeout(() => {
                        csvInstance.current.link.click();
                        setNewData([]);
                    });
                }
            } else {
                toastr.error(response.message)
            }
        }).catch(err => {
            toastr.error(err)
        })
    }

    return (
        <React.Fragment>
            {quick_view_load === true &&
                <>
                <Row>
                    {quick_view_data && quick_view_data.map((val, key) => {
                        return (
                            <Col key={key}>
                                <div style={{padding:'10px',minHeight:"100px",boxShadow:"0 0 5px #eee"}}>
                                <p className="text-muted fw-medium" style={{minHeight:"38px"}}>{val.status}</p>
                                <h4 className="mb-0">{val.total}</h4>
                                </div>
                            </Col>
                        )
                    })}
                </Row>
                <hr/>
                </>
            }
            <Row>
                <Col md="2">
                    <label>Date</label>
                    <DatePicker
                        className={'form-control'}
                        dateFormat="dd-MM-yyyy" placeholderText={"dd-mm-yyyy"}
                        selected={startDate}
                        onChange={onChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                    />
                </Col>
                <Col md="4">
                    <label>Jobs</label>
                    <Select isMulti={true} options={openings} isClearable={true} onChange={(e) => { setFilterJob(e) }} classNamePrefix="select2-selection"></Select>
                </Col>
                <Col md="3">
                    <label>Clients</label>
                    <Select isMulti={true} options={active_clients} isClearable={true} onChange={(e) => { setFilterClients(e) }} classNamePrefix="select2-selection"></Select>
                </Col>
                <Col md="2">
                    <label>Job Status</label>
                    <Select isMulti={true} options={job_status} isClearable={true} onChange={(e) => { setFilterJobStatus(e) }} classNamePrefix="select2-selection"></Select>
                </Col>
                <Col md="1" className="align-self-end">
                    <button title="Export" type="button" onClick={downloadData} className="btn-rounded btn btn-outline-primary"><i className="mdi mdi-file-export"></i> CSV</button>
                    {headers.length > 0 && <CSVLink data={newData} headers={headers} filename={`job-performances.csv`} target="_blank" ref={csvInstance}></CSVLink>}
                </Col>
            </Row>
            <hr />
            <div className="table-responsive">
                <table className="table table-striped">
                    <TableHeader
                        headers={TableColum}
                        onSorting={(field, order) =>
                            setSorting({ field, order })
                        }
                    />
                    <tbody className="">{loader && <tr><th colSpan={TableColum.length}><h4 className="text-center">Loading...</h4></th></tr>}
                        {(!loader && tableData.length === 0) && <tr><th colSpan={TableColum.length}><h4 className="text-center">No data found</h4></th></tr>}
                        {!loader && tableData.map((value, index) => (
                            <tr className="font-size-12" key={++index}>
                                <th scope="row">
                                    {PageSize * (currentPage - 1) + (index + 1)}
                                </th>
                                <th><Link to={`/openings/detail/${value.id}`}>{value.job_title}</Link></th>
                                <td>{value.job_status}</td>
                                <td>{value.open_duration}</td>
                                <td>{value.client}</td>
                                <td>{value.candidate_data.candidates_progress !== null ? value.candidate_data.candidates_progress : 0}</td>
                                <td>{value.candidate_data.added_candidates !== null ? value.candidate_data.added_candidates : 0}</td>
                                <td>{value.candidate_data.reject !== null ? value.candidate_data.reject : 0}</td>
                                <td>{value.candidate_data.offered !== null ? value.candidate_data.offered : 0}</td>
                                <td>{value.candidate_data.joining !== null ? value.candidate_data.joining : 0}</td>
                                <td>{value.recruiter_charge}</td>
                                <td>{value.employees && value.employees.map((val, key) => {
                                    return (
                                        <span className="badge bg-primary me-2 font-size-12 mb-2" key={key}>{val.employee}</span>
                                    )
                                })}</td>
                                <td>{value.first_created}</td>
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
        </React.Fragment>
    )
}

export default JobPerformance
