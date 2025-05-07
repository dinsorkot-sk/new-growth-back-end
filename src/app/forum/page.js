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
        `${process.env.NEXT_PUBLIC_API}/topic?offset=${offset}&limit=${limit}`
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