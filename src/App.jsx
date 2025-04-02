import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Document from "./pages/Document";
import ClassroomDetail from "./pages/ClassroomDetail";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route
          path="/home/:collegeId/:classroomId"
          element={<ClassroomDetail />}
        ></Route>
        <Route path="/document" element={<Document />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
