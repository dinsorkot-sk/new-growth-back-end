
import Sidebar from "@/components/sidebar";
import Index from "@/components/courses/index";

export const metadata = {
    title: "Courses",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const Courses = () => {
    // Dummy data for demonstration
    const courses = Array(8).fill({
        title: "การพัฒนาเว็บไซต์สำหรับผู้เริ่มต้น",
        instructor: "อาจารย์สมชาย",
        interested: 100,
        rating: 4,
        reviews: 25,
        description: "เรียนรู้การพัฒนาเว็บไซต์ตั้งแต่พื้นฐาน HTML, CSS ไปจนถึง JavaScript และ PHP เหมาะสำหรับผู้เริ่มต้นที่ไม่มีประสบการณ์"
    });      

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

                <Index courses={courses} />
            </div>
        </div>
    );
}

export default Courses;