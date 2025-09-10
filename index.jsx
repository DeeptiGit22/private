import Header from "../../components/Header/Header";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { api } from "../../core/apis/configs/axiosUtils";
import KeyboardArrowLeftOutlined from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlined from "@mui/icons-material/KeyboardArrowRightOutlined";
import AddIcon from "../../../assets/images/add-user.png";
import TextArea from "antd/es/input/TextArea";
import EditIcon from "../../../assets/images/edit-user.png";
import DeleteIcon from "../../../assets/images/delete-user.png";
import { styled } from "@mui/material";
import { withTheme } from "@mui/styles";
import dayjs from 'dayjs';
import process from "process";
import './TaskList.css'

import {
    Button, Dropdown, Menu,
    DatePicker,
    Input,
    Modal,
    Pagination,
    Table,
    notification,
} from "antd";
import { Tooltip } from "antd";
import InfoIcon from "@mui/icons-material/Info";
import CircularIndeterminate from "../loader";
import { getTaskList, getMyTaskList, insertTaskList, updateTaskList, deleteTaskList } from "../../core/apis/SummaryOneAPI";
import UpgradeRequestForm from "../ProFeature/UpgradeRequestForm";

export function TaskList({ pageName }) {
    // ---------------type of status: meaning-------------------------
    // Pending: When the assigner assigns a task to the assignee
    // In Review: When the assignee provides a response & submits the task back to the assigner for review
    // Rejected: When the assigner rejects the 'In Review' task
    // Closed: When the assigner approves the 'In Review' task

    const { Option } = Select;
    const ThemeState = useSelector((state) => state.themeState.theme);
    const calenderData = useSelector((state) => state.calender);
    const role = localStorage.getItem("user_role")
    const persona = localStorage.getItem("user_persona");
    const [selectedList, setSelectedList] = useState('assigned'); //assigned task or received task
    const [showPlanReq, setShowPlanReq] = useState(false);
    const dispatch = useDispatch();


    const viewFile = async (fileKey) => {
        await api.post('/task/get-file-url', {
            fileKey,
            user_email: localStorage.getItem("emailToken") || "NA",
            user_name: localStorage.getItem("Data_API_name") || "NA",
            persona: localStorage.getItem("user_persona") || "NA",
            role: localStorage.getItem("user_role") || "NA",
            user_source_persona: localStorage.getItem("user_source_persona") || "NA",
            user_vertical: localStorage.getItem("Data_API_vertical") || "NA",
            user_department: localStorage.getItem("Data_API_department_code") || "NA",
            user_division: localStorage.getItem("Data_API_division_code") || "NA",
            pageName,
        })
            .then(data => {
                if (data.data.url) {
                    window.open(data.data.url, '_blank');
                    // const a = document.createElement('a');
                    // a.href = data.data.url;
                    // a.download = ''; // Or set to 'filename.pdf' if you want a custom name
                    // document.body.appendChild(a);
                    // a.click();
                    // document.body.removeChild(a);
                } else {
                    alert('Failed to generate file URL.');
                }
            });
    }


    const show = useSelector((state) => state.themeState.showNav);
    const columns = useMemo(() => {
        const baseColumns = [
            {
                key: "taskid",
                title: "Task ID",
                dataIndex: "taskid",
                render: (text, record) => (
                    <span
                        style={{
                            color: '#1890ff',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                        }}
                        onClick={async () => {
                            if (record.title == 'upgrade plan') {
                                setShowPlanReq(true);
                            } else {
                                if (selectedList == 'assigned' && (record.status == 'Pending' || record.status == 'Rejected')) {
                                    // modal to just display the details
                                    setisModalOpen(true);
                                    const res = await api.post('/task/list-task-files',
                                        {
                                            taskName: record.title,
                                            user_email: localStorage.getItem("emailToken") || "NA",
                                            user_name: localStorage.getItem("Data_API_name") || "NA",
                                            persona: localStorage.getItem("user_persona") || "NA",
                                            role: localStorage.getItem("user_role") || "NA",
                                            user_source_persona: localStorage.getItem("user_source_persona") || "NA",
                                            user_vertical: localStorage.getItem("Data_API_vertical") || "NA",
                                            user_department: localStorage.getItem("Data_API_department_code") || "NA",
                                            user_division: localStorage.getItem("Data_API_division_code") || "NA",
                                            pageName,

                                        })
                                        .then(data => {
                                            const container = document.getElementById('file-list-received');
                                            container.innerHTML = '';

                                            if (!data?.data.files || data?.data.files.length === 0) {
                                                container.innerText = 'No files found.';
                                                return;
                                            }

                                            data?.data.files.forEach(file => {
                                                const fileLink = document.createElement('a');
                                                fileLink.href = '#';
                                                fileLink.innerText = file.name;
                                                fileLink.onclick = () => viewFile(file.key);
                                                container.appendChild(fileLink);
                                                container.appendChild(document.createElement('br'));
                                            });
                                        });
                                } else if (selectedList == 'received' && (record.status == 'In Review')) {
                                    // modal to just display the details
                                    setisModalOpen(true);
                                    const res = await api.post('/task/list-task-files',
                                        {
                                            taskName: record.title,
                                            user_email: localStorage.getItem("emailToken") || "NA",
                                            user_name: localStorage.getItem("Data_API_name") || "NA",
                                            persona: localStorage.getItem("user_persona") || "NA",
                                            role: localStorage.getItem("user_role") || "NA",
                                            user_source_persona: localStorage.getItem("user_source_persona") || "NA",
                                            user_vertical: localStorage.getItem("Data_API_vertical") || "NA",
                                            user_department: localStorage.getItem("Data_API_department_code") || "NA",
                                            user_division: localStorage.getItem("Data_API_division_code") || "NA",
                                            pageName,
                                        })
                                        .then(data => {
                                            const container = document.getElementById('file-list-received');
                                            container.innerHTML = '';

                                            if (!data?.data.files || data?.data.files.length === 0) {
                                                container.innerText = 'No files found.';
                                                return;
                                            }

                                            data?.data.files.forEach(file => {
                                                const fileLink = document.createElement('a');
                                                fileLink.href = '#';
                                                fileLink.innerText = file.name;
                                                fileLink.onclick = () => viewFile(file.key);
                                                container.appendChild(fileLink);
                                                container.appendChild(document.createElement('br'));
                                            });
                                        });
                                } else if (selectedList == 'assigned' && (record.status == 'In Review')) {
                                    setisEditModalOpen(true);
                                    const res = await api.post('/task/list-task-files',
                                        {
                                            taskName: record.title,
                                            user_email: localStorage.getItem("emailToken") || "NA",
                                            user_name: localStorage.getItem("Data_API_name") || "NA",
                                            persona: localStorage.getItem("user_persona") || "NA",
                                            role: localStorage.getItem("user_role") || "NA",
                                            user_source_persona: localStorage.getItem("user_source_persona") || "NA",
                                            user_vertical: localStorage.getItem("Data_API_vertical") || "NA",
                                            user_department: localStorage.getItem("Data_API_department_code") || "NA",
                                            user_division: localStorage.getItem("Data_API_division_code") || "NA",
                                            pageName,
                                        })
                                        .then(data => {
                                            const container = document.getElementById('file-list');
                                            container.innerHTML = '';

                                            if (!data?.data.files || data?.data.files.length === 0) {
                                                container.innerText = 'No files found.';
                                                return;
                                            }

                                            data?.data.files.forEach(file => {
                                                const fileLink = document.createElement('a');
                                                fileLink.href = '#';
                                                fileLink.innerText = file.name;
                                                fileLink.onclick = () => viewFile(file.key);
                                                container.appendChild(fileLink);
                                                container.appendChild(document.createElement('br'));
                                            });
                                        });
                                } else if (selectedList == 'received' && (record.status == 'Pending' || record.status == 'Rejected')) {
                                    setisAssigntModalOpen(true);
                                    const res = await api.post('/task/list-task-files',
                                        {
                                            taskName: record.title,
                                            user_email: localStorage.getItem("emailToken") || "NA",
                                            user_name: localStorage.getItem("Data_API_name") || "NA",
                                            persona: localStorage.getItem("user_persona") || "NA",
                                            role: localStorage.getItem("user_role") || "NA",
                                            user_source_persona: localStorage.getItem("user_source_persona") || "NA",
                                            user_vertical: localStorage.getItem("Data_API_vertical") || "NA",
                                            user_department: localStorage.getItem("Data_API_department_code") || "NA",
                                            user_division: localStorage.getItem("Data_API_division_code") || "NA",
                                            pageName,
                                        })
                                        .then(data => {
                                            const container = document.getElementById('file-list-assign');
                                            container.innerHTML = '';

                                            if (!data?.data.files || data?.data.files.length === 0) {
                                                container.innerText = 'No files found.';
                                                return;
                                            }

                                            data?.data.files.forEach(file => {
                                                const fileLink = document.createElement('a');
                                                fileLink.href = '#';
                                                fileLink.innerText = file.name;
                                                fileLink.onclick = () => viewFile(file.key);
                                                container.appendChild(fileLink);
                                                container.appendChild(document.createElement('br'));
                                            });
                                        });
                                } else if (record.status == 'Closed' && (selectedList == 'assigned' || selectedList == 'received')) {
                                    // modal to just display the details
                                    setisModalOpen(true);
                                    const res = await api.post('/task/list-task-files',
                                        {
                                            taskName: record.title,
                                            user_email: localStorage.getItem("emailToken") || "NA",
                                            user_name: localStorage.getItem("Data_API_name") || "NA",
                                            persona: localStorage.getItem("user_persona") || "NA",
                                            role: localStorage.getItem("user_role") || "NA",
                                            user_source_persona: localStorage.getItem("user_source_persona") || "NA",
                                            user_vertical: localStorage.getItem("Data_API_vertical") || "NA",
                                            user_department: localStorage.getItem("Data_API_department_code") || "NA",
                                            user_division: localStorage.getItem("Data_API_division_code") || "NA",
                                            pageName,
                                        })
                                        .then(data => {
                                            const container = document.getElementById('file-list-received');
                                            container.innerHTML = '';

                                            if (!data?.data.files || data?.data.files.length === 0) {
                                                container.innerText = 'No files found.';
                                                return;
                                            }

                                            data?.data.files.forEach(file => {
                                                const fileLink = document.createElement('a');
                                                fileLink.href = '#';
                                                fileLink.innerText = file.name;
                                                fileLink.onclick = () => viewFile(file.key);
                                                container.appendChild(fileLink);
                                                container.appendChild(document.createElement('br'));
                                            });
                                        });
                                }
                                else {
                                    setReason('');
                                    setaResponse('');
                                    setisEditModalOpen(true);
                                }
                                setFormData({
                                    task: record.title,
                                    description: record.description,
                                    deadline: dayjs(record.deadline),
                                    priority: record.priority,
                                    assignee_response: record?.assignee_response ? JSON.parse(record.assignee_response) : '',
                                    assigned_to: record.assigned_to || '',
                                    id: record.id,
                                    rejectionReason: record?.rejection_reason ? JSON.parse(record.rejection_reason) : '',
                                    status: record.status
                                })
                            };
                        }}
                    >
                        {`Task#${text}`}
                    </span>
                ),
            },
            {
                key: "title",
                title: "Title",
                dataIndex: "title",
            },
            {
                key: "assigned_date",
                title: "Assigned Date",
                dataIndex: "assigned_date",
                render: (date) => dayjs(date).format("YY/MM/DD"),
            },
            {
                key: "deadline",
                title: "Deadline",
                dataIndex: "deadline",
                render: (date) => dayjs(date).format("YY/MM/DD"),
            },
            {
                key: "priority",
                title: "Priority",
                dataIndex: "priority",
            },
            {
                key: "status",
                title: "Status",
                dataIndex: "status",
            },
        ];

        if (selectedList === 'received') {
            baseColumns.splice(3, 0, {
                key: "assigned_by",
                title: "Assigned By",
                dataIndex: "assigned_by",
            });
        }
        if (selectedList === 'assigned') {
            baseColumns.splice(3, 0, {
                key: "assigned_to",
                title: "Assigned To",
                dataIndex: "assigned_to",
            });
        }

        return baseColumns;
    }, [selectedList, role]);

    const [Data, setData] = useState({});
    const [NextTaskID, setTaskID] = useState({});
    const [pageNo, setPageNo] = React.useState(1);
    const [rowsPerPage] = React.useState(15);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setisModalOpen] = useState(false); // for assignee response modal
    const [isCreateModalOpen, setCreateModalOpen] = useState(false); // for create modal
    const [isEditModalOpen, setisEditModalOpen] = useState(false); // for assignee response modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAssigntModalOpen, setisAssigntModalOpen] = useState(false)
    const [selectedId, setSelectedId] = useState('');
    const [reason, setReason] = useState('') //stores the value of the field rejection reason
    const [aResponse, setaResponse] = useState('') //stores the value of the field assignee response
    const [formData, setFormData] = useState({
        task: '',
        description: '',
        assigned_to: '',
        deadline: null,
        priority: '',
        assignee_response: [],
        isApproved: null,
        rejectionReason: [],
        status: '',
    });

    // Update formData based on user input
    const handleInputChange = (field) => (e) => {
        let value = ''
        if (field == 'rejectionReason') {
            const newReason = e.target ? e.target.value : e;
            setReason(newReason);
            return;
        } else if (field == 'assignee_response') {
            const newReason = e.target ? e.target.value : e;
            setaResponse(newReason);
            return;
        } else {
            value = e.target ? e.target.value : e;
        }
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleApproveReject = (bool) => {
        let formDataObj = {
            ...formData,
            isApproved: bool,
            status: bool ? 'Closed' : 'Rejected',
        }
        if (bool) {
            updateTask(formDataObj, 'Closed');
        }
        setFormData(formDataObj);
    }

    const handleSelectChange = (field) => (value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    // gets the table data
    const fetchData = useCallback(async () => {
        setLoading(true);
        if (role == '') return
        let tableData = { data: [], "nextTaskId": [{ "next_task_id_number": 0 }] }
        if (selectedList == 'received') {
            // shows the list of tasks which are assigned to the logged in user
            const { data } = await getMyTaskList.get({
                limit: 10,
                pageNo: pageNo,
                pageName: pageName,
            });
            tableData = data;
            dispatch({
                type: "updateNotificationCount",
                data: data?.notificationCount[0].taskcount || 0,
            });
        }
        else if (selectedList == 'assigned') {
            // shows the list of tasks which are assigned by the logged in user to some other user
            const { data } = await getTaskList.get({
                limit: 10,
                pageNo: pageNo,
                pageName: pageName,
            });
            tableData = data;
            dispatch({
                type: "updateNotificationCount",
                data: data?.notificationCount[0].taskcount || 0,
            });
        }
        setData(tableData);
        setTaskID(tableData?.nextTaskId[0].next_task_id_number);
        setLoading(false);
        return tableData; //not needed
    }, [pageNo, role, selectedList]);

    // creates new task
    const CreateTask = async (obj) => {
        try {
            setLoading(true);
            obj.rejectionReason = []
            obj.assignee_response = []
            const res = await insertTaskList.get({
                ...obj,
                NextTaskID,
                pageName: pageName,
            })
            notification.success({
                message: res,
            });
            setCreateModalOpen(false);
            await fetchData()
        } catch (e) {
            console.log(e)
        } finally {
            setReason('');
            setaResponse('');
            setLoading(false)
        }
    }

    const deleteTask = async () => {
        try {
            setLoading(true);
            const data = {
                id: selectedId,
                pageName: pageName,
            };
            const res = await deleteTaskList.put(data);
            notification.success({
                message: res,
            });
            await fetchData()
        } catch (e) {
            console.log(e)
        } finally {
            // closing all the modals
            setIsDeleteModalOpen(false);
            setisModalOpen(false);
            setCreateModalOpen(false);
            setisEditModalOpen(false);
            setisAssigntModalOpen(false);
            setLoading(false)
        }
    }

    const updateTask = async (obj, status) => {
        try {
            setLoading(true);
            upload();
            if (reason !== '')
                obj.rejectionReason = [...formData.rejectionReason, { time: new Date(), reason }]
            if (aResponse !== '')
                obj.assignee_response = [...formData.assignee_response, { time: new Date(), reason: aResponse }]
            obj.status = status;
            const res = await updateTaskList.put({
                ...obj,
                pageName: pageName,
            })
            notification.success({
                message: res,
            });
            await fetchData()
        } catch (e) {
            console.log(e)
        } finally {
            setReason('');
            setaResponse('');
            setLoading(false);
            // closing all the modals
            setisModalOpen(false);
            setisEditModalOpen(false)
            setisAssigntModalOpen(false)
        }
    }
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState([]);

    const handleChange = (e) => {
        setFiles(Array.from(e.target.files));
        // setStatus([]);
    };

    const upload = async () => {
        const newStatus = [];

        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
                newStatus.push({ name: file.name, result: 'Too large (max 5MB)' });
                continue;
            }
            const base64 = await convertToBase64(file);

            try {
                const res = await api.post('/task/upload', {
                    file: base64,
                    filename: file.name,
                    filetype: file.type,
                    taskName: formData.task,
                    user_email: localStorage.getItem("emailToken") || "NA",
                    user_name: localStorage.getItem("Data_API_name") || "NA",
                    persona: localStorage.getItem("user_persona") || "NA",
                    role: localStorage.getItem("user_role") || "NA",
                    user_source_persona: localStorage.getItem("user_source_persona") || "NA",
                    user_vertical: localStorage.getItem("Data_API_vertical") || "NA",
                    user_department: localStorage.getItem("Data_API_department_code") || "NA",
                    user_division: localStorage.getItem("Data_API_division_code") || "NA",
                    pageName,
                });

                if (res.status === 200) {
                    newStatus.push({ name: file.name, result: 'Upload successful' });
                } else {
                    newStatus.push({ name: file.name, result: 'Upload failed' });
                }
            } catch (err) {
                console.error(`Upload error for ${file.name}:`, err);
                newStatus.push({ name: file.name, result: 'Upload error' });
            } finally {
                setFiles([])
            }
        }

        // setStatus(newStatus);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
        });
    };
    const priorityList = [
        {
            key: 'High',
            label: 'High',
        },
        {
            key: 'Medium',
            label: 'Medium',
        },
        {
            key: 'Low',
            label: 'Low',
        },
    ];
    const menu = (
        <Menu>
            {
                priorityList.map(d => <Menu.Item key={d.key} onClick={() => handleSelectChange('priority')(d.key)}>{d.label}</Menu.Item>)
            }
        </Menu>
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChangePage = (event, newPage) => {
        setPageNo(event);
    };

    const itemRender = (_, type, originalElement) => {
        if (type === "prev") {
            return (
                <div>
                    <KeyboardArrowLeftOutlined size="small" />
                </div>
            );
        }
        if (type === "next") {
            return (
                <div>
                    <KeyboardArrowRightOutlined size="small" />
                </div>
            );
        }
        return originalElement;
    };
    const currentPath = window.location.href;
    const isTaskPage = currentPath.includes('task');
    const CustomTypography = styled(withTheme("h6"))((props) => ({
        ...props,
        color: props.theme.prefersDarkMode ? "#FFFFFF" : "#202A5D",
        fontWeight: 600,
        margin: 0,
        // marginTop: "10px !important",
        // padding: "10px 10px",
    }));
    return (
        <div
            className="tasklist-container"
            style={{
                backgroundColor: ThemeState === "dark" ? "#1B1E23" : "#F8F8F8",
                paddingTop: isTaskPage ? "80px" : "0px"
            }
            }
        >
            <div style={{ position: "relative" }}>
                <div>
                    {loading ? (
                        <CircularIndeterminate />
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {/* Add Task/User Button visible only for super admins */}
                            {<div className="header-container">
                                <div className="title-container">
                                    <CustomTypography>Task List</CustomTypography>
                                    <Select
                                        labelId="dropdown-label"
                                        value={selectedList}
                                        onChange={e => setSelectedList(e.target.value)}
                                        placeholder="Select an option"
                                        style={{ width: 'auto', minWidth: '100px' }}
                                    >
                                        <MenuItem value="assigned">Task Assigned</MenuItem>
                                        <MenuItem value="received">Task Received</MenuItem>
                                    </Select>
                                    <Tooltip
                                        title={selectedList == 'assigned' ? <span>
                                            List of tasks which are assigned by the logged in user
                                        </span> : <span> List of tasks which are assigned to the logged in user</span>}
                                        arrow
                                        placement="top"
                                    >
                                        <InfoIcon sx={{ color: 'grey.600', cursor: 'pointer' }} />
                                    </Tooltip>
                                </div>
                                {(role === "super_admin" || role === "admin") && <Button
                                    className="add_button"
                                    // style={{marginTop: '10px'}}
                                    onClick={() => {
                                        setFormData({
                                            task: '',
                                            description: '',
                                            deadline: '',
                                            priority: '',
                                            assigned_to: '',
                                            assignee_response: [],
                                            isApproved: null,
                                            rejectionReason: [],
                                            status: 'Pending',
                                        });
                                        setCreateModalOpen(true);
                                    }}
                                >
                                    <img
                                        src={AddIcon}
                                        width={15}
                                        style={{ marginRight: "7px" }}
                                        alt="add"
                                    />
                                    ADD TASK
                                </Button>}
                            </div>}
                            {/* Table */}
                            <div className="table"
                                style={{ margin: '16px 0px' }}
                            >
                                <Table
                                    dataSource={Data?.data}
                                    columns={columns}
                                    pagination={false}
                                    className={`user-table-${ThemeState}`}
                                />
                            </div>
                            {/* Pagination */}
                            <div style={{ textAlign: "right" }}>
                                <Pagination
                                    current={pageNo}
                                    total={Data?.count}
                                    page={pageNo}
                                    size={rowsPerPage}
                                    showSizeChanger={false}
                                    onChange={handleChangePage}
                                    itemRender={itemRender}
                                    className={`comments-pagination-${ThemeState}`}
                                />
                            </div>
                            {/* modals */}
                            <div>
                                {/* ------------------- Assignee Response Modal --------------- */}
                                {(
                                    <Modal
                                        title="Edit Task"
                                        open={isAssigntModalOpen}
                                        onCancel={() => setisAssigntModalOpen(false)}
                                        footer={null}
                                        className="usertablemodal"
                                    >
                                        <div style={{ padding: '2rem' }}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    minHeight: '250px',
                                                    justifyContent: 'space-between',
                                                    gap: '1rem',
                                                }}
                                            >
                                                {/* Task Field */}
                                                <div>
                                                    <label>Task Name</label>
                                                    <Input
                                                        value={formData.task}
                                                        disabled={true}
                                                        style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9' }}
                                                    />
                                                </div>

                                                {/* Description Field */}
                                                <div>
                                                    <label>Description</label>
                                                    <TextArea
                                                        value={formData.description}
                                                        disabled={true}
                                                        style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9' }}
                                                        rows={4}
                                                    />
                                                </div>

                                                {/* DatePicker and Priority Side-by-Side */}
                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                    {/* Deadline */}
                                                    <div style={{ flex: 1 }}>
                                                        <label>Deadline</label>
                                                        <DatePicker
                                                            disabled={true}
                                                            value={formData.deadline}
                                                            style={{
                                                                width: '100%',
                                                                height: 40,
                                                                backgroundColor: '#f5f5f5',
                                                                borderRadius: '6px',
                                                                border: '1px solid #d9d9d9',
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Priority */}
                                                    <div style={{ flex: 1 }}>
                                                        <label>Priority</label>
                                                        <div
                                                            style={{
                                                                backgroundColor: '#f5f5f5',
                                                                border: '1px solid #d9d9d9',
                                                                borderRadius: '6px',
                                                                height: 40,
                                                                padding: '0 11px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <Dropdown overlay={menu} placement="bottomLeft">
                                                                <Button
                                                                    type="text"
                                                                    style={{
                                                                        width: '100%',
                                                                        textAlign: 'left',
                                                                        padding: 0,
                                                                        height: '100%',
                                                                        lineHeight: 'normal',
                                                                    }}
                                                                >
                                                                    {formData.priority || 'Select Priority'}
                                                                </Button>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h7 style={{ paddingLeft: '0px' }}>Attached files</h7>
                                                    <div id="file-list-assign">Loading files...</div>
                                                </div>
                                                {/* Upload */}
                                                {formData.status !== 'Closed' && (
                                                    <div>
                                                        <label>Upload Document (Max 5MB)</label>
                                                        <input type="file" multiple onChange={handleChange} />
                                                    </div>
                                                )}

                                                {/* Rejection Reason History */}
                                                {formData.rejectionReason?.length > 0 && (
                                                    <div>
                                                        <h7 style={{ paddingLeft: '0px' }}>Rejection Reasons</h7>
                                                        <ul
                                                            style={{
                                                                maxHeight: '120px',
                                                                overflowY: 'auto',
                                                                padding: '0.5rem',
                                                                border: '1px solid #ccc',
                                                                borderRadius: '4px',
                                                                listStyle: 'none',
                                                                margin: 0,
                                                            }}
                                                        >
                                                            {formData.rejectionReason.map((r, index) => {
                                                                return r.reason && <li
                                                                    key={index}
                                                                    style={{
                                                                        display: 'flex',
                                                                        gap: '0.5rem',
                                                                        marginBottom: '0.5rem',
                                                                        backgroundColor: '#f1f1f1',
                                                                        padding: '5px',
                                                                        borderRadius: '5px',
                                                                    }}
                                                                >
                                                                    <div>{moment(r.time).format('YYYY/MM/DD HH:mm')}</div>
                                                                    <div>{r.reason}</div>
                                                                </li>
                                                            })}
                                                        </ul>
                                                    </div>
                                                )}
                                                {formData.assignee_response?.length > 0 && (
                                                    <div>
                                                        <h7 style={{ paddingLeft: '0px' }}>Responses</h7>
                                                        <ul
                                                            style={{
                                                                maxHeight: '120px',
                                                                overflowY: 'auto',
                                                                padding: '0.5rem',
                                                                border: '1px solid #ccc',
                                                                borderRadius: '4px',
                                                                listStyle: 'none',
                                                                margin: 0,
                                                            }}
                                                        >
                                                            {formData.assignee_response.map((r, index) => {
                                                                return r.reason && <li
                                                                    key={index}
                                                                    style={{
                                                                        display: 'flex',
                                                                        gap: '0.5rem',
                                                                        marginBottom: '0.5rem',
                                                                        backgroundColor: '#f1f1f1',
                                                                        padding: '5px',
                                                                        borderRadius: '5px',
                                                                    }}
                                                                >
                                                                    <div>{moment(r.time).format('YYYY/MM/DD HH:mm')}</div>
                                                                    <div>{r.reason}</div>
                                                                </li>
                                                            })}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Assignee response */}
                                                <div>
                                                    <label>Response</label>
                                                    <TextArea
                                                        onChange={handleInputChange('assignee_response')}
                                                        // value={formData.assignee_response}
                                                        style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9' }}
                                                        rows={4}
                                                    />
                                                </div>

                                                {/* Action Buttons */}
                                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                    <Button
                                                        type="primary"
                                                        style={{ width: '100%', backgroundColor: '#4472c4', borderColor: '#4472c4' }}
                                                        onClick={() => {
                                                            // console.log(formData);
                                                            updateTask(formData, 'In Review');
                                                        }}
                                                    >
                                                        Submit
                                                    </Button>

                                                    {selectedList == 'assigned' && <Button
                                                        type="primary"
                                                        style={{ width: '100%', backgroundColor: '#4472c4', borderColor: '#4472c4' }}
                                                        onClick={() => {
                                                            setIsDeleteModalOpen(true);
                                                            setSelectedId(formData.id);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>}
                                                </div>
                                            </div>
                                        </div>
                                    </Modal>
                                )}
                            </div>

                            <div>
                                {/* -------------------assignee response modal--------------- */}
                                {<Modal
                                    title={`Edit Task`}
                                    open={isEditModalOpen}
                                    onCancel={() => { setReason(''); setisEditModalOpen(false) }}
                                    footer={null}
                                    className="usertablemodal"
                                >
                                    <div style={{ padding: '2rem' }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                minHeight: '250px',
                                                justifyContent: 'space-between',
                                                gap: '1rem',
                                            }}
                                        >
                                            {/* Task Field */}
                                            <div>
                                                <label>Task Name</label>
                                                <Input
                                                    value={formData.task}
                                                    disabled='true'
                                                    onChange={handleInputChange('task')}
                                                    style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9' }}
                                                />
                                            </div>

                                            {/* Description Field */}
                                            <div>
                                                <label>Description</label>
                                                <TextArea
                                                    value={formData.description}
                                                    onChange={handleInputChange('description')}
                                                    style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9' }}
                                                    rows={4}
                                                />
                                            </div>

                                            {/* DatePicker and Priority Side-by-Side */}
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                {/* Deadline */}
                                                <div style={{ flex: 1 }}>
                                                    <label>Deadline</label>
                                                    <DatePicker
                                                        value={formData.deadline}
                                                        onChange={(date, dateString) => handleSelectChange('deadline')(dateString)}
                                                        style={{
                                                            width: '100%',
                                                            height: 40,
                                                            backgroundColor: '#f5f5f5',
                                                            borderRadius: '6px',
                                                            border: '1px solid #d9d9d9',
                                                        }}
                                                    />
                                                </div>

                                                {/* Priority */}
                                                <div style={{ flex: 1 }}>
                                                    <label>Priority</label>
                                                    <div
                                                        style={{
                                                            backgroundColor: '#f5f5f5',
                                                            border: '1px solid #d9d9d9',
                                                            borderRadius: '6px',
                                                            height: 40,
                                                            padding: '0 11px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Dropdown overlay={menu} placement="bottomLeft">
                                                            <Button
                                                                type="text"
                                                                style={{
                                                                    width: '100%',
                                                                    textAlign: 'left',
                                                                    padding: 0,
                                                                    height: '100%',
                                                                    lineHeight: 'normal',
                                                                }}
                                                            >
                                                                {formData.priority || 'Select Priority'}
                                                            </Button>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* {formData.status !== 'Closed' && <div>
                                                <label>Upload Document (Max 5MB)</label>
                                                <input type="file" multiple onChange={handleChange} />
                                            </div>} */}
                                            {/* Assignie response */}
                                            <div>
                                                <h7 style={{ paddingLeft: '0px' }}>Attached files</h7>
                                                <div id="file-list">Loading files...</div>
                                            </div>
                                            {formData.assignee_response?.length > 0 && (
                                                <div>
                                                    <h7 style={{ paddingLeft: '0px' }}>Responses</h7>
                                                    <ul
                                                        style={{
                                                            maxHeight: '120px',
                                                            overflowY: 'auto',
                                                            padding: '0.5rem',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            listStyle: 'none',
                                                            margin: 0,
                                                        }}
                                                    >
                                                        {formData.assignee_response.map((r, index) => {
                                                            return r.reason && <li
                                                                key={index}
                                                                style={{
                                                                    display: 'flex',
                                                                    gap: '0.5rem',
                                                                    marginBottom: '0.5rem',
                                                                    backgroundColor: '#f1f1f1',
                                                                    padding: '5px',
                                                                    borderRadius: '5px',
                                                                }}
                                                            >
                                                                <div>{moment(r.time).format('YYYY/MM/DD HH:mm')}</div>
                                                                <div>{r.reason}</div>
                                                            </li>
                                                        })}
                                                    </ul>
                                                </div>
                                            )}
                                            <div>
                                                {
                                                    formData['rejectionReason'].length > 0 && <div>
                                                        <h7 style={{ paddingLeft: '0px' }}>Rejection Reasons</h7>
                                                        <ul
                                                            style={{
                                                                maxHeight: '120px',         // Fixed height
                                                                overflowY: 'auto',          // Scroll if content exceeds height
                                                                padding: '0.5rem',
                                                                border: '1px solid #ccc',
                                                                borderRadius: '4px',
                                                                listStyle: 'none',
                                                                margin: 0,
                                                            }}>
                                                            {formData.rejectionReason.map((r, index) => {
                                                                return r.reason && <li
                                                                    key={index}
                                                                    style={{
                                                                        display: 'flex',
                                                                        gap: '0.5rem',
                                                                        marginBottom: '0.5rem',
                                                                        backgroundColor: '#f1f1f1',
                                                                        padding: '5px',
                                                                        borderRadius: '5px',
                                                                    }}
                                                                >
                                                                    <div>{moment(r.time).format("YYYY/MM/DD HH:mm")}</div>
                                                                    <div>{r.reason}</div>
                                                                </li>
                                                            }
                                                            )}
                                                        </ul>
                                                    </div>
                                                }
                                            </div>
                                            {
                                                (formData?.isApproved == false) && <div>
                                                    <label>Reason for Rejection</label>
                                                    <TextArea
                                                        onChange={handleInputChange('rejectionReason')}
                                                        style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9' }}
                                                        rows={4}
                                                    />
                                                </div>
                                            }
                                            {
                                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                    {reason == '' && <Button
                                                        type="primary"
                                                        style={{
                                                            width: '100%',
                                                            backgroundColor: '#4472c4',
                                                            borderColor: '#4472c4',
                                                        }}
                                                        onClick={() => {
                                                            // Handle create task logic
                                                            handleApproveReject(true)
                                                        }}
                                                    >
                                                        Approve
                                                    </Button>}
                                                    {reason == '' && <Button
                                                        type="primary"
                                                        style={{
                                                            width: '100%',
                                                            backgroundColor: '#4472c4',
                                                            borderColor: '#4472c4',
                                                        }}
                                                        onClick={() =>
                                                            handleApproveReject(false)
                                                        }
                                                    >
                                                        Reject
                                                    </Button>}
                                                    {reason !== '' && <Button
                                                        type="primary"
                                                        style={{
                                                            width: '100%',
                                                            backgroundColor: '#4472c4',
                                                            borderColor: '#4472c4',
                                                        }}
                                                        onClick={() => {
                                                            // Handle create task logic
                                                            // console.log(formData);
                                                            updateTask(formData, 'Rejected')
                                                        }}
                                                    >
                                                        Submit
                                                    </Button>
                                                    }
                                                    {/* only the one who assigns the task can delete it */}
                                                    {selectedList == 'assigned' && <Button
                                                        type="primary"
                                                        style={{
                                                            width: '100%',
                                                            backgroundColor: '#4472c4',
                                                            borderColor: '#4472c4',
                                                        }}
                                                        onClick={() => {
                                                            setIsDeleteModalOpen(true);
                                                            setSelectedId(formData.id);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>}
                                                </div>
                                            }
                                            {/* Action Buttons */}

                                        </div>
                                    </div>
                                </Modal>}
                            </div>
                            <div>
                                {/* ---------------------create modal------------------------- */}
                                <div>
                                    <Modal
                                        title={`Task#${NextTaskID}`}
                                        open={isCreateModalOpen}
                                        onCancel={() => setCreateModalOpen(false)}
                                        footer={null}
                                        className="usertablemodal"
                                    >
                                        <div style={{ padding: '2rem' }}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    minHeight: '250px',
                                                    justifyContent: 'space-between',
                                                    gap: '1rem',
                                                }}
                                            >
                                                {/* Task Field */}
                                                <div>
                                                    <label>Task</label>
                                                    <Input
                                                        value={formData.task}
                                                        onChange={handleInputChange('task')}
                                                        style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9' }}
                                                    />
                                                </div>

                                                {/* Description Field */}
                                                <div>
                                                    <label>Description</label>
                                                    <TextArea
                                                        value={formData.description}
                                                        onChange={handleInputChange('description')}
                                                        style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9' }}
                                                        rows={4}
                                                    />
                                                </div>

                                                {/* Team Member Field */}
                                                <div>
                                                    <label>Add Assignee</label>
                                                    <Input
                                                        value={formData.assigned_to}
                                                        onChange={handleInputChange('assigned_to')}
                                                        style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9' }}
                                                    />
                                                    {/* <Select
                                                    showSearch
                                                    value={formData.assigned_to}
                                                    onChange={handleSelectChange('assigned_to')}
                                                    placeholder="Type to search and add members"
                                                    className="filled-select"
                                                    style={{ width: '100%', height: 40 }}
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                    }
                                                >
                                                    <Option value="alice">Alice</Option>
                                                    <Option value="emma">Emma</Option>
                                                </Select> */}
                                                </div>

                                                {/* DatePicker and Priority Side-by-Side */}
                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                    {/* Deadline */}
                                                    <div style={{ flex: 1 }}>
                                                        <label>Deadline</label>
                                                        <DatePicker
                                                            value={formData.deadline} // should be a dayjs object
                                                            onChange={(date, dateString) => handleSelectChange('deadline')(date)} // store the actual date object
                                                            style={{
                                                                width: '100%',
                                                                height: 40,
                                                                backgroundColor: '#f5f5f5',
                                                                borderRadius: '6px',
                                                                border: '1px solid #d9d9d9',
                                                            }}
                                                        />

                                                    </div>

                                                    {/* Priority */}
                                                    <div style={{ flex: 1 }}>
                                                        <label>Priority</label>
                                                        <div
                                                            style={{
                                                                backgroundColor: '#f5f5f5',
                                                                border: '1px solid #d9d9d9',
                                                                borderRadius: '6px',
                                                                height: 40,
                                                                padding: '0 11px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <Dropdown overlay={menu} placement="bottomLeft">
                                                                <Button
                                                                    type="text"
                                                                    style={{
                                                                        width: '100%',
                                                                        textAlign: 'left',
                                                                        padding: 0,
                                                                        height: '100%',
                                                                        lineHeight: 'normal',
                                                                    }}
                                                                >
                                                                    {formData.priority || 'Select Priority'}
                                                                </Button>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                    <Button
                                                        type="primary"
                                                        style={{
                                                            width: '100%',
                                                            backgroundColor: '#4472c4',
                                                            borderColor: '#4472c4',
                                                        }}
                                                        onClick={() => {
                                                            // Handle create task logic
                                                            CreateTask(formData);
                                                        }}
                                                    >
                                                        Create Task
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        style={{
                                                            width: '100%',
                                                            backgroundColor: '#4472c4',
                                                            borderColor: '#4472c4',
                                                        }}
                                                        onClick={() => setCreateModalOpen(false)}
                                                    >
                                                        Discard Task
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                            <div>
                                {/* --------------normal info display modal------------------- */}
                                <Modal
                                    title={`View Task`}
                                    open={isModalOpen}
                                    onCancel={() => setisModalOpen(false)}
                                    footer={null}
                                    className="usertablemodal"
                                >
                                    <div style={{ padding: '2rem' }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                minHeight: '250px',
                                                justifyContent: 'space-between',
                                                gap: '1rem',
                                            }}
                                        >
                                            {/* Task Field */}
                                            <div>
                                                <label>Task Name</label>
                                                <Input
                                                    value={formData.task}
                                                    disabled='true'
                                                    onChange={handleInputChange('task')}
                                                    style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9' }}
                                                />
                                            </div>

                                            {/* Description Field */}
                                            <div>
                                                <label>Description</label>
                                                <TextArea
                                                    disabled='true'
                                                    value={formData.description}
                                                    onChange={handleInputChange('description')}
                                                    style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9' }}
                                                    rows={4}
                                                />
                                            </div>

                                            {/* DatePicker and Priority Side-by-Side */}
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                {/* Deadline */}
                                                <div style={{ flex: 1 }}>
                                                    <label>Deadline</label>
                                                    <DatePicker
                                                        value={formData.deadline}
                                                        disabled='true'
                                                        onChange={(date, dateString) => handleSelectChange('deadline')(dateString)}
                                                        style={{
                                                            width: '100%',
                                                            height: 40,
                                                            backgroundColor: '#f5f5f5',
                                                            borderRadius: '6px',
                                                            border: '1px solid #d9d9d9',
                                                        }}
                                                    />
                                                </div>

                                                {/* Priority */}
                                                <div style={{ flex: 1 }}>
                                                    <label>Priority</label>
                                                    <div
                                                        style={{
                                                            backgroundColor: '#f5f5f5',
                                                            border: '1px solid #d9d9d9',
                                                            borderRadius: '6px',
                                                            height: 40,
                                                            padding: '0 11px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Dropdown overlay={menu} disabled='true' placement="bottomLeft">
                                                            <Button
                                                                type="text"
                                                                style={{
                                                                    width: '100%',
                                                                    textAlign: 'left',
                                                                    padding: 0,
                                                                    height: '100%',
                                                                    lineHeight: 'normal',
                                                                }}
                                                            >
                                                                {formData.priority || 'Select Priority'}
                                                            </Button>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div>
                                                <label>Upload Document (Max 5MB)</label>
                                                <input type="file" multiple onChange={handleChange} />
                                                <Button
                                                        type="primary"
                                                        style={{
                                                            backgroundColor: '#4472C4',
                                                            borderColor: '#4472C4',
                                                        }}onClick={}>Upload</Button>
                                            </div> */}
                                            {/* attachment */}
                                            <div>
                                                <h7 style={{ paddingLeft: '0px' }}>Attached files</h7>
                                                <div id="file-list-received">Loading files...</div>
                                            </div>
                                            {/* Assignie response */}
                                            {formData.assignee_response?.length > 0 && (
                                                <div>
                                                    <h7 style={{ paddingLeft: '0px' }}>Responses</h7>
                                                    <ul
                                                        style={{
                                                            maxHeight: '120px',
                                                            overflowY: 'auto',
                                                            padding: '0.5rem',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            listStyle: 'none',
                                                            margin: 0,
                                                        }}
                                                    >
                                                        {formData.assignee_response.map((r, index) => {
                                                            return r.reason && <li
                                                                key={index}
                                                                style={{
                                                                    display: 'flex',
                                                                    gap: '0.5rem',
                                                                    marginBottom: '0.5rem',
                                                                    backgroundColor: '#f1f1f1',
                                                                    padding: '5px',
                                                                    borderRadius: '5px',
                                                                }}
                                                            >
                                                                <div>{moment(r.time).format('YYYY/MM/DD HH:mm')}</div>
                                                                <div>{r.reason}</div>
                                                            </li>
                                                        })}
                                                    </ul>
                                                </div>
                                            )}
                                            {/* <div>
                                                <label>Response</label>
                                                <TextArea
                                                    disabled={formData.status == 'Closed' || selectedList == 'assigned'}
                                                    value={formData.assignee_response}
                                                    onChange={handleInputChange('assignee_response')}
                                                    style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9' }}
                                                    rows={4}
                                                />
                                            </div> */}
                                            {/* Rejection Reason History */}
                                            {formData.rejectionReason?.length > 0 && (
                                                <div>
                                                    <h7 style={{ paddingLeft: '0px' }}>Rejection Reasons</h7>
                                                    <ul
                                                        style={{
                                                            maxHeight: '120px',
                                                            overflowY: 'auto',
                                                            padding: '0.5rem',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            listStyle: 'none',
                                                            margin: 0,
                                                        }}
                                                    >
                                                        {formData.rejectionReason.map((r, index) => {
                                                            return r.reason && <li
                                                                key={index}
                                                                style={{
                                                                    display: 'flex',
                                                                    gap: '0.5rem',
                                                                    marginBottom: '0.5rem',
                                                                    backgroundColor: '#f1f1f1',
                                                                    padding: '5px',
                                                                    borderRadius: '5px',
                                                                }}
                                                            >
                                                                <div>{moment(r.time).format('YYYY/MM/DD HH:mm')}</div>
                                                                <div>{r.reason}</div>
                                                            </li>
                                                        })}
                                                    </ul>
                                                </div>
                                            )}

                                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                {/* {formData.status !== 'Closed' && <Button
                                                    type="primary"
                                                    style={{
                                                        width: '100%',
                                                        backgroundColor: '#4472c4',
                                                        borderColor: '#4472c4',
                                                    }}
                                                    onClick={() => {
                                                        // Handle create task logic
                                                        // console.log(formData);
                                                        updateTask(formData, 'Pending')
                                                    }}
                                                >
                                                    Submit
                                                </Button>} */}
                                                {/* only the one who assigns the task can delete it */}
                                                {selectedList == 'assigned' && <Button
                                                    type="primary"
                                                    style={{
                                                        width: '100%',
                                                        backgroundColor: '#4472c4',
                                                        borderColor: '#4472c4',
                                                    }}
                                                    onClick={() => {
                                                        setIsDeleteModalOpen(true);
                                                        setSelectedId(formData.id);
                                                    }}
                                                >
                                                    Delete
                                                </Button>}
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                                {showPlanReq && <UpgradeRequestForm
                                    mode="view"
                                    title="Upgrade Request"
                                    plan={formData.plan}
                                    requester={formData.assigned_by}
                                    justification={formData.description}
                                    comment={formData.assignee_response}
                                   
                                    attachment=""
                                    onClose={() => setShowPlanReq(false)}
                                    showClose={true}
                                    onSubmit={() => handleApproveReject(true)}
                                    onDiscard={() => handleApproveReject(false)}
                                />}

                            </div>
                            <div>
                                <Modal
                                    title="Confirm Delete"
                                    open={isDeleteModalOpen}
                                    onOk={() => {
                                        deleteTask();
                                    }}
                                    onCancel={() => setIsDeleteModalOpen(false)}
                                    okText="Yes"
                                    cancelText="No"
                                    okButtonProps={{ danger: true }}
                                    centered
                                >
                                    <div>
                                        <p>Are you sure you want to delete this task?</p>
                                    </div>
                                </Modal>
                            </div>
                        </div>

                    )}



                </div>
            </div>
        </div >
    );
}
