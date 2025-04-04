import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Document from "./pages/Document";
import ClassroomDetail from "./pages/ClassroomDetail";
import Reservation from "./pages/Reservation";
import Report from "./pages/Report";
import AdminHome from "./pages/AdminHome";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/admin/home" element={<AdminHome />}></Route>
        <Route
          path="/home/:collegeId/:classroomId"
          element={<ClassroomDetail />}
        ></Route>
        <Route path="/document" element={<Document />}></Route>
        <Route path="/reservation" element={<Reservation />}></Route>
        <Route path="/report" element={<Report />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
