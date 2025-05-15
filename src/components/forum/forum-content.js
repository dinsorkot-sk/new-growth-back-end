"use client";

import { useState, useEffect } from "react";
import QuestionsIndex from "./index";
import LoadingSpinner from "./loading";

const ForumContent = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10
  });

  const fetchQuestions = async (pageNumber = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const offset = (pageNumber - 1) * limit;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/topic?offset=${offset}&limit=${limit}&order=asc`
      );
      
      if (!response.ok) {
        throw new Error(`ไม่สามารถดึงข้อมูลได้: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!Array.isArray(result.data)) {
        throw new Error("รูปแบบข้อมูลไม่ถูกต้อง: ข้อมูลไม่ใช่อาร์เรย์");
      }
      
      const formattedQuestions = result.data.map(item => ({
        id: item.id,
        text: item.title || "ไม่มีหัวข้อ",
        categoryId: item.category_id || 1,
        status: item.status,
        postedBy: item.posted_by,
        createdAt: item.created_at,
        isApproved: item.is_approved,
        answers: Array.isArray(item.answer) ? item.answer.map(ans => ({
          id: ans.id,
          text: ans.answer_text || "ไม่มีข้อความ",
          user: { name: ans.answered_by || "ไม่ระบุชื่อ" },
          createdAt: ans.created_at,
          status: ans.status
        })) : []
      }));
      
      setQuestions(formattedQuestions);
      
      if (result.pagination) {
        setPagination({
          totalItems: result.pagination.totalCount || 0,
          totalPages: result.pagination.totalPages,
          currentPage: pageNumber,
          itemsPerPage: limit
        });
      } else {
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
      setQuestions([]);
      setPagination({
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10
      });
    }
  };

  const handlePageChange = (pageNumber) => {
    fetchQuestions(pageNumber, pagination.itemsPerPage);
  };
 
  useEffect(() => {
    fetchQuestions(1, 10);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-white p-5 rounded-2xl drop-shadow">
        <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>
        <button 
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          onClick={() => fetchQuestions(1, pagination.itemsPerPage)}
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  return (
    <QuestionsIndex 
      questions={questions} 
      pagination={pagination}
      onPageChange={handlePageChange}
      onRefresh={() => fetchQuestions(pagination.currentPage, pagination.itemsPerPage)} 
    />
  );
};

export default ForumContent; 