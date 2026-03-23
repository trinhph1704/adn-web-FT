import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getAuthToken } from "../../../apis/rootApi";
import { Loading } from "../../../components";
import { getTestBookingApi } from "../../staff/api/testBookingApi";
import { getBlogsApi } from "../api/blogsApi";
import { getFeedbacksApi } from "../api/feedbackApi";
import { getPaidPayments, type Payment } from "../api/payment";
import type { BlogResponse } from "../types/blogs";
import type { FeedbackResponse } from "../types/feedback";

function Dashboard() {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
    filterType: "custom" as "custom" | "today" | "week" | "month" | "year"
  });
  const [payments, setPayments] = useState<Payment[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAuthToken();
        if (!token) throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");

        const [blogsData, testsData, feedbacksData, paymentsData] = await Promise.all([
          getBlogsApi(),
          getTestBookingApi(),
          getFeedbacksApi(),
          getPaidPayments(token)
        ]);

        setBlogs(blogsData || []);
        setTests(testsData || []);
        setFeedbacks(feedbacksData || []);
        setPayments(paymentsData || []);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDateRange = (type: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (type) {
      case "today": return { startDate: today.toISOString().split('T')[0], endDate: today.toISOString().split('T')[0] };
      case "week":
        const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
        return { startDate: weekStart.toISOString().split('T')[0], endDate: weekEnd.toISOString().split('T')[0] };
      case "month":
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { startDate: monthStart.toISOString().split('T')[0], endDate: monthEnd.toISOString().split('T')[0] };
      case "year":
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const yearEnd = new Date(now.getFullYear(), 11, 31);
        return { startDate: yearStart.toISOString().split('T')[0], endDate: yearEnd.toISOString().split('T')[0] };
      default:
        return { startDate: "", endDate: "" };
    }
  };

  const handlePresetFilter = (type: string) => {
    const range = getDateRange(type);
    setDateFilter({ ...range, filterType: type as any });
  };

  const filterDataByDate = (data: any[], start: string, end: string) => {
    if (!start && !end) return data;
    return data.filter(item => {
      const date = new Date(item.createdAt || item.appointmentDate);
      const s = start ? new Date(start) : new Date("1900-01-01");
      const e = end ? new Date(end) : new Date("2100-12-31");
      return date >= s && date <= e;
    });
  };

  const formatChartData = () => {
    const blogsData = filterDataByDate(blogs, dateFilter.startDate, dateFilter.endDate);
    const testsData = filterDataByDate(tests, dateFilter.startDate, dateFilter.endDate);
    const feedbacksData = filterDataByDate(feedbacks, dateFilter.startDate, dateFilter.endDate);
    const paymentsData = filterDataByDate(payments, dateFilter.startDate, dateFilter.endDate);

    const countByDate = (data: any[], field = "createdAt") => {
      const result: Record<string, number> = {};
      data.forEach(item => {
        const date = new Date(item[field]).toLocaleDateString();
        result[date] = (result[date] || 0) + 1;
      });
      return result;
    };

    const blogMap = countByDate(blogsData);
    const testMap = countByDate(testsData);
    const feedbackMap = countByDate(feedbacksData);
    const paymentMap = countByDate(paymentsData);
    const allDates = Array.from(new Set([...Object.keys(blogMap), ...Object.keys(testMap), ...Object.keys(feedbackMap), ...Object.keys(paymentMap)])).sort();

    return allDates.map(date => ({
      date,
      "Bài viết": blogMap[date] || 0,
      "Lịch xét nghiệm": testMap[date] || 0,
      "Phản hồi": feedbackMap[date] || 0,
      "Thanh toán": paymentMap[date] || 0,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading message="Đang tải dữ liệu thống kê..." fullScreen={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-auto bg-blue-50">
      <div className="fixed z-50 flex flex-col gap-4 p-4.5 px-5 bg-white w-296 sm:flex-row sm:items-center sm:justify-between">
        <li className="text-2xl text-blue-800"> Thống kê tổng quan</li>
      </div>

      {/* Cards */}
      <div className="p-2.5 mt-17">
        <div className="grid grid-cols-1 gap-6 mb-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 transition-all duration-300 ease-in-out hover:scale-[1.02]">
          <CardStat title="Bài viết" count={filterDataByDate(blogs, dateFilter.startDate, dateFilter.endDate).length} color="blue" />
          <CardStat title="Lịch xét nghiệm" count={filterDataByDate(tests, dateFilter.startDate, dateFilter.endDate).length} color="green" />
          <CardStat title="Phản hồi" count={filterDataByDate(feedbacks, dateFilter.startDate, dateFilter.endDate).length} color="orange" />
          <CardStat title="Thanh toán" count={filterDataByDate(payments, dateFilter.startDate, dateFilter.endDate).length} color="red" />
        </div>

        {/* Chart Section */}
        <div className="p-6 bg-white shadow-xl rounded-2xl">
          <div className="flex flex-col justify-between mb-4 sm:flex-row sm:items-center">
            <h2 className="text-xl font-semibold text-gray-700"></h2>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              {[
                { key: "today", label: "Hôm nay" },
                { key: "week", label: "Tuần này" },
                { key: "month", label: "Tháng này" },
                { key: "year", label: "Năm nay" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handlePresetFilter(key)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition duration-200 ${dateFilter.filterType === key
                    ? "bg-blue-400 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <h3 className="mb-4 text-lg font-medium text-gray-800">📈 Hoạt động theo thời gian</h3>
          <ResponsiveContainer width="100%" height={430}>
            <LineChart data={formatChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Bài viết" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="Lịch xét nghiệm" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Phản hồi" stroke="#f97316" strokeWidth={2} />
              <Line type="monotone" dataKey="Thanh toán" stroke="#dc2626" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function CardStat({ title, count, color }: { title: string; count: number; color: string }) {
  const colorMap: Record<string, string> = {
    red: "text-red-600 bg-red-100",
    green: "text-green-600 bg-green-100",
    orange: "text-orange-600 bg-orange-100",
    blue: "text-blue-600 bg-blue-100",
  };
  return (
    <div className={`rounded-2xl shadow-md p-6 flex flex-col items-center justify-center ${colorMap[color]}`}>
      <p className="mb-1 text-sm text-gray-600">{title}</p>
      <p className="text-3xl font-extrabold">{count}</p>
    </div>
  );
}

export default Dashboard;
