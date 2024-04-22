import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Drawer, Form, Input, notification, Row, Table} from "antd";
import axiosInstance from "../auth/authHeader";

const Users = () => {
    const [data, setData] = useState([]);
    const [dataById, setDataById] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addNewMode, setAddNewMode] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const apiUrl = "http://localhost:8080";
    // const apiUrl = process.env.REACT_APP_API_URL;

    const openNotificationWithIcon = (type, messageTitle, description) => {
        api[type]({
            message: messageTitle,
            description: description,
        });
    };
    const getAllData = () => {
        axiosInstance.get(apiUrl + "/course")
            .then(response => {
                    setData(response?.data?._embedded?.coursesDTOes);
                    setLoading(false);
                },
                error => {
                    setLoading(false);
                    openNotificationWithIcon('error', 'Error', error?.message)
                }
            );
    };

    const getDataById = (id) => {
        axiosInstance.get(apiUrl + "/course/" + id)
            .then(response => {
                    setDataById(response?.data);
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                }
            );
    };

    const deleteById = (id) => {
        axiosInstance.delete(apiUrl + "/course/" + id)
            .then(response => {
                    api.open({
                        message: 'Success',
                        description: 'Data Is deleted successfully.'
                    });
                    getAllData();
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                }
            );
    };

    const addNewRecord = (values) => {
        axiosInstance.post(apiUrl + "/course", values)
            .then(response => {
                    api.open({
                        message: 'Success',
                        description: 'New Recorded Is added successfully.'
                    });
                    getAllData();
                    setOpen(false);
                    setDataById(null);
                },
                error => {
                    console.log("Error=", error)
                    openNotificationWithIcon('error', 'Error', error?.message)
                }
            );
    };
    const updateRecordById = (data, id) => {
        axiosInstance.put(apiUrl + "/course/" + id, data)
            .then(response => {
                    api.open({
                        message: 'Success',
                        description: 'Data Is updated successfully.'
                    });
                    getAllData();
                    setOpen(false);
                    setDataById(null);
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };
    const showDrawer = (id) => {
        setOpen(true);
        if (id === undefined) {
            setAddNewMode(true);
        } else {
            setDataById(null);
            getDataById(id);
            setAddNewMode(false);
        }
    };

    const onSubmitClick = (values) => {
        if (addNewMode) {
            addNewRecord(values);
        } else {
            updateRecordById(values, dataById.id);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        getAllData();
    } );

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'creditHour',
            dataIndex: 'creditHour',
            key: 'creditHour',
        },
        {
            title: 'ects',
            dataIndex: 'ects',
            key: 'ects',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                    <a onClick={() => showDrawer(record.id)}>Update</a>
                    {/* eslint-enable jsx-a11y/anchor-is-valid */}
                    <Divider type="vertical"/>
                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                    <a onClick={() => deleteById(record.id)}>Delete</a>
                    {/* eslint-enable jsx-a11y/anchor-is-valid */}
                </span>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            <Row justify="end" style={{marginBottom: 16}}>
                <Col>
                    <Button onClick={() => showDrawer(undefined)}>Add New Record</Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table loading={loading} columns={columns} dataSource={data} rowKey="id"/>
                </Col>
            </Row>
            <Drawer
                title="Basic Drawer"
                placement="right"
                onClose={() => setOpen(false)}
                visible={open}
            >
                {(addNewMode || dataById) && (
                    <Form
                        layout="vertical"
                        initialValues={dataById}
                        onFinish={onSubmitClick}
                        onFinishFailed={onFinishFailed}
                    >


                        <Form.Item
                            label="Id"
                            name="id"
                            rules={[{required: true, message: 'Please input first name!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{required: true, message: 'Please input last name!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Code"
                            name="code"
                            rules={[{required: true, message: 'Please input email!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="CreditHour"
                            name="creditHour"
                            rules={[{required: true, message: 'Please input username!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="ects"
                            name="ects"
                            rules={[{required: true, message: 'Please input username!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                )}
            </Drawer>
        </>
    );
};

export default Users;
