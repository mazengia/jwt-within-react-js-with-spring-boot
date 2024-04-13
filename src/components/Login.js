import React, {useState} from 'react';
import {Button, Form, Input} from 'antd';
import AuthService from "../auth/AuthService ";

const Login = () => {
    const [error, setError] = useState(false);

    const onFinish = (values) => {
        AuthService.login(values)
            .then(() => {
                window.location.reload();
            })
            .catch(error => {
                setError(true);
                console.error("Login Error:", error);
                // Handle login error
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor:"black"
            }}
        >
            <Form name="basic"
                  wrapperCol={{span: 32}}
                  style={{maxWidth: 900,width: 300}}
                  initialValues={{remember: true}}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
            >
                <div style={{marginBottom: 90,marginLeft:40}}>
                    <h3 style={{color: 'white'}}>HR SYSTEM</h3>
                </div>
                <Form.Item
                    name="username"
                    rules={[{required: true, message: 'Please input your username!'}]}
                >
                    <Input placeholder={'User Name'}/>
                </Form.Item>
                <br/>
                <Form.Item
                    name="password"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input.Password placeholder={'Password ***'}/>
                </Form.Item>
                {error && (
                    <div style={{width: 300, alignItems: "center", marginBottom: 15}}>
                        <label style={{color: 'red'}}>Invalid username or password!. Please try again</label>
                    </div>
                )}
                <Form.Item wrapperCol={{offset: 4, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
