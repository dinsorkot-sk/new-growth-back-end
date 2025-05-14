import Sidebar from "@/components/sidebar";
import Main from "@/components/courses/main";
import { Suspense } from "react";

export const metadata = {
    title: "Courses",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const LoadingSpinner = () => (
    <div className="flex items-center justify-center w-full h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

const Courses = () => {
    return (
        <div className="flex flex-row min-h-screen bg-gray-50">
            <div className="fixed top-0">
                <Sidebar />
            </div>
            
            <div className="ms-56 w-full gap-5 p-5 flex flex-col">
                {/* Header */}
                <div className="bg-white flex items-center p-5 w-full drop-shadow-lg rounded-2xl transform transition-all duration-300 hover:shadow-xl">
                    <h1 className="text-2xl font-semibold text-gray-800">จัดการเนื้อหา</h1>
                </div>

                <Suspense fallback={<LoadingSpinner />}>
                    <div className="animate-fadeIn">
                        <Main/>
                    </div>
                </Suspense>
            </div>
        </div>
    );
}

export default Courses;