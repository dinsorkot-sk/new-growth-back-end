"use client";

import { useState, useEffect, useCallback } from "react";
import Form from "./form";
import List from "./list";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const DocumentIndex = () => {
  const router = useRouter();
  const [view, setView] = useState("list"); // list หรือ form
  const [currentDocument, setCurrentDocument] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(""); // เพิ่ม state สำหรับเก็บประเภทที่เลือก
  const [pagination, setPagination] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });

  // Wrap fetchDocuments in useCallback
  const fetchDocuments = useCallback(async (offset = 0, limit = 10) => {
    setIsLoading(true);
    try {
      const token = Cookies.get("auth-token");
      if (!token) {
        router.push("/admin/login");
      }
      
      // สร้าง URL พร้อม query parameters
      let url = `${process.env.NEXT_PUBLIC_IMG}/api/document/getallDocumentAndResouceVideo?offset=${offset}&limit=${limit}`;
      if (selectedType) {
        url += `&type=${selectedType}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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
  }, [router, selectedType]);

  // เรียกข้อมูลเมื่อ component โหลดครั้งแรก
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // ฟังก์ชันเมื่อมีการเปลี่ยนหน้า
  const handlePageChange = (page) => {
    const newOffset = (page - 1) * pagination.limit;
    console.log(`Changing to page ${page}, offset: ${newOffset}, limit: ${pagination.limit}`);
    fetchDocuments(newOffset, pagination.limit);
  };

  // เพิ่มฟังก์ชันสำหรับจัดการการเปลี่ยนประเภท
  const handleTypeChange = (type) => {
    setSelectedType(type);
    // รีเซ็ต pagination และโหลดข้อมูลใหม่
    setPagination(prev => ({ ...prev, offset: 0 }));
    fetchDocuments(0, pagination.limit);
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
      const token = Cookies.get("auth-token");
      if (!token) {
        router.push("/admin/login");
      }
      const formDataToSend = new FormData();
      
      // Check if the file is a video
      const isVideo = formData.file?.type?.includes('video/');
      
      if (isVideo) {
        // Handle video upload
        formDataToSend.append("video_file", formData.file);
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("duration", String(formData.duration || 0));
        formDataToSend.append("author", formData.author || "cat");
        formDataToSend.append("status", formData.status || "show");
        formDataToSend.append("is_downloadable", formData.is_downloadable === 1 ? "true" : "false");
        formDataToSend.append("uploadedFileName", formData.uploadedFileName);

        if (currentDocument) {
          await axios.put(
            `${process.env.NEXT_PUBLIC_API}/video/update-video/${formData.id}`,
            formDataToSend,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        } else {
          await axios({
            method: "post",
            url: `${process.env.NEXT_PUBLIC_API}/video/upload-video`,
            data: formDataToSend,
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
      } else {
        // Handle document upload
        formDataToSend.append("document_file", formData.file);
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description || "");
        formDataToSend.append("type", formData.type || "Document");
        formDataToSend.append("author", formData.author || "cat");
        formDataToSend.append("status", formData.status || "show");
        formDataToSend.append("is_downloadable", formData.is_downloadable === 1 ? "true" : "false");

        if (currentDocument) {
          await axios.put(
            `${process.env.NEXT_PUBLIC_API}/document/update-document/${formData.id}`,
            formDataToSend,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        } else {
          await axios({
            method: "post",
            url: `${process.env.NEXT_PUBLIC_API}/document/upload-document`,
            data: formDataToSend,
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
      }

      // Reload data after save
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
        const token = Cookies.get("auth-token");
        if (!token) {
          router.push("/admin/login");
        }
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API}/video/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
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
      const token = Cookies.get("auth-token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      // Find the document to get its type
      const docItem = documents.find(doc => doc.id === id);
      if (!docItem) {
        throw new Error("Document not found");
      }

      // Choose the appropriate endpoint based on document type
      const downloadUrl = docItem.type?.toLowerCase() === 'video' 
        ? `${process.env.NEXT_PUBLIC_IMG}/api/video/downloadVideo/${id}`
        : `${process.env.NEXT_PUBLIC_IMG}/api/document/downloadDocument/${id}`;
      
      // Get the file extension and MIME type
      const fileExtension = docItem.files?.[0]?.file_type || 
                          (docItem.type?.toLowerCase() === 'video' ? 'mp4' : 
                          docItem.type?.toLowerCase() === 'pdf' ? 'pdf' : 
                          docItem.type?.toLowerCase() === 'image' ? 'jpg' : 'doc');
      
      // Create a temporary link element
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = downloadUrl; // ชี้ link ไปยัง URL ของเซิร์ฟเวอร์โดยตรง
      link.download = `${docItem.title || 'file'}.${fileExtension}`;
      
      // Append to body, click, and cleanup
      document.body.appendChild(link);
      link.click();
      
      // Cleanup: ลบลิงก์ออกจาก DOM ทันที ไม่ต้องใช้ setTimeout
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error downloading file:", error);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์: " + error.message);
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
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
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
