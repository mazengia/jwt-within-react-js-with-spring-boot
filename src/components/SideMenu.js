import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { AppstoreOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import AuthService from "../auth/AuthService ";

const listOfRoles = AuthService?.getRoles();

const ListOfItems = [
    getItem('Collapse', 'Collapse', <MenuUnfoldOutlined />)
];

if (listOfRoles && listOfRoles.includes('ROLE_ADMIN')) {
    ListOfItems.push(getItem('Users', 'Users', <UserOutlined />));
}

ListOfItems.push(
    getItem('Traffics', 'Traffics', <UserOutlined />),
    getItem('Course', 'Course', <UserOutlined />),
    getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
        getItem('Option 9', '9'),
        getItem('Option 10', '10')
    ], 'horizontal')
);

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

function SideMenu() {
    const [collapsed, setCollapsed] = useState(false);
    const [width, setWidth] = useState(200); // Initialize width with 200

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
        setWidth(collapsed ? 200 : 56); // Adjust width based on collapse state
    };

    const navigate = useNavigate();

    return (
        <div
            style={{
                width: width,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Menu
                style={{ height: '100%' }}
                onClick={({ key }) => {
                    if (key === "Collapse") {
                        toggleCollapsed(key);
                    } else {
                        navigate(key);
                    }
                }}
                defaultSelectedKeys={['1']}
                theme="dark"
                inlineCollapsed={collapsed}
                items={ListOfItems}
            />
        </div>
    );
}

export default SideMenu;
