import Sidebar from "@/components/sidebar";

export const metadata = {
    title: "Dashboard",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const Dashboard = () => {

    return (
        <div className="flex flex-row h-screen relative">
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>
            <div className="w-full p-5 overflow-auto">
                <div className="bg-white flex items-center p-5 w-full h-15 drop-shadow rounded-2xl">
                    <div className="text-2xl">Dashboard</div>
                </div>

                <div className="flex flex-row mt-5 gap-5">
                    <div className="bg-white w-1/4 h-auto drop-shadow rounded-2xl p-5 flex flex-row justify-between">
                        <div>
                            <div className="text-lg text-[#7E8490]">จำนวนผู้เข้าใช้งาน</div>
                            <div className="my-5 text-start text-3xl">1000</div>
                            <div className="flex gap-2">
                                <div className="text-[#25BF8C]">↑ 10%</div>
                                <div className="text-[#7E8490]">จากเดือนที่แล้ว</div>
                            </div>
                        </div>
                        <div className="">
                            <div className="bg-[#D3E2F5] h-15 w-15 rounded-full"></div>
                        </div>
                    </div>
                    <div className="bg-white w-1/4 h-auto drop-shadow rounded-2xl p-5 flex flex-row justify-between">
                        <div>
                            <div className="text-lg text-[#7E8490]">หลักสูตรที่เปิดสอน</div>
                            <div className="my-5 text-start text-3xl">10</div>
                            <div className="flex gap-2">
                                <div className="text-[#25BF8C]">↑ 3%</div>
                                <div className="text-[#7E8490]">หลักสูตรใหม่</div>
                            </div>
                        </div>
                        <div className="">
                            <div className="bg-[#CAF2DE] h-15 w-15 rounded-full"></div>
                        </div>
                    </div>
                    <div className="bg-white w-1/4 h-auto drop-shadow rounded-2xl p-5 flex flex-row justify-between">
                        <div>
                            <div className="text-lg text-[#7E8490]">ข้อความใหม่</div>
                            <div className="my-5 text-start text-3xl">5</div>
                            <div className="flex gap-2">
                                <div className="text-[#EF4646]">ข้อความวันนี้</div>
                            </div>
                        </div>
                        <div className="">
                            <div className="bg-[#F6EBC1] h-15 w-15 rounded-full"></div>
                        </div>
                    </div>
                    <div className="bg-white w-1/4 h-auto drop-shadow rounded-2xl p-5 flex flex-row justify-between">
                        <div>
                            <div className="text-lg text-[#7E8490]">กิจกรรมวันนี้</div>
                            <div className="my-5 text-start text-3xl">2</div>
                            <div className="flex gap-2">
                                <div className="text-[#2778FF]">กิจกรรมทั้งหมด</div>
                            </div>
                        </div>
                        <div className="">
                            <div className="bg-[#E6E3F7] h-15 w-15 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row mt-5 gap-5">
                    <div className="bg-white w-1/2 h-70 drop-shadow p-5 rounded-2xl">
                        <div>หลักสูตรยอดนิยม</div>
                    </div>
                    <div className="bg-white w-1/2 drop-shadow p-5 rounded-2xl">
                        <div>จำนวนผู้เรียนต่อหลักสูตร</div>
                    </div>
                </div>

                <div className="flex flex-row mt-5 gap-5">
                    <div className="bg-white w-1/2 h-70 drop-shadow p-5 rounded-2xl">
                        <div className="flex flex-row justify-between w-full">
                            <div>ข้อความล่าสุด</div>
                            <div className="text-[#2B74D1]">ดูทั้งหมด →</div>
                        </div>
                    </div>
                    <div className="bg-white w-1/2 drop-shadow p-5 rounded-2xl">
                        <div className="flex flex-row justify-between w-full">
                            <div>กิจกรรมล่าสุด</div>
                            <div className="text-[#2B74D1]">ดูทั้งหมด →</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;