import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Drawer, Form, Input, notification, Row, Select, Table} from "antd";
import axiosInstance from "../auth/authHeader";

const Users = () => {
    const [data, setData] = useState([]);
    const [role, setRole] = useState([]);
    const [dataById, setDataById] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addNewMode, setAddNewMode] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const API_URL = process.env.REACT_APP_API_URL;
    const [form] = Form.useForm();

    const SubmitButton = ({form, children}) => {
        const [submittable, setSubmittable] = React.useState(false);
        const values = Form.useWatch([], form);
        React.useEffect(() => {
            form
                .validateFields({
                    validateOnly: true,
                })
                .then(() => setSubmittable(true))
                .catch(() => setSubmittable(false));
        }, [form, values]);

        return (
            <Button type="primary" htmlType="submit" disabled={!submittable}>
                {children}
            </Button>
        );
    };

    const getAllData = () => {
        axiosInstance.get(API_URL + "/users")
            .then(response => {
                    setData(response?.data?._embedded?.userDtoes);
                    setLoading(false);
                },
                error => {
                    setLoading(false);
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };
    const getAllRoles = () => {
        axiosInstance.get(API_URL + "/role")
            .then(response => {
                    console.log("response", response)
                    const roles = response?.data?._embedded?.rolesDTOes;
                    setRole(roles);
                },

                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };
    const getDataById = (id) => {
        axiosInstance.get(API_URL + "/users/" + id)
            .then(response => {
                    setDataById(response?.data);
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };
    const openNotificationWithIcon = (type, messageTitle, description) => {
        api[type]({
            message: messageTitle,
            description: description,
        });
    };
    const deleteById = (id) => {
        axiosInstance.delete(API_URL + "/users/" + id)
            .then(response => {
                    openNotificationWithIcon('success', 'Success', 'Data Is deleted successfully.')
                    getAllData();
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                })

    };

    const addNewRecord = (values) => {

        let updatedRole = values.role.id.map((item, index) => {
            return { "id": item };
        });
        values.role=updatedRole
console.log("values.role=",updatedRole)
        console.log("values=", values)
        // const roleArray = JSON.parse(values.role).id.map(id => ({ id }));

        // console.log(roleArray);
        // const roleObj = {id: 1};
        // const roles = [roleObj];
        // const newData = {...values, role: roles};
        axiosInstance.post(API_URL + "/users/signup", values)
            .then(response => {
                openNotificationWithIcon('success', 'Success', 'New Recorded Is added successfully.')
                getAllData();
                setOpen(false);
                setDataById(null);
            }, error => {
                openNotificationWithIcon('error', 'Error'
                    , error?.response?.data?.apierror?.message
                    + " " + error?.response?.data?.apierror?.subErrors[0]?.field + " " + error?.response?.data?.apierror?.subErrors[0]?.message)
            })
    };
    const updateRecordById = (data, id) => {
        axiosInstance.put(API_URL + "/users/" + id, data)
            .then(response => {
                    openNotificationWithIcon('success', 'Success', 'Data Is updated successfully.')
                    getAllData();
                    setOpen(false);
                    setDataById(null);
                }
                , error => {
                    openNotificationWithIcon('error', 'Error'
                        , error?.response?.data?.apierror?.message
                        + " " + error?.response?.data?.apierror?.subErrors[0]?.field + " " + error?.response?.data?.apierror?.subErrors[0]?.message)

                }
            );
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
        getAllRoles();
    }, []); // empty dependency array means this effect runs only once, similar to componentDidMount


    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                    <a href="#" onClick={() => showDrawer(record.id)}>Update</a>
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
                        form={form} name="validateOnly"
                        layout="vertical"
                        initialValues={dataById}
                        onFinish={onSubmitClick}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label="First Name"
                            name="firstName"
                            rules={[{required: true, message: 'Please input first name!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Last Name"
                            name="lastName"
                            rules={[{required: true, message: 'Please input last name!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{required: true, message: 'Please input email!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{required: true, message: 'Please input username!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{required: true, message: 'Please input username!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Role"
                            name={["role", "id"]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Please select"
                                options={role.map(role => ({ label: role.name, value: role.id }))}
                            />
                        </Form.Item>
                        <Form.Item>
                            {/*<Button type="primary" htmlType="submit" form={form}>Submit</Button>*/}
                            <SubmitButton form={form}>Submit</SubmitButton>
                        </Form.Item>
                    </Form>
                )}
            </Drawer>
        </>
    );
};

export default Users;
