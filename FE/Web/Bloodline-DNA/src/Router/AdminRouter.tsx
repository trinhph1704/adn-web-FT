import { Route, Routes } from 'react-router-dom';
import { NotFound } from '../components';
import Sidebar from '../features/admin/components/Sidebar';
import UserMangement from '../features/admin/pages/UserMangement';
import Dashboard from '../features/admin/pages/Dashboard';
import SampleIns from '../features/admin/pages/SampleIns';

export default function AdminRouter() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto ">
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<UserMangement />} />
                    <Route path="sample-ins" element={<SampleIns />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}
