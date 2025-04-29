import Sidebar from "@/components/sidebar";
import QuestionsIndex from "@/components/forum/index";

export const metadata = {
    title: "กระดู่คำถาม",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const Questions = () => {
    // กำหนดข้อมูลตัวอย่างสำหรับกระดู่คำถาม
    const categories = [
        { id: 1, name: "ทั่วไป", icon: "graduation-cap" },
        { id: 2, name: "การเงิน", icon: "graduation-cap" },
        { id: 3, name: "อาจารย์", icon: "graduation-cap" },
        { id: 4, name: "การศึกษา", icon: "graduation-cap" },
        { id: 5, name: "กิจกรรม", icon: "graduation-cap" },
        { id: 6, name: "ระเบียบ", icon: "graduation-cap" },
    ];
    
    const questions = [
        { id: 1, text: "เรียนออนไลน์แล้วน่าเบื่อมีประติภาพ?", categoryId: 1 },
        { id: 2, text: "ค่าเทอมแพงเกินไปหรือไม่?", categoryId: 2 },
        { id: 3, text: "อาจารย์มีวิธีสอนที่น่าสนใจอย่างไรบ้าง?", categoryId: 3 },
        { id: 4, text: "การศึกษาทางไกลมีประสิทธิภาพเพียงใด?", categoryId: 4 },
        { id: 5, text: "กิจกรรมใดบ้างที่นักศึกษาควรเข้าร่วม?", categoryId: 5 },
        { id: 6, text: "กฎระเบียบใหม่มีผลกระทบต่อนักศึกษาอย่างไร?", categoryId: 6 },
    ];

    return (
        <div className="flex flex-row">
            <div className="fixed top-0">
                <Sidebar />
            </div>
            
            <div className="ms-56 w-full gap-5 p-5 flex flex-col">
                {/* Header */}
                <div className="bg-white flex items-center p-5 w-full drop-shadow rounded-2xl">
                    <h1 className="text-2xl font-semibold">กระดู่คำถาม</h1>
                </div>

                <QuestionsIndex categories={categories} questions={questions} />
            </div>
        </div>
    );
}

export default Questions;