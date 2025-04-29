import Sidebar from "@/components/sidebar";
import ActivityForm from "@/components/knowledge/index";
export const metadata = {
    title: "Knowledge",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

// const Knowledge = () => {
//     return (
//         <div className="flex flex-row h-screen relative">
//             <div className="sticky top-0 h-screen">
//                 <Sidebar />
//             </div>
//             <div className="w-full p-5 overflow-auto">
//                 <h1 >Knowledge</h1>
//                 <p >This is the knowledge page.</p>
//             </div>
//         </div>
//     );
// }

// export default Knowledge;

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