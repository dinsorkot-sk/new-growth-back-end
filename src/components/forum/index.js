"use client";

import { useState, useEffect } from "react";
import QuestionsList from "./questions-list";
import CategoryList from "./category-list";
import AddQuestionModal from "./add-question-modal";
import Pagination from "./paginations";
import { useSearchParams, useRouter } from 'next/navigation';
import Cookies from "js-cookie";

const QuestionsIndex = ({ questions: initialQuestions, pagination, onPageChange, onRefresh }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [questions, setQuestions] = useState(initialQuestions || []);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // เพิ่ม useEffect เพื่ออัพเดต questions เมื่อ initialQuestions เปลี่ยนแปลง
    useEffect(() => {
        if (initialQuestions) {
            setQuestions(initialQuestions);
        }
    }, [initialQuestions]);

    // เพิ่ม useEffect สำหรับจัดการ URL parameters
    useEffect(() => {
        const questionId = searchParams.get('questionId');
        const hash = window.location.hash;
        
        if (questionId && hash) {
            // รอให้ DOM โหลดเสร็จก่อนที่จะเลื่อนไปที่คำตอบ
            setTimeout(() => {
                const answerElement = document.querySelector(hash);
                if (answerElement) {
                    answerElement.scrollIntoView({ behavior: 'smooth' });
                    // เพิ่ม highlight effect
                    answerElement.classList.add('bg-yellow-50');
                    setTimeout(() => {
                        answerElement.classList.remove('bg-yellow-50');
                    }, 2000);
                }
            }, 500);
        }
    }, [searchParams]);
    
    // กรองคำถามตามหมวดหมู่ที่เลือกและคำค้นหา (ถ้ามี)
    const filteredQuestions = questions.filter(question => {
        // กรองตามหมวดหมู่ถ้ามีการเลือกหมวดหมู่
        const matchesCategory = selectedCategory 
            ? question.categoryId === selectedCategory.id 
            : true;
            
        // กรองตามคำค้นหาถ้ามีการกรอกข้อความค้นหา
        const matchesSearch = searchTerm && question.text
            ? question.text.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
            
        return matchesCategory && matchesSearch;
    });
    
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };
    
    const handleSearch = (term) => {
        setSearchTerm(term);
    };
    
    const handleAddQuestion = () => {
        // เปิด modal สำหรับเพิ่มคำถามใหม่
        setShowModal(true);
    };
    
    const handleSaveQuestion = (newQuestion) => {
        // สร้าง ID ใหม่โดยใช้ค่าสูงสุดของ ID ที่มีอยู่ + 1
        const newId = Math.max(...questions.map(q => q.id || 0), 0) + 1;
        
        // สร้างคำถามใหม่พร้อม ID
        const questionToAdd = {
            id: newId,
            text: newQuestion.text,
            categoryId: newQuestion.categoryId,
            createdAt: new Date().toISOString(),
            answers: []
        };
        
        // เพิ่มคำถามใหม่ไว้ด้านบนสุดของรายการ
        setQuestions([questionToAdd, ...questions]);
        
        // ปิด modal
        setShowModal(false);
        
        // รีเฟรชข้อมูลจาก API ถ้ามีฟังก์ชัน onRefresh
        if (onRefresh) {
            onRefresh();
        }
    };
    
    const handlePageChange = (page) => {
        console.log("Changing to page:", page);
        // เรียกใช้ฟังก์ชันจาก props เพื่อเปลี่ยนหน้า
        if (onPageChange) {
            onPageChange(page);
        }
    };

    // ฟังก์ชันสำหรับอัปเดตสถานะคำตอบ
    const handleUpdateAnswerStatus = async (questionId, answerId, newStatus) => {
        console.log(newStatus, questionId, answerId);
        try {
            setIsLoading(true);
            setStatusMessage({ type: 'info', text: 'กำลังอัปเดตสถานะ...' });

            const authToken = Cookies.get('auth-token');
            if (!authToken) {
                router.push("/admin/login");
            }
            // เรียก API เพื่ออัปเดตสถานะ
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/answer/${answerId}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`ไม่สามารถอัปเดตสถานะได้: ${response.statusText}`);
            }

            // อัปเดตข้อมูลในหน้าแอป (ทำก่อนที่จะไปรีเฟรชข้อมูลจาก API)
            const updatedQuestions = questions.map(question => {
                if (question.id === questionId) {
                    const updatedAnswers = question.answers.map(answer => {
                        if (answer.id === answerId) {
                            return { ...answer, status: newStatus };
                        }
                        return answer;
                    });
                    return { ...question, answers: updatedAnswers };
                }
                return question;
            });
            
            setQuestions(updatedQuestions);
            setStatusMessage({ type: 'success', text: 'อัปเดตสถานะเรียบร้อยแล้ว' });
            
            // ล้างข้อความสถานะหลังจาก 2 วินาที
            setTimeout(() => {
                setStatusMessage(null);
            }, 2000);
            
            // รีเฟรชข้อมูลจาก API (ถ้าต้องการ)
            // if (onRefresh) {
            //    onRefresh();
            // }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ:", error);
            setStatusMessage({ type: 'error', text: `เกิดข้อผิดพลาด: ${error.message}` });
            
            // ล้างข้อความสถานะหลังจาก 3 วินาที
            setTimeout(() => {
                setStatusMessage(null);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    // ฟังก์ชันสำหรับลบคำตอบ
    const handleDeleteAnswer = async (questionId, answerId) => {
        try {
            setIsLoading(true);
            setStatusMessage({ type: 'info', text: 'กำลังลบคำตอบ...' });

            const authToken = Cookies.get('auth-token');

            // เรียก API เพื่อลบคำตอบ
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/answer/${answerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`ไม่สามารถลบคำตอบได้: ${response.statusText}`);
            }

            // อัปเดตข้อมูลในหน้าแอป
            const updatedQuestions = questions.map(question => {
                if (question.id === questionId) {
                    const updatedAnswers = question.answers.filter(answer => answer.id !== answerId);
                    return { ...question, answers: updatedAnswers };
                }
                return question;
            });
            
            setQuestions(updatedQuestions);
            setStatusMessage({ type: 'success', text: 'ลบคำตอบเรียบร้อยแล้ว' });
            
            // ล้างข้อความสถานะหลังจาก 2 วินาที
            setTimeout(() => {
                setStatusMessage(null);
            }, 2000);
            
            // รีเฟรชข้อมูลจาก API (ถ้าต้องการ)
            // if (onRefresh) {
            //    onRefresh();
            // }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการลบคำตอบ:", error);
            setStatusMessage({ type: 'error', text: `เกิดข้อผิดพลาด: ${error.message}` });
            
            // ล้างข้อความสถานะหลังจาก 3 วินาที
            setTimeout(() => {
                setStatusMessage(null);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    // ฟังก์ชันสำหรับเพิ่มคำตอบใหม่
    const handleAddAnswer = async (questionId, answerData) => {
        try {
            setIsLoading(true);
            setStatusMessage({ type: 'info', text: 'กำลังเพิ่มคำตอบ...' });

            const authToken = Cookies.get('auth-token');
            if (!authToken) {
                router.push("/admin/login");
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    topic_id: questionId,
                    answer_text: answerData.text,
                    answered_by: answerData.user,
                    status: "show"
                }),
            });

            if (!response.ok) {
                throw new Error(`ไม่สามารถเพิ่มคำตอบได้: ${response.statusText}`);
            }

            const newAnswer = await response.json();
            
            // อัปเดตข้อมูลในหน้าแอป
            const updatedQuestions = questions.map(question => {
                if (question.id === questionId) {
                    return {
                        ...question,
                        answers: [...question.answers, {
                            id: newAnswer.id,
                            text: newAnswer.answer_text,
                            user: { name: newAnswer.answered_by },
                            createdAt: newAnswer.created_at,
                            status: newAnswer.status
                        }]
                    };
                }
                return question;
            });
            
            setQuestions(updatedQuestions);
            setStatusMessage({ type: 'success', text: 'เพิ่มคำตอบเรียบร้อยแล้ว' });
            
            // ล้างข้อความสถานะหลังจาก 2 วินาที
            setTimeout(() => {
                setStatusMessage(null);
            }, 2000);
            
            // รีเฟรชข้อมูลจาก API
            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการเพิ่มคำตอบ:", error);
            setStatusMessage({ type: 'error', text: `เกิดข้อผิดพลาด: ${error.message}` });
            
            // ล้างข้อความสถานะหลังจาก 3 วินาที
            setTimeout(() => {
                setStatusMessage(null);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col gap-5">
            {/* Status Message */}
            {statusMessage && (
                <div className={`p-3 rounded-lg text-white ${
                    statusMessage.type === 'success' ? 'bg-green-500' :
                    statusMessage.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                    {statusMessage.text}
                </div>
            )}
            
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl drop-shadow">
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ค้นหาคำถาม..."
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
                        ค้นหา
                    </button>
                    <button 
                        className="bg-white border border-green-500 text-green-500 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        onClick={handleAddQuestion}
                    >
                        <span>เพิ่ม กระทู้คำถาม</span>
                    </button>
                </div>
            </div>
            
            {/* Loading Indicator */}
            {isLoading && (
                <div className="bg-white p-4 rounded-2xl drop-shadow flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
            )}
            
            {/* Questions List */}
            {filteredQuestions.length > 0 ? (
                <QuestionsList 
                    questions={filteredQuestions} 
                    onUpdateAnswerStatus={handleUpdateAnswerStatus}
                    onDeleteAnswer={handleDeleteAnswer}
                    onAddAnswer={handleAddAnswer}
                />
            ) : (
                <div className="bg-white p-4 rounded-2xl drop-shadow text-center">
                    <p className="text-gray-500">ไม่พบข้อมูลกระดู่คำถาม</p>
                </div>
            )}
            
            {/* Pagination Component */}
            {pagination && pagination.totalPages > 1 && (
                <Pagination 
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
            
            {/* Add Question Modal */}
            {showModal && (
                <AddQuestionModal 
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveQuestion}
                    selectedCategory={selectedCategory}
                    // categories={categories} // ถ้ามีข้อมูล categories
                />
            )}
        </div>
    );
};

export default QuestionsIndex;