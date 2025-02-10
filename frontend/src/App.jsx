import React from "react";
import Register from "./pages/Register";
import { Toaster } from "sonner";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CustomerView from "./pages/CustomerView";

const App = () => {
  return (
    <div className="bg-indigo-300 h-screen flex justify-center items-start">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customerview" element={<CustomerView />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default App;
