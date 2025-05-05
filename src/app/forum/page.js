// "use client";
// import Sidebar from "@/components/sidebar";
// import QuestionsIndex from "@/components/forum/index";
// import { useState, useEffect } from "react";
// // export const metadata = {
// //     title: "กระดู่คำถาม",
// //     description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
// // };

// const Questions = () => {
//     // กำหนดข้อมูลตัวอย่างสำหรับกระดู่คำถาม
//     // const categories = [
//     //     { id: 1, name: "ทั่วไป", icon: "graduation-cap" },
//     //     { id: 2, name: "การเงิน", icon: "graduation-cap" },
//     //     { id: 3, name: "อาจารย์", icon: "graduation-cap" },
//     //     { id: 4, name: "การศึกษา", icon: "graduation-cap" },
//     //     { id: 5, name: "กิจกรรม", icon: "graduation-cap" },
//     //     { id: 6, name: "ระเบียบ", icon: "graduation-cap" },
//     // ];
    
//     // const questions = [
//     //     { 
//     //         id: 1, 
//     //         text: "เรียนออนไลน์แล้วน่าเบื่อมีประติภาพ?", 
//     //         categoryId: 1,
//     //         answers: [
//     //             {
//     //                 id: 101,
//     //                 text: "ลองปรับเปลี่ยนสภาพแวดล้อมในการเรียนครับ เช่น เปลี่ยนสถานที่ หรือจัดโต๊ะให้น่าเรียนขึ้น ช่วยได้มากเลยครับ",
//     //                 user: { name: "สมชาย ใจดี" },
//     //                 createdAt: "2025-04-10T08:30:00Z"
//     //             },
//     //             {
//     //                 id: 102,
//     //                 text: "แนะนำให้ตั้งเป้าหมายเล็กๆ แล้วให้รางวัลตัวเอง จะช่วยสร้างแรงจูงใจได้ดีค่ะ",
//     //                 user: { name: "สมหญิง รักเรียน" },
//     //                 createdAt: "2025-04-12T10:15:00Z"
//     //             }
//     //         ]
//     //     },
//     //     { 
//     //         id: 2, 
//     //         text: "ค่าเทอมแพงเกินไปหรือไม่?", 
//     //         categoryId: 2,
//     //         answers: [
//     //             {
//     //                 id: 201,
//     //                 text: "ถ้าเทียบกับคุณภาพการศึกษาที่ได้รับ ผมว่าคุ้มค่านะครับ แต่ก็อยากให้มีทุนการศึกษาเพิ่มมากขึ้น",
//     //                 user: { name: "นาย ก." },
//     //                 createdAt: "2025-04-05T14:20:00Z"
//     //             }
//     //         ]
//     //     },
//     //     { 
//     //         id: 3, 
//     //         text: "อาจารย์มีวิธีสอนที่น่าสนใจอย่างไรบ้าง?", 
//     //         categoryId: 3,
//     //         answers: [
//     //             {
//     //                 id: 301,
//     //                 text: "อาจารย์ที่ใช้เทคนิค Active Learning ทำให้ผมสนุกกับการเรียนมากขึ้นครับ โดยเฉพาะการเรียนแบบ Problem-based Learning",
//     //                 user: { name: "นักศึกษา ปี 3" },
//     //                 createdAt: "2025-04-08T09:45:00Z"
//     //             },
//     //             {
//     //                 id: 302,
//     //                 text: "อาจารย์ที่เชื่อมโยงทฤษฎีกับการใช้งานจริงในชีวิตประจำวันทำให้เข้าใจได้ง่ายขึ้นมากค่ะ",
//     //                 user: { name: "วิชชุดา" },
//     //                 createdAt: "2025-04-09T16:30:00Z"
//     //             }
//     //         ]
//     //     },
//     //     { 
//     //         id: 4, 
//     //         text: "การศึกษาทางไกลมีประสิทธิภาพเพียงใด?", 
//     //         categoryId: 4,
//     //         answers: [
//     //             {
//     //                 id: 401,
//     //                 text: "ขึ้นอยู่กับวินัยของแต่ละคนครับ ถ้ามีวินัยในตัวเองสูง การศึกษาทางไกลก็มีประสิทธิภาพไม่แพ้การเรียนในห้องเรียน",
//     //                 user: { name: "ประพันธ์" },
//     //                 createdAt: "2025-04-15T11:20:00Z"
//     //             },
//     //             {
//     //                 id: 402,
//     //                 text: "ส่วนตัวชอบการมีปฏิสัมพันธ์กับเพื่อนและอาจารย์มากกว่า แต่ช่วงที่ไม่สะดวกเดินทาง การเรียนทางไกลก็เป็นทางเลือกที่ดีค่ะ",
//     //                 user: { name: "นิชา" },
//     //                 createdAt: "2025-04-16T13:40:00Z"
//     //             },
//     //             {
//     //                 id: 403,
//     //                 text: "ผมว่าการเรียนแบบผสมผสานระหว่างออนไลน์และออฟไลน์เป็นทางเลือกที่ดีที่สุดครับ",
//     //                 user: { name: "ธนกร" },
//     //                 createdAt: "2025-04-18T10:05:00Z"
//     //             }
//     //         ]
//     //     },
//     //     { 
//     //         id: 5, 
//     //         text: "กิจกรรมใดบ้างที่นักศึกษาควรเข้าร่วม?", 
//     //         categoryId: 5,
//     //         answers: [
//     //             {
//     //                 id: 501,
//     //                 text: "กิจกรรมจิตอาสาช่วยพัฒนาทักษะทางสังคมและการทำงานเป็นทีมได้ดีมากครับ",
//     //                 user: { name: "อาสา ชอบช่วย" },
//     //                 createdAt: "2025-04-20T08:30:00Z"
//     //             },
//     //             {
//     //                 id: 502,
//     //                 text: "แนะนำกิจกรรมชมรมที่เกี่ยวข้องกับสาขาที่เรียน จะช่วยเสริมความรู้และได้เครือข่ายในวงการด้วยค่ะ",
//     //                 user: { name: "มินตรา" },
//     //                 createdAt: "2025-04-21T14:15:00Z"
//     //             }
//     //         ]
//     //     },
//     //     { 
//     //         id: 6, 
//     //         text: "กฎระเบียบใหม่มีผลกระทบต่อนักศึกษาอย่างไร?", 
//     //         categoryId: 6,
//     //         answers: []  // ยังไม่มีคำตอบสำหรับคำถามนี้
//     //     },
//     // ];

