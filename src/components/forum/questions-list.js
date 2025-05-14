"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, MessageCircle, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useSearchParams } from 'next/navigation';

const QuestionsList = ({ questions, onUpdateAnswerStatus, onDeleteAnswer }) => {
    const searchParams = useSearchParams();
    const questionId = searchParams.get('questionId');
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const [confirmDeleteTopic, setConfirmDeleteTopic] = useState(null);

    const handleDeleteTopic = async (topicId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/topic/${topicId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`ไม่สามารถลบกระทู้ได้: ${response.statusText}`);
            }

            // Refresh the page or update the questions list
            window.location.reload();
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการลบกระทู้:", error);
            alert(error.message);
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl overflow-hidden drop-shadow">
                {questions.length > 0 ? (
                    questions.map((question, index) => (
                        <QuestionItem 
                            key={question.id} 
                            question={question} 
                            isLast={index === questions.length - 1}
                            onUpdateAnswerStatus={onUpdateAnswerStatus}
                            onDeleteAnswer={onDeleteAnswer}
                            isAutoExpanded={questionId && question.id.toString() === questionId}
                            targetAnswerId={hash.replace('#answer-', '')}
                            onDeleteTopic={handleDeleteTopic}
                            setConfirmDeleteTopic={setConfirmDeleteTopic}
                        />
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        ไม่พบคำถามที่ตรงกับเงื่อนไขที่เลือก
                    </div>
                )}
            </div>

            {confirmDeleteTopic && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h3 className="text-lg font-semibold mb-4">ยืนยันการลบกระทู้</h3>
                        <p className="text-gray-600 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบกระทู้นี้? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                onClick={() => setConfirmDeleteTopic(null)}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => {
                                    handleDeleteTopic(confirmDeleteTopic);
                                    setConfirmDeleteTopic(null);
                                }}
                            >
                                ยืนยัน
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const QuestionItem = ({ question, isLast, onUpdateAnswerStatus, onDeleteAnswer, isAutoExpanded, targetAnswerId, onDeleteTopic, setConfirmDeleteTopic }) => {
    const [isOpen, setIsOpen] = useState(isAutoExpanded);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        if (isAutoExpanded && targetAnswerId) {
            // รอให้ DOM โหลดเสร็จก่อนที่จะเลื่อนไปที่คำตอบ
            setTimeout(() => {
                const answerElement = document.getElementById(`answer-${targetAnswerId}`);
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
    }, [isAutoExpanded, targetAnswerId]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleToggleStatus = (answerId, currentStatus) => {
        // เรียกใช้ฟังก์ชันสำหรับอัปเดตสถานะ
        if (onUpdateAnswerStatus) {
            onUpdateAnswerStatus(question.id, answerId, currentStatus === 'show' ? 'hide' : 'show');
        }
    };

    const showDeleteConfirm = (answerId) => {
        setConfirmDelete(answerId);
    };

    const cancelDelete = () => {
        setConfirmDelete(null);
    };

    const confirmDeleteAnswer = (answerId) => {
        // เรียกใช้ฟังก์ชันสำหรับลบคำตอบ
        if (onDeleteAnswer) {
            onDeleteAnswer(question.id, answerId);
        }
        setConfirmDelete(null);
    };

    return (
        <div className={`${!isLast ? 'border-b border-gray-200' : ''}`}>
            <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={toggleOpen}
            >
                <div className="flex-1">
                    <h3 className="text-gray-700 font-medium">{question.text}</h3>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                        <MessageCircle size={16} className="mr-1" />
                        <span>{question.answers?.length || 0} คำตอบ</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="p-1 rounded hover:bg-gray-100 text-red-500"
                        onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteTopic(question.id);
                        }}
                        title="ลบกระทู้"
                    >
                        <Trash2 size={20} />
                    </button>
                    <div className="text-gray-500">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="bg-gray-50 px-4 py-2">
                    {question.answers && question.answers.length > 0 ? (
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">คำตอบ:</h4>
                            {question.answers.map((answer) => (
                                <div 
                                    key={answer.id} 
                                    id={`answer-${answer.id}`}
                                    className={`bg-white p-4 rounded-lg shadow-sm ${
                                        targetAnswerId && answer.id.toString() === targetAnswerId ? 'border-2 border-blue-500' : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-2">
                                                {answer.user?.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-medium">{answer.user?.name || "ผู้ใช้"}</p>
                                                <p className="text-xs text-gray-500">{answer.createdAt ? new Date(answer.createdAt).toLocaleDateString('th-TH') : "ไม่ระบุวันที่"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* ปุ่มเปิด/ปิดสถานะ */}
                                            <button 
                                                className={`p-1 rounded hover:bg-gray-100 ${answer.status === 'show' ? 'text-green-500' : 'text-gray-400'}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleStatus(answer.id, answer.status);
                                                }}
                                                title={answer.status === 'show' ? 'คลิกเพื่อปิดการใช้งาน' : 'คลิกเพื่อเปิดการใช้งาน'}
                                            >
                                                {answer.status === 'show' ? 
                                                    <ToggleRight size={25} /> : 
                                                    <ToggleLeft size={25} />
                                                }
                                            </button>
                                            
                                            {/* ปุ่มลบ */}
                                            <button 
                                                className="p-1 rounded hover:bg-gray-100 text-red-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showDeleteConfirm(answer.id);
                                                }}
                                                title="ลบคำตอบ"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{answer.text}</p>
                                    {/* แสดงสถานะของคำตอบ */}
                                    <div className="mt-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            answer.status === 'show' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {answer.status === 'show' ? 'กำลังแสดง' : 'ซ่อนอยู่'}
                                        </span>
                                    </div>
                                    
                                    {/* กล่องยืนยันการลบ */}
                                    {confirmDelete === answer.id && (
                                        <div className="mt-2 p-3 bg-red-50 rounded border border-red-200">
                                            <p className="text-red-700 mb-2">ยืนยันการลบคำตอบนี้?</p>
                                            <div className="flex gap-2 justify-end">
                                                <button 
                                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        cancelDelete();
                                                    }}
                                                >
                                                    ยกเลิก
                                                </button>
                                                <button 
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        confirmDeleteAnswer(answer.id);
                                                    }}
                                                >
                                                    ยืนยัน
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            ยังไม่มีคำตอบสำหรับคำถามนี้
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuestionsList;