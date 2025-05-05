// เขียนใน /components/forum/paginations.js

import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // แสดง console log เพื่อตรวจสอบค่าที่ได้รับ
    console.log("Pagination Props:", { currentPage, totalPages });
    
    // ฟังก์ชันสร้างปุ่มหน้า
    const renderPageButtons = () => {
        const buttons = [];
        
        // ถ้าไม่มีหน้าทั้งหมด หรือหน้าปัจจุบันไม่ถูกต้อง ให้แสดงเพียงปุ่มเดียว
        if (!totalPages || totalPages <= 0 || !currentPage) {
            return <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>;
        }
        
        // แสดงปุ่มก่อนหน้า
        buttons.push(
            <button
                key="prev"
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                    currentPage === 1 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-300'
                }`}
            >
                &laquo;
            </button>
        );
        
        // แสดงปุ่มหน้าแรก
        if (currentPage > 3) {
            buttons.push(
                <button
                    key={1}
                    onClick={() => onPageChange(1)}
                    className="px-3 py-1 bg-white text-blue-600 hover:bg-blue-50 border border-gray-300 rounded"
                >
                    1
                </button>
            );
            
            // แสดง ... ถ้าจำเป็น
            if (currentPage > 4) {
                buttons.push(
                    <span key="ellipsis1" className="px-3 py-1">
                        ...
                    </span>
                );
            }
        }
        
        // แสดงปุ่มรอบๆ หน้าปัจจุบัน
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-3 py-1 rounded ${
                        i === currentPage 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-300'
                    }`}
                >
                    {i}
                </button>
            );
        }
        
        // แสดง ... ถ้าจำเป็น
        if (currentPage < totalPages - 3) {
            buttons.push(
                <span key="ellipsis2" className="px-3 py-1">
                    ...
                </span>
            );
        }
        
        // แสดงปุ่มหน้าสุดท้าย
        if (currentPage < totalPages - 2 && totalPages > 1) {
            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => onPageChange(totalPages)}
                    className="px-3 py-1 bg-white text-blue-600 hover:bg-blue-50 border border-gray-300 rounded"
                >
                    {totalPages}
                </button>
            );
        }
        
        // แสดงปุ่มถัดไป
        buttons.push(
            <button
                key="next"
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                    currentPage === totalPages 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-300'
                }`}
            >
                &raquo;
            </button>
        );
        
        return buttons;
    };
    
    return (
        <div className="bg-white p-4 rounded-2xl drop-shadow flex justify-center">
            <div className="flex space-x-2">
                {renderPageButtons()}
            </div>
        </div>
    );
};

export default Pagination;