//     const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     totalItems: 0,
//     totalPages: 0,
//     currentPage: 1,
//     itemsPerPage: 10
//   });

//   // กำหนดข้อมูลหมวดหมู่
// //   const categories = [
// //     { id: 1, name: "ทั่วไป", icon: "graduation-cap" },
// //     { id: 2, name: "การเงิน", icon: "graduation-cap" },
// //     { id: 3, name: "อาจารย์", icon: "graduation-cap" },
// //     { id: 4, name: "การศึกษา", icon: "graduation-cap" },
// //     { id: 5, name: "กิจกรรม", icon: "graduation-cap" },
// //     { id: 6, name: "ระเบียบ", icon: "graduation-cap" },
// //   ];

//   // สร้างฟังก์ชันสำหรับดึงข้อมูลจาก API
//   const fetchQuestions = async (pageNumber = 1 , limit = 10) => {
//     try {
//       setLoading(true);
//       setError(null); // รีเซ็ตข้อผิดพลาดเมื่อเริ่มการโหลดใหม่
//       const offset = (pageNumber - 1) * limit;
//       const response = await fetch(
//         `http://localhost:3001/api/admin/topic?offset=${offset}&limit=${limit}`
//       );
      
//       if (!response.ok) {
//         throw new Error(`ไม่สามารถดึงข้อมูลได้: ${response.statusText}`);
//       }
      
//       const result = await response.json();
      
//       // ตรวจสอบว่า result.data เป็น array หรือไม่
//       if (!Array.isArray(result.data)) {
//         throw new Error("รูปแบบข้อมูลไม่ถูกต้อง: ข้อมูลไม่ใช่อาร์เรย์");
//       }
      
//       // แปลงข้อมูลจาก API ให้อยู่ในรูปแบบที่ต้องการใช้งาน
//       const formattedQuestions = result.data.map(item => ({
//         id: item.id,
//         text: item.title || "ไม่มีหัวข้อ", // กำหนดค่าเริ่มต้นเพื่อป้องกันค่า null/undefined
//         categoryId: item.category_id || 1, // ถ้า API มีหมวดหมู่ให้ใช้ค่านั้น ไม่งั้นให้ใช้ค่าเริ่มต้น
//         status: item.status,
//         postedBy: item.posted_by,
//         createdAt: item.created_at,
//         isApproved: item.is_approved,
//         answers: Array.isArray(item.answer) ? item.answer.map(ans => ({
//           id: ans.id,
//           text: ans.answer_text || "ไม่มีข้อความ", // กำหนดค่าเริ่มต้น
//           user: { name: ans.answered_by || "ไม่ระบุชื่อ" }, // กำหนดค่าเริ่มต้น
//           createdAt: ans.created_at,
//           status: ans.status
//         })) : [] // ถ้า item.answer ไม่ใช่อาร์เรย์ให้กำหนดเป็นอาร์เรย์ว่าง
//       }));
      
