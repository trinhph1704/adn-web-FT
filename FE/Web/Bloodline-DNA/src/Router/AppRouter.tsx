import React from "react";
import { Route, Routes } from "react-router-dom";
import { NotFound } from "../components";
import { Blogs, ForgotPasswordForm, Login, Register } from "../features";
import { AboutPage } from "../features/about";
import { Contacts, DetailServices, Doctors, Services } from "../features/customer";
import BlogDetail from "../features/customer/pages/BlogDetails";
import HomePage from "../features/home/pages/HomePage";
import AdminRouter from "./AdminRouter";
import CustomerRouter from "./CustomerRouter";
import ManagerRouter from "./ManagerRouter";
import StaffRouter from "./StaffRouter";
// The customer imports are no longer needed here as they are handled in CustomerRouter
// import { Blogs, Contacts, DetailServices, Doctors, Services } from "../features/customer";
// import BlogDetail from "../features/customer/pages/BlogDetails";

const App: React.FC = () => {
  return (
    <Routes>
      {/* router auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<DetailServices />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
      
      {/* Homepage route */}
      <Route path="/" element={<HomePage />} />

      {/* Role-based routers */}
      <Route path="/staff/*" element={<StaffRouter />} />
      <Route path="/manager/*"element={<ManagerRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="/customer/*" element={<CustomerRouter />} />

      {/* Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
