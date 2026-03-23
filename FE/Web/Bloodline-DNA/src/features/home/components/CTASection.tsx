import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user?.role === "Client") {
        navigate("/services");
        return;
      }
    } catch (e) {
      console.error("Lỗi parse user từ localStorage", e);
    }
  }

  navigate("/services");
};

  return (
    <section className="py-12 bg-white md:py-16">
      <h2 className="mb-4 text-2xl font-bold text-center text-gray-800 md:text-3xl">
        Đặt lịch xét nghiệm ADN ngay hôm nay để nhận kết quả chính xác, bảo mật.
      </h2>
      <p className="mb-8 text-sm text-center text-gray-600 md:text-base">
        Hỗ trợ 24/7 từ đội ngũ chuyên gia.
      </p>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Button
          type="primary"
          size="large"
          className="px-4 py-2 md:px-6 md:py-3"
          onClick={handleBookNow}
        >
          Đặt lịch ngay
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
