import {Route, Routes} from "react-router-dom";
import Users from "./Users";
import Course from "./Course";
import React from "react";
import Traffic from "./Traffic";
import AuthService from "../auth/AuthService ";
import {UserOutlined} from "@ant-design/icons";

const listOfRoles = AuthService?.getRoles();
function Content() {
    return (<div
        style={{
            width: '100%',
            margin: '10px'
        }}
    >
        <Routes>
            {listOfRoles && listOfRoles.includes("ROLE_ADcMIN") && (
                <Route path="/users" element={<Users />} />
            )}
            <Route path="/traffics" element={<Traffic/>}></Route>
            <Route path="/Course" element={<Course/>}></Route>
            <Route path="/" element={<Traffic/>}></Route>
            <Route path="/9" element={<div>option 9</div>}></Route>
            <Route path="/10" element={<div>option 10</div>}></Route>
        </Routes>
    </div>)
}

export default Content;




//
//
// import { Route, Routes, Navigate } from "react-router-dom";
// import Users from "./Users";
// import Course from "./Course";
// import React from "react";
// import Traffic from "./Traffic";
// import AuthService from "../auth/AuthService";
// import { UserOutlined } from "@ant-design/icons";
//
// const PrivateRoute = ({ element, ...rest }) => {
//     const isAuthenticated = AuthService.isAuthenticated(); // Implement this method in your AuthService
//
//     return isAuthenticated ? (
//         <Route {...rest} element={element} />
//     ) : (
//         <Navigate to="/login" replace />
//     );
// };
//
// function Content() {
//     return (
//         <div
//             style={{
//                 width: "100%",
//                 margin: "10px",
//             }}
//         >
//             <Routes>
//                 <PrivateRoute path="/users" element={<Users />} />
//                 <Route path="/traffics" element={<Traffic />} />
//                 <Route path="/" element={<Traffic />} />
//                 <Route path="/9" element={<div>option 9</div>} />
//                 <Route path="/10" element={<div>option 10</div>} />
//             </Routes>
//         </div>
//     );
// }
//
// export default Content;