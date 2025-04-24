import Sidebar from "@/components/sidebar";

export const metadata = {
    title: "Gallery",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const Gallery = () => {
    return (
        <div className="flex flex-row h-screen relative">
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>
            <div className="w-full p-5 overflow-auto">
                <h1>Gallery</h1>
                <p>Welcome to the gallery page!</p>
            </div>
        </div>
    );
}

export default Gallery;