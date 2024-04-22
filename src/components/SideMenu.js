import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Menu} from "antd";
import {AppstoreOutlined, MenuUnfoldOutlined, UserOutlined} from "@ant-design/icons";
import AuthService from "../auth/AuthService ";

const isLoggedIn = AuthService.getCurrentUser();
const listOfRoles = isLoggedIn?.roles[0];

const ListOfItems = [


        getItem('Collapse', 'Collapse', <MenuUnfoldOutlined/>),
        getItem('Users', 'Users', <UserOutlined/>),
        getItem('Traffics', 'Traffics', <UserOutlined/>),
        getItem('Course', 'Course', <UserOutlined/>),
        getItem('Navigation Two', 'sub2', <AppstoreOutlined/>, [
            getItem('Option 9', '9'),
            getItem('Option 10', '10')], 'horizontal'),
    ]
;
// if (listOfRoles == "ROLE_ADMINy") {
//     ListOfItems.push(getItem('Users', 'Users', <UserOutlined/>))
// }

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
    let [collapsed, setCollapsed, width] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
        if (!collapsed) {
            width = 56;
        } else {
            width = 200;
        }
    };
    const navigate = useNavigate();
    return (
        <div
            style={{
                width: width,
                display: "flex",
                flexDirection: "column",
            }}>
            <Menu
                style={{height: '100%'}}
                onClick={({key}) => {
                    if (key === "Collapse") {
                        toggleCollapsed(key);
                    } else {
                        navigate(key)
                    }
                }}
                defaultSelectedKeys={['1']}
                theme="dark"
                inlineCollapsed={collapsed}
                items={ListOfItems}
            />
        </div>);
}

export default SideMenu;