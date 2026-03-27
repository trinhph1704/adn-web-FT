import { Route, Routes } from "react-router-dom";

import { NotFound } from "../components";
import AboutPage from "../features/about/pages/AboutPage";
import {
  Blogs,
  BookingList,
  Contacts,
  DetailServices,
  EditBooking,
  EditProfile,
  Services
} from "../features";
import BlogDetail from "../features/pages/BlogDetails";
import { BookingStatusPage } from "../features/pages/BookingStatusPage";
import CheckoutError from "../features/pages/CheckoutError";
import CheckoutRemainSuccess from "../features/pages/CheckoutRemainSuccess";
import CheckoutSuccess from "../features/pages/CheckoutSuccess";
import HomePage from "../features/home/pages/HomePage";

export default function CustomerRouter() {
  return (
    <div className="flex-1">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<DetailServices />} />
        {/* <Route path="/doctors" element={<Doctors />} /> */}
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/booking-status/:id" element={<BookingStatusPage />} />
        <Route path="/edit-booking/:id" element={<EditBooking />} />
        <Route path="/booking-list" element={<BookingList />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/checkout-remainsucess" element={<CheckoutRemainSuccess />} />
        <Route path="/checkout-error" element={<CheckoutError />} />
        {/* Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
