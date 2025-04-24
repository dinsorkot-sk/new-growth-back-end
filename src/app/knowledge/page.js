import Sidebar from "@/components/sidebar";

export const metadata = {
    title: "Knowledge",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const Knowledge = () => {
    return (
        <div className="flex flex-row h-screen relative">
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>
            <div className="w-full p-5 overflow-auto">
                <h1 >Knowledge</h1>
                <p >This is the knowledge page.</p>
            </div>
        </div>
    );
}

export default Knowledge;