//       console.log("ข้อมูลที่ได้จาก API (หลังแปลง):", formattedQuestions);
      
//       // อัพเดท state
//       setQuestions(formattedQuestions);
//       if (result.pagination) {
//         setPagination({
//           totalItems: result.pagination.total || 0,
//           totalPages: Math.ceil((result.pagination.total || 0) / limit),
//           currentPage: pageNumber,
//           itemsPerPage: limit
//         });
//       }
//       setLoading(false);
//     } catch (err) {
//       console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
//       setError(err.message);
//       setLoading(false);
//       // ตั้งค่า questions เป็นอาร์เรย์ว่างเมื่อเกิดข้อผิดพลาด
//       setQuestions([]);
//     }
//   };

//  // ฟังก์ชันสำหรับเปลี่ยนหน้า
//  const handlePageChange = (pageNumber) => {
//     console.log(`กำลังเปลี่ยนไปหน้า ${pageNumber}`);
//     fetchQuestions(pageNumber, pagination.itemsPerPage);
//   };
//   console.log("asdadada : ",questions)
//   // เรียกใช้ API เมื่อ component ถูกโหลด
//   useEffect(() => {
//     fetchQuestions(1, 10);
//   }, []);

//   // ฟังก์ชันสำหรับรีเฟรชข้อมูล (เพิ่มเติม)
//   const refreshData = () => {
//     fetchQuestions(1, pagination.itemsPerPage);
//   };

// if (loading) {
//     return (
//       <div className="flex flex-row">
//         <div className="fixed top-0">
//           <Sidebar />
//         </div>
//         <div className="ms-56 w-full gap-5 p-5 flex flex-col">
//           <div className="bg-white flex items-center p-5 w-full drop-shadow rounded-2xl">
//             <h1 className="text-2xl font-semibold">กระดู่คำถาม</h1>
//           </div>
//           <div className="bg-white p-5 rounded-2xl drop-shadow text-center">
//             <p>กำลังโหลดข้อมูล...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ตรวจสอบว่า questions เป็น array และมีข้อมูลก่อนส่งให้ component
//   console.log("ส่งข้อมูลไปยัง QuestionsIndex จำนวน:", questions.length, "รายการ");

//   return (
//     <div className="flex flex-row">
//       <div className="fixed top-0">
//         <Sidebar />
//       </div>
      
//       <div className="ms-56 w-full gap-5 p-5 flex flex-col">
//         {/* Header */}
//         <div className="bg-white flex items-center p-5 w-full drop-shadow rounded-2xl">
//           <h1 className="text-2xl font-semibold">กระดู่คำถาม</h1>
//         </div>

//         {error ? (
//           <div className="bg-white p-5 rounded-2xl drop-shadow">
//             <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>
//             <button 
//               className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
//               onClick={() => fetchQuestions()}
//             >
//               ลองใหม่
//             </button>
//           </div>
//         ) : (
//           <QuestionsIndex 
            
//             questions={questions} 
//             pagination={pagination}
//             onPageChange={handlePageChange}
//             onRefresh={() => fetchQuestions(pagination.currentPage, pagination.itemsPerPage)} 
//           /> //categories={categories} 
//         )}
//       </div>
//     </div>
//   );
// };


// export default Questions;


