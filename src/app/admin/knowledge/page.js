import Sidebar from "@/components/sidebar";
import ActivityForm from "@/components/knowledge/index";
export const metadata = {
    title: "Knowledge",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const ActivityPage = () => {
    return (
        <div className="flex flex-row min-h-screen bg-gray-100">
            <div className="fixed top-0">
                <Sidebar />
            </div>
            <div className="ms-56 flex-1 overflow-x-hidden">
                <div className="bg-white rounded-md shadow-sm mb-6">
                    <div className="p-4">
                        <ActivityForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityPage;