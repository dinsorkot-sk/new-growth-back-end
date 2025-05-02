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
        { 
            id: 1, 
            text: "เรียนออนไลน์แล้วน่าเบื่อมีประติภาพ?", 
            categoryId: 1,
            answers: [
                {
                    id: 101,
                    text: "ลองปรับเปลี่ยนสภาพแวดล้อมในการเรียนครับ เช่น เปลี่ยนสถานที่ หรือจัดโต๊ะให้น่าเรียนขึ้น ช่วยได้มากเลยครับ",
                    user: { name: "สมชาย ใจดี" },
                    createdAt: "2025-04-10T08:30:00Z"
                },
                {
                    id: 102,
                    text: "แนะนำให้ตั้งเป้าหมายเล็กๆ แล้วให้รางวัลตัวเอง จะช่วยสร้างแรงจูงใจได้ดีค่ะ",
                    user: { name: "สมหญิง รักเรียน" },
                    createdAt: "2025-04-12T10:15:00Z"
                }
            ]
        },
        { 
            id: 2, 
            text: "ค่าเทอมแพงเกินไปหรือไม่?", 
            categoryId: 2,
            answers: [
                {
                    id: 201,
                    text: "ถ้าเทียบกับคุณภาพการศึกษาที่ได้รับ ผมว่าคุ้มค่านะครับ แต่ก็อยากให้มีทุนการศึกษาเพิ่มมากขึ้น",
                    user: { name: "นาย ก." },
                    createdAt: "2025-04-05T14:20:00Z"
                }
            ]
        },
        { 
            id: 3, 
            text: "อาจารย์มีวิธีสอนที่น่าสนใจอย่างไรบ้าง?", 
            categoryId: 3,
            answers: [
                {
                    id: 301,
                    text: "อาจารย์ที่ใช้เทคนิค Active Learning ทำให้ผมสนุกกับการเรียนมากขึ้นครับ โดยเฉพาะการเรียนแบบ Problem-based Learning",
                    user: { name: "นักศึกษา ปี 3" },
                    createdAt: "2025-04-08T09:45:00Z"
                },
                {
                    id: 302,
                    text: "อาจารย์ที่เชื่อมโยงทฤษฎีกับการใช้งานจริงในชีวิตประจำวันทำให้เข้าใจได้ง่ายขึ้นมากค่ะ",
                    user: { name: "วิชชุดา" },
                    createdAt: "2025-04-09T16:30:00Z"
                }
            ]
        },
        { 
            id: 4, 
            text: "การศึกษาทางไกลมีประสิทธิภาพเพียงใด?", 
            categoryId: 4,
            answers: [
                {
                    id: 401,
                    text: "ขึ้นอยู่กับวินัยของแต่ละคนครับ ถ้ามีวินัยในตัวเองสูง การศึกษาทางไกลก็มีประสิทธิภาพไม่แพ้การเรียนในห้องเรียน",
                    user: { name: "ประพันธ์" },
                    createdAt: "2025-04-15T11:20:00Z"
                },
                {
                    id: 402,
                    text: "ส่วนตัวชอบการมีปฏิสัมพันธ์กับเพื่อนและอาจารย์มากกว่า แต่ช่วงที่ไม่สะดวกเดินทาง การเรียนทางไกลก็เป็นทางเลือกที่ดีค่ะ",
                    user: { name: "นิชา" },
                    createdAt: "2025-04-16T13:40:00Z"
                },
                {
                    id: 403,
                    text: "ผมว่าการเรียนแบบผสมผสานระหว่างออนไลน์และออฟไลน์เป็นทางเลือกที่ดีที่สุดครับ",
                    user: { name: "ธนกร" },
                    createdAt: "2025-04-18T10:05:00Z"
                }
            ]
        },
        { 
            id: 5, 
            text: "กิจกรรมใดบ้างที่นักศึกษาควรเข้าร่วม?", 
            categoryId: 5,
            answers: [
                {
                    id: 501,
                    text: "กิจกรรมจิตอาสาช่วยพัฒนาทักษะทางสังคมและการทำงานเป็นทีมได้ดีมากครับ",
                    user: { name: "อาสา ชอบช่วย" },
                    createdAt: "2025-04-20T08:30:00Z"
                },
                {
                    id: 502,
                    text: "แนะนำกิจกรรมชมรมที่เกี่ยวข้องกับสาขาที่เรียน จะช่วยเสริมความรู้และได้เครือข่ายในวงการด้วยค่ะ",
                    user: { name: "มินตรา" },
                    createdAt: "2025-04-21T14:15:00Z"
                }
            ]
        },
        { 
            id: 6, 
            text: "กฎระเบียบใหม่มีผลกระทบต่อนักศึกษาอย่างไร?", 
            categoryId: 6,
            answers: []  // ยังไม่มีคำตอบสำหรับคำถามนี้
        },
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