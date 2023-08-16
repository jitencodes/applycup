import React, { useEffect, useState, useRef } from "react";
import { Row, Col} from "reactstrap";
import Pagination from 'components/Common/Pagination';
import { TableHeader, Search } from "components/Datatable/index";
import useFullPageLoader from "../../components/Common/useFullPageLoader"
import { get, post } from "../../helpers/api_helper";
import { GET_ALL_MASTERS, GET_CLIENT_TRACKING, GET_CLIENT_QUICK_VIEW } from "../../helpers/api_url_helper";
import toastr from "toastr";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
const ClientTracking = () => {
    const [tableData, settableData] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter_client_status, setFilterCLientStatus] = useState([]);
    const [filter_clients, setFilterClients] = useState([]);
    const [Masterloaded, setMasterloaded] = useState(false);
    const [quick_view_load, setQuickViewLoad] = useState(false);
    const [client_quick_view_data, setCLientQuickViewData] = useState([]);
    const [client_status, setCLientStatus] = useState([]);
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
        { name: "Client Name", field: "client_name", sortable: false },
        { name: "No. of Position", field: "no_of_position", sortable: false },
        { name: "Candidates Assigned", field: "candidate_assign", sortable: false },
        { name: "Client Source", field: "client_source", sortable: false },
        { name: "SPOC", field: "spoc", sortable: false },
        { name: "Status", field: "status", sortable: false },
        { name: "First Created", field: "created_at", sortable: false },
    ];
    let PageSize = 50;
    useEffect(() => {
        showLoader()
        let clients = (filter_clients !== null && filter_clients !== undefined) && filter_clients
        let client_status = (filter_client_status !== null && filter_client_status !== undefined) && filter_client_status
        const formData = { length: PageSize, start: currentPage, clients: clients, start_date: startDate, end_date: endDate, client_status: client_status };
        post(GET_CLIENT_TRACKING, formData).then(res => {
            hideLoader()
            if (res) {
                settableData(res.data)
                setTotalItems(res.total)
            }
        }).catch(err => {
            hideLoader()
            toastr.error(err?.response?.data?.message)
        })
    }, [currentPage, endDate, filter_client_status, filter_clients])  // pass `value` as a dependency

    const downloadData = () => {
        let clients = (filter_clients !== null && filter_clients !== undefined) && filter_clients
        let client_status = (filter_client_status !== null && filter_client_status !== undefined) && filter_client_status
        const formData = { length: 100000, start: 1, clients: clients, start_date: startDate, end_date: endDate, client_status: client_status };
        post(GET_CLIENT_TRACKING, formData).then(response => {
            if (response.status) {
                setHeaders([
                    { label: "Client Name", key: "company"},
                    { label: "No. of Position", key: "no_of_position" },
                    { label: "Candidates Assigned", key: "candidate_assign"},
                    { label: "Client Source", key: "source"},
                    { label: "SPOC", key: "employee"},
                    { label: "Status", key: "status"},
                    { label: "First Created", key: "created_at"}
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

    useEffect(() => {
        if (quick_view_load == false) {
            setQuickViewLoad(true)
            get(GET_CLIENT_QUICK_VIEW).then(res => {
                if (res.status) {
                    setCLientQuickViewData(res.data)
                }
            }).catch(err => {
                toastr.error(err?.response?.data?.message)
            })
        }
    })

    useEffect(() => {
        if (Masterloaded == false) {
            setMasterloaded(true)
            get(GET_ALL_MASTERS, { params: { masters: 'client_status,active_clients' } }).then(res => {
                if (res.status) {
                    let data = res.data;
                    setCLientStatus(data.client_status)
                    // setOpenings(data.current_openings)
                    setActiveClients(data.active_clients)
                }
            }).catch(err => {
                toastr.error(err?.response?.data?.message)
            })
        }
    })

    return (
        <React.Fragment>
            {quick_view_load === true &&
                <>
                <Row>
                    {client_quick_view_data && client_quick_view_data.map((val, key) => {
                        return (
                            <Col key={key}>
                                <div style={{padding:'10px',minHeight:"100px",boxShadow:"0 0 5px #eee"}}>
                                <p className="text-muted fw-medium" style={{minHeight:"38px"}}>{val.status} Clients</p>
                                <h4 className="mb-0">{val.total}</h4>
                                </div>
                            </Col>
                        )
                    })}
                </Row>
                <hr/>
                </>
            }
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
                    <label>Clients</label>
                    <Select isMulti={true} options={active_clients} isClearable={true} onChange={(e) => { setFilterClients(e);setCurrentPage(1) }} classNamePrefix="select2-selection"></Select>
                </Col>
                <Col md="2">
                    <label>Client Status</label>
                    <Select isMulti={true} options={client_status} isClearable={true} onChange={(e) => { setFilterCLientStatus(e);setCurrentPage(1) }} classNamePrefix="select2-selection"></Select>
                </Col>
                <Col md="1" className="align-self-end">
                    <button title="Export" type="button" onClick={downloadData} className="btn-rounded btn btn-outline-primary"><i className="mdi mdi-file-export"></i> CSV</button>
                    {headers.length > 0 && <CSVLink data={newData} headers={headers} filename={`clients-tracking.csv`} target="_blank" ref={csvInstance}></CSVLink>}
                </Col>
            </Row>
            <hr />
            <div className="table-responsive">
                <table className="table table-striped">
                    <TableHeader
                        headers={TableColum}
                    />
                    <tbody className="">{loader && <tr><th colSpan={TableColum.length}><h4 className="text-center">Loading...</h4></th></tr>}
                        {(!loader && tableData.length === 0) && <tr><th colSpan={TableColum.length}><h4 className="text-center">No data found</h4></th></tr>}
                        {!loader && tableData.map((value, index) => (
                            <tr className="font-size-12" key={++index}>
                                <th scope="row">
                                    {PageSize * (currentPage - 1) + (index + 1)}
                                </th>
                                <th><div>{value.company}</div><div><small>{value.location}</small></div></th>
                                <td>{value.no_of_position}</td>
                                <td>{value.candidate_assign}</td>
                                <td>{value.source}</td>
                                <td>{value.employee}</td>
                                <td>{value.status}</td>
                                <td>{value.created_at}</td>
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

export default ClientTracking
