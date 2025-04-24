import Sidebar from "@/components/sidebar";

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
                <h1>News</h1>
                <p>Latest news and updates.</p>
            </div>
        </div>
    );
}

export default News;