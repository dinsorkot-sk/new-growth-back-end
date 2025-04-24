import Sidebar from "@/components/sidebar";

export const metadata = {
    title: "Forum",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const Forum = () => {
    return (
        <div className="flex flex-row h-screen relative">
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>
            <div className="w-full p-5 overflow-auto">
                <h1>Forum</h1>
                <p>Welcome to the forum!</p>
            </div>
        </div>
    );
}

export default Forum;