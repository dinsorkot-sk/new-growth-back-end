// import Sidebar from "@/components/sidebar";

// export const metadata = {
//     title: "Gallery",
//     description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
// };

// const Gallery = () => {
//     return (
//         <div className="flex flex-row h-screen relative">
//             <div className="sticky top-0 h-screen">
//                 <Sidebar />
//             </div>
//             <div className="w-full p-5 overflow-auto">
//                 <h1>Gallery</h1>
//                 <p>Welcome to the gallery page!</p>
//             </div>
//         </div>
//     );
// }

// export default Gallery;

import Sidebar from "@/components/sidebar";
import Index from "@/components/gallery/index";

export const metadata = {
    title: "Gallery",
    description: "ระบบจัดการรูปภาพ",
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