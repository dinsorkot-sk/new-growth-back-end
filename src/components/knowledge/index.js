"use client";

import { useState, useEffect } from "react";
import Form from "./form";
import List from "./list";
import axios from "axios";

const DocumentIndex = () => {
  const [view, setView] = useState("list"); // list หรือ form
  const [currentDocument, setCurrentDocument] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API
  const fetchDocuments = async (offset = 0, limit = 10) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/document/getallDocumentAndResouceVideo?offset=${offset}&limit=${limit}`
      );

      // ตรวจสอบว่ามีข้อมูลและโครงสร้างตามที่คาดหวังหรือไม่
      if (response.data && response.data.data) {
        setDocuments(response.data.data);
        setPagination(response.data.pagination);
      } else {
        console.error(
          "API response structure is not as expected:",
          response.data
        );
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // เรียกข้อมูลเมื่อ component โหลดครั้งแรก
  useEffect(() => {
    fetchDocuments();
  }, []);

  // ฟังก์ชันเมื่อมีการเปลี่ยนหน้า
  const handlePageChange = (page) => {
    // ตรวจสอบว่าหน้าที่เลือกอยู่ในขอบเขตหรือไม่
    
    // คำนวณ offset จากเลขหน้า
    // offset = (หน้าที่ต้องการ - 1) * จำนวนรายการต่อหน้า
    const newOffset = (page - 1) * pagination.limit;
    
    console.log(`Changing to page ${page}, offset: ${newOffset}, limit: ${pagination.limit}`);
    
    // เรียกฟังก์ชันดึงข้อมูลด้วย offset และ limit
    fetchDocuments(newOffset, pagination.limit);
  };

  const handleAddNew = () => {
    setCurrentDocument(null);
    setView("form");
  };

  const handleEdit = (document) => {
    setCurrentDocument(document);
    setView("form");
  };

  const handleView = (document) => {
    // ตรวจสอบว่ามีไฟล์หรือไม่
    if (document.files && document.files.length > 0) {
      // ใช้ไฟล์แรกเป็นตัวอย่าง (อาจปรับตามความเหมาะสม)
      const fileUrl = document.files[0].url;

      // ตรวจสอบประเภทไฟล์เพื่อเลือกวิธีการแสดงผล
      const fileType = document.type.toLowerCase();

      // ไฟล์ที่สามารถแสดงในเบราว์เซอร์ได้
      if (
        fileType === "pdf" ||
        fileType.includes("jpg") ||
        fileType.includes("jpeg") ||
        fileType.includes("png") ||
        fileType.includes("gif") ||
        fileType === "video"
      ) {
        // เปิดไฟล์ในแท็บใหม่
        window.open(fileUrl, "_blank");
      } else {
        // ไฟล์ประเภทอื่นๆ ที่อาจต้องดาวน์โหลด
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = document.title;
        link.click();
      }
    } else {
      // กรณีไม่มีไฟล์
      alert(`ไม่พบไฟล์สำหรับเอกสาร "${document.title}"`);
    }
  };

  const handleBack = () => {
    setView("list");
  };

  const handleSave = async (formData) => {
    try {
      //     const formData = new FormData();
      //   console.log(formData);

        const requestData = {
          vido_file: formData.file,
          title: formData.title,
          description: formData.description,
          duration: formData.duration || 0, // ใส่ค่า default ถ้าเป็น null
          author: formData.author || "cat",
          status: formData.status || "show",
          is_downloadable: true, // ใส่ตามที่ API ต้องการ
          uploadedFileName: formData.uploadedFileName,
        };

      const formDataToSend = new FormData();

      formDataToSend.append("video_file", formData.file);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("duration", String(formData.duration || 0));
      formDataToSend.append("author", formData.author || "cat");
      formDataToSend.append("status", formData.status || "show");
      formDataToSend.append("is_downloadable", "true"); // ส่งเป็น string
      formDataToSend.append("uploadedFileName", formData.uploadedFileName);

      console.log("formData JSON:", JSON.stringify(formData));
      console.log("www", requestData);

      if (currentDocument) {
        // แก้ไขเอกสารที่มีอยู่
        await axios.put(
          `${process.env.NEXT_PUBLIC_API}/video/update-video/${formData.id}`,
          requestData
        );
      } else {
        // เพิ่มเอกสารใหม่
        await axios({
          method: "post",
          url: `${process.env.NEXT_PUBLIC_API}/video/upload-video`,
          data: formDataToSend
        });
      }

      // โหลดข้อมูลใหม่หลังบันทึก
      fetchDocuments(pagination.offset, pagination.limit);
      setView("list");
    } catch (error) {
      console.error("Error saving document:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณต้องการลบเอกสารนี้ใช่หรือไม่?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API}/video/delete/${id}`
        );

        // โหลดข้อมูลใหม่หลังลบ
        fetchDocuments(pagination.offset, pagination.limit);
      } catch (error) {
        console.error("Error deleting document:", error);
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      console.log("download", id);
      // Ensure the API URL is properly formatted
      const downloadUrl = `${process.env.NEXT_PUBLIC_IMG}/api/video/downloadVideo/${id}`;
      
      // ทำการเรียก API เพื่อดาวน์โหลดไฟล์
      const response = await axios.get(downloadUrl, {
        responseType: "blob", // สำคัญมาก - ต้องระบุ responseType เป็น 'blob' สำหรับการดาวน์โหลดไฟล์
      });

      // Check if we have valid response data
      if (!response.data) {
        throw new Error("No data received from server");
      }

      // สร้าง URL object จาก blob response
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      // สร้าง element <a> สำหรับดาวน์โหลด
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || `file-${id}.mp4`); // กำหนดชื่อไฟล์ดาวน์โหลด

      // แนบ element เข้ากับ DOM, คลิก, และลบออก
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // ล้าง URL object เพื่อปล่อยหน่วยความจำ
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์");
    }
  };

  return (
    <div>
      {view === "list" ? (
        <List
          documents={documents}
          pagination={pagination}
          isLoading={isLoading}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onPageChange={handlePageChange}
          onDownload={handleDownload}
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
