import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/userContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Document from "./pages/Document";
import ClassroomDetail from "./pages/ClassroomDetail";
import Reservation from "./pages/Reservation";
import Report from "./pages/Report";
import AdminHome from "./pages/AdminHome";
import DocumentReport from "./pages/DocumentReport";
import AppliedContent from "./pages/AppliedContent";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/admin/home" element={<AdminHome />}></Route>
          <Route
            path="/home/:collegeId/:classroomId"
            element={<ClassroomDetail />}
          ></Route>
          <Route path="/document/report" element={<DocumentReport />}></Route>
          <Route path="/document" element={<Document />}></Route>
          <Route path="/reservation" element={<Reservation />}></Route>
          <Route path="/report" element={<Report />}></Route>
          <Route path="/applied-content" element={<AppliedContent />}></Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