"use client";
import Sidebar from "@/components/sidebar";
import QuestionsIndex from "@/components/forum/index";
import { useState, useEffect } from "react";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10
  });

  // สร้างฟังก์ชันสำหรับดึงข้อมูลจาก API
  const fetchQuestions = async (pageNumber = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null); // รีเซ็ตข้อผิดพลาดเมื่อเริ่มการโหลดใหม่
      const offset = (pageNumber - 1) * limit;
      
      console.log(`กำลังเรียกข้อมูลจาก API: หน้า ${pageNumber}, limit ${limit}, offset ${offset}`);
      
      const response = await fetch(
        `http://localhost:3001/api/admin/topic?offset=${offset}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`ไม่สามารถดึงข้อมูลได้: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("ข้อมูลที่ได้จาก API:", result);
      
      // ตรวจสอบว่า result.data เป็น array หรือไม่
      if (!Array.isArray(result.data)) {
        throw new Error("รูปแบบข้อมูลไม่ถูกต้อง: ข้อมูลไม่ใช่อาร์เรย์");
      }
      
      // แปลงข้อมูลจาก API ให้อยู่ในรูปแบบที่ต้องการใช้งาน
      const formattedQuestions = result.data.map(item => ({
        id: item.id,
        text: item.title || "ไม่มีหัวข้อ", // กำหนดค่าเริ่มต้นเพื่อป้องกันค่า null/undefined
        categoryId: item.category_id || 1, // ถ้า API มีหมวดหมู่ให้ใช้ค่านั้น ไม่งั้นให้ใช้ค่าเริ่มต้น
        status: item.status,
        postedBy: item.posted_by,
        createdAt: item.created_at,
        isApproved: item.is_approved,
        answers: Array.isArray(item.answer) ? item.answer.map(ans => ({
          id: ans.id,
          text: ans.answer_text || "ไม่มีข้อความ", // กำหนดค่าเริ่มต้น
          user: { name: ans.answered_by || "ไม่ระบุชื่อ" }, // กำหนดค่าเริ่มต้น
          createdAt: ans.created_at,
          status: ans.status
        })) : [] // ถ้า item.answer ไม่ใช่อาร์เรย์ให้กำหนดเป็นอาร์เรย์ว่าง
      }));
      
      console.log("Paginations :", result.pagination);
      
      // อัพเดท state
      setQuestions(formattedQuestions);
      
      // อัพเดท pagination
      if (result.pagination) {
        const paginationData = {
          totalItems: result.pagination.totalCount || 0,
          totalPages: result.pagination.totalPages,
          currentPage: pageNumber,
          itemsPerPage: limit
        };
        console.log("Pagination data:", paginationData);
        setPagination(paginationData);
      } else {
        console.warn("ไม่พบข้อมูล pagination จาก API");
        // กำหนดค่าเริ่มต้นถ้าไม่มีข้อมูล pagination
        setPagination({
          totalItems: formattedQuestions.length,
          totalPages: 20,
          currentPage: 1,
          itemsPerPage: limit
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
      setError(err.message);
      setLoading(false);
      // ตั้งค่า questions เป็นอาร์เรย์ว่างเมื่อเกิดข้อผิดพลาด
      setQuestions([]);
      
      // กำหนดค่าเริ่มต้นสำหรับ pagination เมื่อเกิดข้อผิดพลาด
      setPagination({
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10
      });
    }
  };

  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePageChange = (pageNumber) => {
    console.log(`กำลังเปลี่ยนไปหน้า ${pageNumber}`);
    fetchQuestions(pageNumber, pagination.itemsPerPage);
  };
 
  // เรียกใช้ API เมื่อ component ถูกโหลด
  useEffect(() => {
    console.log("Component mounted - เรียกข้อมูลครั้งแรก");
    fetchQuestions(1, 10);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-row">
        <div className="fixed top-0">
          <Sidebar />
        </div>
        <div className="ms-56 w-full gap-5 p-5 flex flex-col">
          <div className="bg-white flex items-center p-5 w-full drop-shadow rounded-2xl">
            <h1 className="text-2xl font-semibold">กระดู่คำถาม</h1>
          </div>
          <div className="bg-white p-5 rounded-2xl drop-shadow text-center">
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  // ตรวจสอบข้อมูลก่อนส่งให้ QuestionsIndex
  console.log("ส่งข้อมูลไปยัง QuestionsIndex จำนวน:", questions.length, "รายการ");
  console.log("ส่งข้อมูล pagination:", pagination);

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

        {error ? (
          <div className="bg-white p-5 rounded-2xl drop-shadow">
            <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>
            <button 
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              onClick={() => fetchQuestions(1, pagination.itemsPerPage)}
            >
              ลองใหม่
            </button>
          </div>
        ) : (
          <QuestionsIndex 
            questions={questions} 
            pagination={pagination}
            onPageChange={handlePageChange}
            onRefresh={() => fetchQuestions(pagination.currentPage, pagination.itemsPerPage)} 
          />
        )}
      </div>
    </div>
  );
};

export default Questions;