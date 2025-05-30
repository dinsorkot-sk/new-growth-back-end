

import Sidebar from "@/components/sidebar";
import Index from "@/components/board/index";

export const metadata = {
    title: "ประกาศทั่วไป",
    description: "ระบบจัดการประกาศทั่วไป",
};

const Gallery = () => {
    // Dummy data for demonstration
    const images = Array(6).fill({
        title: "รูปภาพกิจกรรม",
        description: "ภาพกิจกรรมการอบรมเชิงปฏิบัติการ",
        uploadedBy: "คุณสมศักดิ์",
        uploadDate: "15/04/2025",
        views: 85,
        fileSize: "2.4 MB",
        dimensions: "1920x1080"
    });      

    return (
        <div className="flex flex-row">
            <div className="fixed top-0">
                <Sidebar />
            </div>
            
            <div className="ms-56 w-full gap-5 p-5 flex flex-col">
                {/* Header */}
                <div className="bg-white flex items-center p-5 w-full drop-shadow rounded-2xl">
                    <h1 className="text-2xl font-semibold">กลุ่มรูปภาพ</h1>
                </div>

                <Index images={images} />
            </div>
        </div>
    );
}

export default Gallery;


