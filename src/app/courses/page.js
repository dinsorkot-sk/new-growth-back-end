import Sidebar from "@/components/sidebar";

export const metadata = {
    title: "Courses",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const Courses = () => {
    return (
        <div className="flex flex-row h-screen relative">
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>
            <div className="flex flex-col gap-5 w-full p-5 overflow-auto">
                <div className="bg-white flex items-center p-5 w-full h-15 drop-shadow rounded-2xl">
                    <div className="text-2xl">จัดการหลักสูตร</div>
                </div>

                <div className="bg-white flex items-center p-5 w-full h-15 drop-shadow rounded-2xl">
                    <div>
                        <input type="text" className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#26A65B] focus:border-[#26A65B]' placeholder='ค้นหาหลักสูตร' />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Courses;