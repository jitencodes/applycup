import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import Pagination from 'components/Common/Pagination';
import { TableHeader, Search } from "components/Datatable/index";
import useFullPageLoader from "../../components/Common/useFullPageLoader"
import { get, post } from "../../helpers/api_helper";
import { GET_ALL_MASTERS, GET_TEAM_TRACKER } from "../../helpers/api_url_helper";
import toastr from "toastr";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
const TeamTracker = () => {
    const [tableData, settableData] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [sorting, setSorting] = useState([]);
    const [filter_job, setFilterJob] = useState([]);
    const [Masterloaded, setMasterloaded] = useState(false);
    const [openings, setOpenings] = useState([]);
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
        { name: "Employee id", field: "emp_id", sortable: false },
        { name: "Employee Name", field: "employee_name", sortable: false },
        { name: "Total Added", field: "added_candidates", sortable: false },
        { name: "In process", field: "open_duration", sortable: false },
        { name: "Rejected", field: "candidate_data", sortable: false },
        { name: "Offered", field: "candidate_data", sortable: false },
        { name: "Joined", field: "candidate_data", sortable: false }
    ];
    let PageSize = 20;
    useEffect(() => {
        showLoader()
        let job = (filter_job !== null && filter_job !== undefined) && filter_job
        const formData = { length: PageSize, start: currentPage, sort: sorting, start_date: startDate, end_date: endDate, jobs: job };
        post(GET_TEAM_TRACKER, formData).then(res => {
            if (res) {
                settableData(res.data)
                setTotalItems(res.total)
            }
            hideLoader()
        }).catch(err => {
            hideLoader()
            toastr.error(err?.response?.data?.message)
        })
    }, [currentPage, endDate, filter_job])  // pass `value` as a dependency

    useEffect(() => {
        if (Masterloaded == false) {
            setMasterloaded(true)
            get(GET_ALL_MASTERS, { params: { masters: 'current_openings' } }).then(res => {
                if (res.status) {
                    let data = res.data;
                    setOpenings(data.current_openings)
                }
            }).catch(err => {
                toastr.error(err?.response?.data?.message)
            })
        }
    })

    const downloadData = () => {
        let job = (filter_job !== null && filter_job !== undefined) && filter_job
        const formData = { length: 100000, start: 1, sort: sorting, start_date: startDate, end_date: endDate, jobs: job};
        post(GET_TEAM_TRACKER, formData).then(response => {
            if (response.status) {
                setHeaders([
                    { label: "Employee id", key: "emp_id"},
                    { label: "Employee Name", key: "employee_name"},
                    { label: "Added", key: "added_candidates"},
                    { label: "In process", key: "candidates_progress"},
                    { label: "Rejected", key: "reject"},
                    { label: "Dropped", key: "dropped"},
                    { label: "Offered", key: "offered"},
                    { label: "Joined", key: "joining"}
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
            toastr.error(err?.response?.data?.message)
        })
    }

    return (
        <React.Fragment>
            <Row className="justify-content-end">
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
                <Col md="auto" className="align-self-end">
                    <button title="Export" type="button" onClick={downloadData} className="btn-rounded btn btn-outline-primary"><i className="mdi mdi-file-export"></i> CSV</button>
                    {headers.length > 0 && <CSVLink data={newData} headers={headers} filename={`team-tracking.csv`} target="_blank" ref={csvInstance}></CSVLink>}
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
                                <td>{value.emp_id}</td>
                                <td>{value.employee_name}</td>
                                <td>{value.added_candidates}</td>
                                <td>{value.candidates_progress}</td>
                                <td>{parseInt(value.reject)+(parseInt(value.dropped))}</td>
                                <td>{value.offered}</td>
                                <td>{value.joining}</td>
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

export default TeamTracker
