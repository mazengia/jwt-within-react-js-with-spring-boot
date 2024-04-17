import React from 'react';
import {CaretDownOutlined, LogoutOutlined, UserOutlined} from '@ant-design/icons';
import AuthService from "../auth/AuthService ";
import {Button, Dropdown, Menu} from "antd";

const Header = () => {
    const isLoggedIn = AuthService.getCurrentUser();
    const handleLogout = () => {
        AuthService.logout();
    };

    const menu = (
        <Menu style={{
            width: 90,
            marginLeft: 130,
            backgroundColor: 'blue'
        }}>
            <hr/>
            <a style={{
                color: "orangered",
                fontWeight: "bold",
                fontSize: 15
            }}
               onClick={handleLogout}>
                <LogoutOutlined/> Logout
            </a>
            <hr/>
        </Menu>
    );

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: 60,
                backgroundColor: "blue"
            }}
        >
            <div></div>
            <Dropdown overlay={menu} trigger={['click']}>
                <Button type="text" style={{color: 'white', fontWeight: "bold", fontSize: 20}}>
                    <UserOutlined/> {isLoggedIn ? `${isLoggedIn.firstName} ${isLoggedIn.lastName}` : 'Guest'}
                    <CaretDownOutlined/>
                </Button>
            </Dropdown>
        </div>

    );
};

export default Header;

