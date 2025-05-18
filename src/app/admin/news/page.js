import Sidebar from "@/components/sidebar";
import Main from "@/components/news/main";

export const metadata = {
    title: "News",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const News = () => {  

    
    return (
        <div className="flex flex-row h-screen relative">
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>
            <div className="w-full p-5 overflow-auto">
                <Main/>
            </div>
            
        </div>
    );
}

export default News;