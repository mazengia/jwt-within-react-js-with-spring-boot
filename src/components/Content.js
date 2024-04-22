import {Route, Routes} from "react-router-dom";
import Users from "./Users";
import Course from "./Course";
import React from "react";
import Traffic from "./Traffic";

function Content() {
    return (<div
        style={{
            width: '100%',
            margin: '10px'
        }}
    >
        <Routes>
            <Route path="/users" element={<Users/>}></Route>
            <Route path="/traffics" element={<Traffic/>}></Route>
            <Route path="/" element={<Traffic/>}></Route>
            <Route path="/9" element={<div>option 9</div>}></Route>
            <Route path="/10" element={<div>option 10</div>}></Route>
        </Routes>
    </div>)
}

export default Content;