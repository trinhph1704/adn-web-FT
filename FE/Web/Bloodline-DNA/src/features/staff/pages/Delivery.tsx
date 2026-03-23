import { Tabs } from "antd";
import DeliveryTable from "../components/delivery/DeliveryTable";
import SampleReceived from "../components/delivery/SampleReceivedTable";

const { TabPane } = Tabs;

const DeliveriesStaff = () => {
  return (
    <div className="min-h-screen bg-blue-50">
      <li className="mb-2 text-lg bg-white p-5 text-[#1F2B6C]">
        Quản lý danh sách đơn được phân công
      </li>
      <div className="px-5">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Giao Kit" key="1">
            <DeliveryTable />
          </TabPane>

          <TabPane tab="Nhận mẫu Kit" key="2">
            <SampleReceived
              onRowClick={(id) => console.log("Chi tiết đơn:", id)}
              onComplete={() => console.log("Đã xác nhận nhận mẫu")}
            />
          </TabPane>

          {/* <TabPane tab="Gửi kết quả" key="3">
            <ResultSent
              onRowClick={(id) => console.log("Chi tiết đơn:", id)}
              onComplete={() => console.log("Đã gửi kết quả")}
            />
          </TabPane> */}
        </Tabs>
      </div>
    </div>
  );
};

export default DeliveriesStaff;
