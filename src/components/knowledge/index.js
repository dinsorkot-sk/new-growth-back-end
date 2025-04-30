// // components/activity/index.js
// "use client";
// import { useState, useEffect } from "react";
// import Form from "./form";
// import List from "./list";

// const ActivityIndex = () => {
//     const [view, setView] = useState("list"); // list หรือ form
//     const [currentActivity, setCurrentActivity] = useState(null);
//     const [activities, setActivities] = useState([
//         { id: 1, title: "การอบรมเชิงปฏิบัติการ React", date: "2025-05-10", description: "อบรมการใช้งาน React เบื้องต้นถึงขั้นสูง" },
//         { id: 2, title: "สัมมนาเทคโนโลยี AI และการประยุกต์ใช้", date: "2025-05-15", description: "แนะนำเทคโนโลยี AI ล่าสุดและการประยุกต์ใช้ในธุรกิจ" },
//     ]);

//     const handleAddNew = () => {
//         setCurrentActivity(null);
//         setView("form");
//     };

//     const handleEdit = (activity) => {
//         setCurrentActivity(activity);
//         setView("form");
//     };

//     const handleBack = () => {
//         setView("list");
//     };

//     const handleSave = (formData) => {
//         if (currentActivity) {
//             // Edit existing activity
//             setActivities(activities.map(item => 
//                 item.id === currentActivity.id ? {...formData, id: currentActivity.id} : item
//             ));
//         } else {
//             // Add new activity
//             const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
//             setActivities([...activities, { ...formData, id: newId }]);
//         }
//         setView("list");
//     };

//     const handleDelete = (id) => {
//         if (window.confirm("คุณต้องการลบกิจกรรมนี้ใช่หรือไม่?")) {
//             setActivities(activities.filter(activity => activity.id !== id));
//         }
//     };

//     return (
//         <div>
//             {view === "list" ? (
//                 <List 
//                     activities={activities} 
//                     onAddNew={handleAddNew} 
//                     onEdit={handleEdit} 
//                     onDelete={handleDelete}
//                 />
//             ) : (
//                 <Form 
//                     activity={currentActivity} 
//                     onBack={handleBack}
//                     onSave={handleSave}
//                 />
//             )}
//         </div>
//     );
// };

// export default ActivityIndex;

"use client";
import { useState, useEffect } from "react";
import Form from "./form";
import List from "./list";

const DocumentIndex = () => {
    const [view, setView] = useState("list"); // list หรือ form
    const [currentDocument, setCurrentDocument] = useState(null);
    const [documents, setDocuments] = useState([
        { 
            id: 1, 
            name: "รายงานประจำปี 2024", 
            fileType: "PDF", 
            size: "2.5 MB", 
            uploadDate: "2025-04-15",
            description: "รายงานสรุปผลการดำเนินงานประจำปี 2024",
            fileUrl: "/documents/report-2024.pdf"
        },
        { 
            id: 2, 
            name: "แบบฟอร์มการลงทะเบียน", 
            fileType: "DOCX", 
            size: "1.2 MB", 
            uploadDate: "2025-04-20",
            description: "แบบฟอร์มสำหรับการลงทะเบียนเข้าร่วมกิจกรรม",
            fileUrl: "/documents/registration-form.docx"
        },
        { 
            id: 3, 
            name: "ข้อมูลยอดขายไตรมาสที่ 1/2025", 
            fileType: "XLSX", 
            size: "3.7 MB", 
            uploadDate: "2025-04-10",
            description: "รายงานยอดขายและการวิเคราะห์ข้อมูลสำหรับไตรมาสที่ 1 ปี 2025",
            fileUrl: "/documents/sales-q1-2025.xlsx"
        },
        { 
            id: 4, 
            name: "นำเสนอแผนธุรกิจ 2025", 
            fileType: "PPTX", 
            size: "8.1 MB", 
            uploadDate: "2025-03-25",
            description: "เอกสารนำเสนอแผนธุรกิจและกลยุทธ์การตลาดสำหรับปี 2025",
            fileUrl: "/documents/business-plan-2025.pptx"
        },
        { 
            id: 5, 
            name: "รูปภาพการประชุมประจำเดือน", 
            fileType: "JPG", 
            size: "5.2 MB", 
            uploadDate: "2025-04-05",
            description: "ภาพถ่ายจากการประชุมประจำเดือนเมษายน 2025",
            fileUrl: "/documents/meeting-photos.jpg"
        },
    ]);

    const handleAddNew = () => {
        setCurrentDocument(null);
        setView("form");
    };

    const handleEdit = (document) => {
        setCurrentDocument(document);
        setView("form");
    };

    const handleView = (document) => {
        // ตรวจสอบว่ามี URL ของไฟล์หรือไม่
        if (document.fileUrl) {
            // ตรวจสอบประเภทไฟล์เพื่อเลือกวิธีการแสดงผล
            const fileType = document.fileType.toLowerCase();
            
            // ไฟล์ที่สามารถแสดงในเบราว์เซอร์ได้ เช่น PDF, รูปภาพ
            if (fileType === 'pdf' || 
                fileType.includes('jpg') || 
                fileType.includes('jpeg') || 
                fileType.includes('png') || 
                fileType.includes('gif')) {
                // เปิดไฟล์ในแท็บใหม่
                window.open(document.fileUrl, '_blank');
            } else {
                // ไฟล์ประเภทอื่นๆ ที่อาจต้องดาวน์โหลด
                const link = document.createElement('a');
                link.href = document.fileUrl;
                link.download = document.name;
                link.click();
            }
        } else {
            // กรณีไม่มี URL ของไฟล์
            alert(`ไม่พบไฟล์เอกสาร "${document.name}"`);
        }
    };

    const handleBack = () => {
        setView("list");
    };

    const handleSave = (formData) => {
        if (currentDocument) {
            // Edit existing document
            setDocuments(documents.map(item => 
                item.id === currentDocument.id ? {...formData, id: currentDocument.id} : item
            ));
        } else {
            // Add new document
            const newId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
            // สมมติให้เป็นวันที่ปัจจุบัน
            const today = new Date().toISOString().split('T')[0];
            setDocuments([...documents, { 
                ...formData, 
                id: newId,
                uploadDate: today
            }]);
        }
        setView("list");
    };

    const handleDelete = (id) => {
        if (window.confirm("คุณต้องการลบเอกสารนี้ใช่หรือไม่?")) {
            setDocuments(documents.filter(document => document.id !== id));
        }
    };

    return (
        <div>
            {view === "list" ? (
                <List 
                    documents={documents} 
                    onAddNew={handleAddNew} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete}
                    onView={handleView}
                />
            ) : (
                <Form 
                    document={currentDocument} 
                    onBack={handleBack}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default DocumentIndex;