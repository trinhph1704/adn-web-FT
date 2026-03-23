import { Route, Routes } from 'react-router-dom';
import { NotFound } from '../components';
import Sidebar from '../features/staff/components/Sidebar';
import DeliveriesStaff from '../features/staff/pages/Delivery';
import TestBooking from '../features/staff/pages/TestBooking';
import TestResult from '../features/staff/pages/TestResult';
import TestSample from '../features/staff/pages/TestSample';
import TestSampleAtFacility from '../features/staff/pages/TestSampleAtFacility';

export default function StaffRouter() {
    return (
        <div className="flex min-h-screen bg-[#FCFEFE] overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<TestSample />} />
                    <Route path="test-sample" element={<TestSample />} />
                    <Route path="test-booking" element={<TestBooking />} />
                    <Route path="test-result" element={<TestResult />} />
                    <Route path="delivery" element={<DeliveriesStaff />} />
                    <Route path="test-sample-at-facility" element={<TestSampleAtFacility />} />
                    {/* Thêm các route khác nếu cần */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}
