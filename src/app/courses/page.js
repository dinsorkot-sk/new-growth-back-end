
import Sidebar from "@/components/sidebar";
import Index from "@/components/courses/index";

export const metadata = {
    title: "Courses",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const Courses = () => {
    return (
        <div className="flex flex-row">
            <div className="fixed top-0">
                <Sidebar />
            </div>
            
            <div className="ms-56 w-full gap-5 p-5 flex flex-col">
                {/* Header */}
                <div className="bg-white flex items-center p-5 w-full drop-shadow rounded-2xl">
                    <h1 className="text-2xl font-semibold">จัดการหลักสูตร</h1>
                </div>

                <Index/>
            </div>
        </div>
    );
}

export default Courses;