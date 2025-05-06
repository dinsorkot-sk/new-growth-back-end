import Sidebar from "@/components/sidebar";
import ActivityForm from "@/components/knowledge/index";
export const metadata = {
    title: "Knowledge",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const ActivityPage = () => {
    return (
        <div className="flex flex-row min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ">
                <div className="container mx-auto p-4">
                    <div className="bg-white rounded-md shadow-sm mb-6">
                        
                        <div className="p-4">
                            <ActivityForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityPage;