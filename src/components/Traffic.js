import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Drawer, Form, Input, notification, Row, Table} from "antd";
import axiosInstance from "../auth/authHeader";

const Traffics = () => {
    const [data, setData] = useState([]);
    const [dataById, setDataById] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addNewMode, setAddNewMode] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const API_URL = process.env.REACT_APP_API_URL;
    const [trForm] = Form.useForm();

    const SubmitButton = ({form: trafficForm, children}) => {
        const [submittable, setSubmittable] = React.useState(false);
        const values = Form.useWatch([], trafficForm);
        React.useEffect(() => {
            trafficForm.validateFields({
                validateOnly: true,
            })
                .then(() => setSubmittable(true))
                .catch(() => setSubmittable(false));
        }, [trafficForm, values]);

        return (
            <Button type="primary" htmlType="submit" disabled={!submittable}>
                {children}
            </Button>
        );
    };

    const getAllData = () => {
        axiosInstance.get(API_URL + "/traffics")
            .then(response => {
                    setData(response?.data?._embedded?.trafficDtoses);
                    setLoading(false);
                },
                error => {
                    setLoading(false);
                    openNotificationWithIcon('error', 'Error', error?.message)
                });
    };
    const getDataById = (id) => {
        axiosInstance.get(API_URL + "/traffics/" + id)
            .then(response => {
                    setDataById(response.data)
                    trForm.setFieldsValue(response.data);
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
        axiosInstance.delete(API_URL + "/traffics/" + id)
            .then(response => {
                    openNotificationWithIcon('success', 'Success', 'Data Is deleted successfully.')
                    getAllData();
                },
                error => {
                    openNotificationWithIcon('error', 'Error', error?.message)
                })

    };

    const addNewRecord = (values) => {

        axiosInstance.post(API_URL + "/traffics", values)
            .then(response => {
                openNotificationWithIcon('success', 'Success', 'New Recorded Is added successfully.')
                getAllData();
                setOpen(false);
                setDataById(null);
            }, error => {
                if (error?.response?.data?.apierror?.subErrors?.length > 0) {
                    openNotificationWithIcon('error', 'Error '
                        , error?.response?.data?.apierror?.message
                        + " " + error?.response?.data?.apierror?.subErrors[0]?.field + " " + error?.response?.data?.apierror?.subErrors[0]?.message)
                } else {
                    openNotificationWithIcon('error',
                        'Error ~' + error?.response?.data?.apierror?.status
                        , error?.response?.data?.apierror?.message)
                }
            })
    };
    const updateRecordById = (data, id) => {
        axiosInstance.put(API_URL + "/traffics/" + id, data)
            .then(response => {
                    openNotificationWithIcon('success', 'Success', 'Data Is updated successfully.')
                    getAllData();
                    setOpen(false);
                    setDataById(null);
                }
                , error => {
                    if (error?.response?.data?.apierror?.subErrors?.length > 0) {
                        openNotificationWithIcon('error', 'Error '
                            , error?.response?.data?.apierror?.message
                            + " " + error?.response?.data?.apierror?.subErrors[0]?.field + " " + error?.response?.data?.apierror?.subErrors[0]?.message)
                    } else {
                        openNotificationWithIcon('error',
                            'Error ~' + error?.response?.data?.apierror?.status
                            , error?.response?.data?.apierror?.message)
                    }
                }
            );
    };
    const showDrawer = (id) => {
        setDataById(null);
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
    }, []); // empty dependency array means this effect runs only once, similar to componentDidMount


    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'At 8 O\'clock',
            dataIndex: 'eightTime',
            key: 'eightTime',
        },
        {
            title: 'eightTimeTraffic',
            dataIndex: 'eightTimeTraffic',
            key: 'eightTimeTraffic',
        },
        {
            title: 'At 14 O\'clock',
            dataIndex: 'fortiethTime',
            key: 'fortiethTime',
        },
        {
            title: 'fortiethTimeTraffic',
            dataIndex: 'fortiethTimeTraffic',
            key: 'fortiethTimeTraffic',
        },
        {
            title: 'At 18 O\'clock',
            dataIndex: 'eighteenTime',
            key: 'eighteenTime',
        },
        {
            title: 'eighteenTimeTraffic',
            dataIndex: 'eighteenTimeTraffic',
            key: 'eighteenTimeTraffic',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        }, {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
        }, {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
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
                    <Button onClick={() => showDrawer(undefined)}>Add New Traffic</Button>
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
                        form={trForm} name="validateOnly"
                        layout="vertical"
                        onFinish={onSubmitClick}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label="eightTimeTraffic"
                            name="eightTimeTraffic"
                            rules={[{required: true, message: 'Please input last name!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="fortiethTimeTraffic"
                            name="fortiethTimeTraffic"
                            rules={[{required: true, message: 'Please input username!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="eighteenTimeTraffic"
                            name="eighteenTimeTraffic"
                            rules={[{required: true, message: 'Please input username!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="description"
                            name="description"
                            rules={[{required: true, message: 'Please input username!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item>
                            {/*<Button type="primary" htmlType="submit" form={form}>Submit</Button>*/}
                            <SubmitButton form={trForm}>Submit</SubmitButton>
                        </Form.Item>
                    </Form>
                )}
            </Drawer>
        </>
    );
};

export default Traffics;
