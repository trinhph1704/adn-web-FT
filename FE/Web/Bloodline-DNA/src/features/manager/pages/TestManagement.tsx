import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Loading } from '../../../components';
import { Button } from '../../staff/components/sample/ui/button';
import { createTestApi, deleteTestApi, getTestByIdApi, getTestsApi, updateTestApi } from '../api/testApi';
import ModalDetail from '../components/testManagement/ModalDetail';
import ModalEdit from '../components/testManagement/ModalEdit';
import ModalTest from '../components/testManagement/ModalTest';
import TestList from '../components/testManagement/TestList';
import type { PriceServiceRequest, TestRequest, TestResponse, TestUpdateRequest } from '../types/testService';

export default function TestManagement() {
  const [tests, setTests] = useState<TestResponse[]>([]);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailTest, setDetailTest] = useState<TestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sửa dịch vụ
  const [showEditTest, setShowEditTest] = useState(false);
  const [editTestData, setEditTestData] = useState<TestResponse | null>(null);

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getTestsApi(token);
        const sortedTests = [...res].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTests(sortedTests);
      } catch {
        setTests([]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [token]);

  // Thêm dịch vụ mới (POST)
  const handleAddTest = async (data: {
    name: string;
    description: string;
    category: string;
    isActive: boolean;
    sampleCount: number;
    priceService: PriceServiceRequest;
  }) => {
    try {
      const requestData: TestRequest = {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        sampleCount: data.sampleCount,
        priceServices: [data.priceService],
      };

      await createTestApi(requestData, token);
      alert('Thêm dịch vụ thành công!');
      setShowAddTest(false);
      const newTests = await getTestsApi(token);
      const sortedTests = [...newTests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTests(sortedTests);
    } catch (err) {
      console.error('Error adding test:', err);
      alert(`Có lỗi xảy ra: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Lấy chi tiết để sửa
  const handleEditTest = async (testId: string) => {
    try {
      const test = await getTestByIdApi(testId, token);
      setEditTestData(test);
      setShowEditTest(true);
    } catch {
      alert('Không lấy được thông tin dịch vụ!');
    }
  };

  // Sửa dịch vụ (PUT)
  const handleUpdateTest = async (data: TestUpdateRequest) => {
    try {
      await updateTestApi(data, token);
      setShowEditTest(false);
      const newTests = await getTestsApi(token);
      const sortedTests = [...newTests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTests(sortedTests);
      alert('Cập nhật dịch vụ thành công!');
    } catch {
      alert('Có lỗi xảy ra khi cập nhật dịch vụ!');
    }
  };

  // Xóa dịch vụ
  const handleDeleteTest = async (id: string) => {
    try {
      await deleteTestApi(id, token);
      setTests(tests.filter((t) => t.id !== id));
      alert('Đã xóa dịch vụ!');
    } catch {
      alert('Có lỗi xảy ra khi xóa dịch vụ!');
    }
  };

  // Xem chi tiết
  const handleShowDetail = (test: TestResponse) => {
    setDetailTest(test);
    setShowDetail(true);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Modal thêm dịch vụ */}
      <ModalTest
        open={showAddTest}
        onClose={() => setShowAddTest(false)}
        onSubmit={handleAddTest}
      />

      {/* Modal chỉnh sửa toàn bộ dịch vụ (bao gồm giá) */}
      <ModalEdit
        open={showEditTest}
        onClose={() => setShowEditTest(false)}
        onSubmit={handleUpdateTest}
        initialData={editTestData}
      />

      {/* Modal chi tiết */}
      <ModalDetail
        open={showDetail}
        onClose={() => setShowDetail(false)}
        test={detailTest}
      />

      {/* Header */}
      <div className="fixed z-50 flex flex-col gap-4 p-4 px-5 bg-white w-296 sm:flex-row sm:items-center sm:justify-between">
        <li className="text-lg text-[#1F2B6C] md:text-lg">
          Quản lý dịch vụ xét nghiệm</li>
        <Button
          size={'sm'}
          onClick={() => setShowAddTest(true)}
          className="flex items-center gap-2 bg-[#1F2B6C] hover:bg-blue-800 px-4 py-2 rounded-lg shadow"
        >
          <FaPlus className="text-sm text-white" />
          <span className="text-sm text-white">Thêm dịch vụ</span>
        </Button>
      </div>

      {/* Danh sách dịch vụ */}
      <div className="overflow-x-auto p-2 pt-18 max-h-[100vh]">
        {isLoading ? (
            <div className="flex items-center justify-center h-[550px]">
              <Loading message="Đang tải danh sách dịch vụ xét nghiệm..." />
            </div>
        ) : tests.length > 0 ? (
          <TestList
            tests={tests}
            onShowDetail={handleShowDetail}
            onEditTest={handleEditTest}
            onDeleteTest={handleDeleteTest}
          />
        ) : (
          <p className="py-8 text-center text-gray-500">Không có dịch vụ nào để hiển thị.</p>
        )}
      </div>
    </div>
  );
}
