"use client";

import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  Video,
  FileImage,
} from "lucide-react";

const DocumentList = ({
  documents,
  pagination,
  isLoading,
  onAddNew,
  onEdit,
  onDelete,
  onView,
  onPageChange,
  onDownload,
}) => {
  // Convert empty documents to empty array
  const allDocuments = documents || [];

  // Add search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState(allDocuments);
  const [typeFilter, setTypeFilter] = useState("");

  // Filter documents when search query or type filter changes
  useEffect(() => {
    const filtered = allDocuments.filter((doc) => {
      const matchesSearch =
        doc.title &&
        doc.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        typeFilter === "" ||
        (doc.type && doc.type.toLowerCase() === typeFilter.toLowerCase());
      return matchesSearch && matchesType;
    });
    setFilteredDocuments(filtered);
  }, [searchQuery, typeFilter, allDocuments]);

  // Handler for search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handler for file type filter changes
  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
  };

  // ฟังก์ชันแสดงไอคอนตามประเภทเอกสาร
  const renderTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "video":
        return <Video className="text-blue-500 mr-2" size={18} />;
      case "image":
        return <FileImage className="text-purple-500 mr-2" size={18} />;
      default:
        return <FileText className="text-gray-500 mr-2" size={18} />;
    }
  };

  // ฟังก์ชันสำหรับกำหนดสีของ badge ตามประเภทไฟล์
  const getTypeBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "video":
        return "bg-blue-100 text-blue-800";
      case "image":
        return "bg-purple-100 text-purple-800";
      case "pdf":
        return "bg-red-100 text-red-800";
      case "document":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ฟังก์ชันสำหรับแปลงเวลาให้อยู่ในรูปแบบที่เหมาะสม
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  // คำนวณหน้าที่แสดงปัจจุบัน
  const currentPage = pagination
    ? Math.floor(pagination.offset / pagination.limit) + 1
    : 1;
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.limit)
    : 1;

  // สร้าง array สำหรับแสดงปุ่มหน้า
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      // ถ้าจำนวนหน้าทั้งหมดน้อยกว่าจำนวนปุ่มสูงสุด แสดงทุกหน้า
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // แสดงปุ่มแบบมีจุดไข่ปลา
      if (currentPage <= 3) {
        // หน้าแรกๆ
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // หน้าท้ายๆ
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // หน้ากลางๆ
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  // Handler for page change
  // const handlePageChange = (page) => {
  //   console.log(page)
  //   if (page < 1 || page > totalPages) return;
  //   onPageChange(page);
  // };

  // ปรับปรุงฟังก์ชัน handlePageChange
const handlePageChange = (page) => {
  // แปลงค่า page เป็น integer เพื่อป้องกันการรับค่าผิดพลาด
  const newPage = parseInt(page, 10);
  
  // ตรวจสอบว่าค่าเป็นตัวเลขที่ถูกต้องหรือไม่
  if (isNaN(newPage)) {
    console.error("Page value is not a valid number");
    return;
  }
  
  // ตรวจสอบว่าอยู่ในขอบเขตหรือไม่
  if (newPage < 1 || newPage > totalPages) {
    console.log(`Page ${newPage} is out of range (1-${totalPages})`);
    return;
  }
  
  // เรียกใช้ callback หากผ่านการตรวจสอบทั้งหมด
  console.log(`Changing to page ${newPage}`);
  onPageChange(newPage);
};

  return (
    <div className="bg-white rounded-md shadow-sm">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-medium">คลังความรู้ออนไลน์</h1>
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded-md transition"
          onClick={onAddNew}
        >
          + เพิ่มเอกสาร
        </button>
      </div>

      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาเอกสาร..."
                className="pl-10 pr-3 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              className="pl-3 pr-6 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-green-500"
              value={typeFilter}
              onChange={handleTypeChange}
            >
              <option value="">ทั้งหมด</option>
              <option value="video">วิดีโอ</option>
              <option value="image">รูปภาพ</option>
              <option value="document">เอกสาร</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            กำลังโหลดข้อมูล...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery || typeFilter
              ? "ไม่พบเอกสารที่ตรงกับเงื่อนไขการค้นหา"
              : "ไม่พบข้อมูลเอกสาร"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อเอกสาร
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ประเภท
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ผู้เขียน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่เผยแพร่
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderTypeIcon(document.type)}
                        <span
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => onView(document)}
                        >
                          {document.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(
                          document.type
                        )}`}
                      >
                        {document.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {document.author || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(document.published_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-2 inline-flex items-center"
                        onClick={() => onDownload(document.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        ดาวน์โหลด
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        onClick={() => onEdit(document)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => onDelete(document.id)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Component */}
            {pagination && pagination.total > 0 && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      แสดง{" "}
                      <span className="font-medium">
                        {pagination.offset + 1}
                      </span>{" "}
                      ถึง{" "}
                      <span className="font-medium">
                        {Math.min(
                          pagination.offset + pagination.limit,
                          pagination.total
                        )}
                      </span>{" "}
                      จากทั้งหมด{" "}
                      <span className="font-medium">{pagination.total}</span>{" "}
                      รายการ
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      {/* ปุ่มย้อนกลับ */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                          }`}
                      >
                        <span className="sr-only">ก่อนหน้า</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>

                      {/* ปุ่มหมายเลขหน้า */}
                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border ${page === currentPage
                              ? "bg-green-50 border-green-500 text-green-600 z-10"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            } text-sm font-medium`}
                        >
                          {page}
                        </button>
                      ))}

                      {/* ปุ่มไปข้างหน้า */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                          }`}
                      >
                        <span className="sr-only">ถัดไป</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Mobile pagination */}
                <div className="flex w-full sm:hidden justify-between">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                        ? "text-gray-300 bg-gray-100"
                        : "text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                  >
                    ก่อนหน้า
                  </button>
                  <p className="text-sm text-gray-700 py-2">
                    หน้า {currentPage} จาก {totalPages}
                  </p>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
                        ? "text-gray-300 bg-gray-100"
                        : "text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                  >
                    ถัดไป
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;
