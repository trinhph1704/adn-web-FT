import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "../../../components";
import { Card, CardContent} from "../../staff/components/sample/ui/card";
import { getAllTestSampleApi } from "../api/testSampleApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "../components/sample/ui/table";
import { getRelationshipLabelViByKey, getSampleTypeLabelViByKey, type SampleTestResponse,} from "../types/sampleTest";

export default function TestSamplePage() {
  const [data, setData] = useState<SampleTestResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token") || "";

  const fetchData = useCallback(async () => {
    if (!token) {
      alert("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn!");
      return;
    }
    setLoading(true); // Bật loading
    try {
      const res = await getAllTestSampleApi(token);
      const sortedData = res.sort((a, b) => {
        return new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime();
      });
      setData(sortedData);
    } catch {
      alert("Không thể tải dữ liệu mẫu");
    } finally {
      setLoading(false); // Tắt loading
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-blue-50">
      {/* Header cố định */}
      <div className="flex items-center justify-between flex-shrink-0">
        <li className="text-lg w-full bg-white p-5 text-[#1F2B6C]">
          Quản lý mẫu xét nghiệm
        </li>
      </div>

      <div className="flex-1 p-2 overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
        <Card className="flex flex-col h-full shadow-lg">
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
                  <TableRow className="[&_th]:font-bold [&_th]:py-3">
                    <TableHead className="text-center">Mã Mẫu</TableHead>
                    <TableHead className="pl-10">Người Cho</TableHead>
                    <TableHead className="pl-10">Quan Hệ</TableHead>
                    <TableHead className="pl-10">Loại Mẫu</TableHead>
                    <TableHead className="text-center">Ngày Thu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-6 text-center text-blue-500">
                        <div className="flex items-center justify-center h-[550px]">
                          <Loading message="Đang tải danh sách mẫu..." />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-6 text-center text-gray-400"
                      >
                        Không có mẫu nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="w-[12%] text-sm font-medium text-center text-blue-700">
                          {item.sampleCode}
                        </TableCell>
                        <TableCell className="w-[14%] pl-10 text-sm font-medium">
                          {item.donorName}
                        </TableCell>
                        <TableCell className="w-[14%] pl-10 text-sm font-medium">
                          {getRelationshipLabelViByKey(item.relationshipToSubject)}
                        </TableCell>
                        <TableCell className="w-[14%] pl-10 text-sm font-medium">
                          {getSampleTypeLabelViByKey(item.sampleType)}
                        </TableCell>
                        <TableCell className="text-sm w-[14%] font-medium text-center">
                          {format(new Date(item.collectedAt), "dd/MM/yyyy")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>

              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}