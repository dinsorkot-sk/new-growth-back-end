
// "use client";
// import { useState } from "react";
// import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

// const QuestionsList = ({ questions }) => {
//     return (
//         <div className="bg-white rounded-2xl overflow-hidden drop-shadow">
//             {questions.length > 0 ? (
//                 questions.map((question, index) => (
//                     <QuestionItem 
//                         key={question.id} 
//                         question={question} 
//                         isLast={index === questions.length - 1}
//                     />
//                 ))
//             ) : (
//                 <div className="p-8 text-center text-gray-500">
//                     ไม่พบคำถามที่ตรงกับเงื่อนไขที่เลือก
//                 </div>
//             )}
//         </div>
//     );
// };

// const QuestionItem = ({ question, isLast }) => {
//     const [isOpen, setIsOpen] = useState(false);

//     const toggleOpen = () => {
//         setIsOpen(!isOpen);
//     };

//     return (
//         <div className={`${!isLast ? 'border-b border-gray-200' : ''}`}>
//             <div 
//                 className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
//                 onClick={toggleOpen}
//             >
//                 <div className="flex-1">
//                     <h3 className="text-gray-700 font-medium">{question.text}</h3>
//                     <div className="flex items-center mt-2 text-sm text-gray-500">
//                         <MessageCircle size={16} className="mr-1" />
//                         <span>{question.answers?.length || 0} คำตอบ</span>
//                     </div>
//                 </div>
//                 <div className="text-gray-500">
//                     {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                 </div>
//             </div>

//             {isOpen && (
//                 <div className="bg-gray-50 px-4 py-2">
//                     {question.answers && question.answers.length > 0 ? (
//                         <div className="space-y-4">
//                             <h4 className="text-sm font-medium text-gray-700 mb-2">คำตอบ:</h4>
//                             {question.answers.map((answer) => (
//                                 <div key={answer.id} className="bg-white p-4 rounded-lg shadow-sm">
//                                     <div className="flex items-center mb-2">
//                                         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-2">
//                                             {answer.user?.name?.charAt(0) || "U"}
//                                         </div>
//                                         <div>
//                                             <p className="font-medium">{answer.user?.name || "ผู้ใช้"}</p>
//                                             <p className="text-xs text-gray-500">{answer.createdAt ? new Date(answer.createdAt).toLocaleDateString('th-TH') : "ไม่ระบุวันที่"}</p>
//                                         </div>
//                                     </div>
//                                     <p className="text-gray-700">{answer.text}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="text-center py-4 text-gray-500">
//                             ยังไม่มีคำตอบสำหรับคำถามนี้
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default QuestionsList;

"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const QuestionsList = ({ questions, onUpdateAnswerStatus, onDeleteAnswer }) => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden drop-shadow">
            {questions.length > 0 ? (
                questions.map((question, index) => (
                    <QuestionItem 
                        key={question.id} 
                        question={question} 
                        isLast={index === questions.length - 1}
                        onUpdateAnswerStatus={onUpdateAnswerStatus}
                        onDeleteAnswer={onDeleteAnswer}
                    />
                ))
            ) : (
                <div className="p-8 text-center text-gray-500">
                    ไม่พบคำถามที่ตรงกับเงื่อนไขที่เลือก
                </div>
            )}
        </div>
    );
};

const QuestionItem = ({ question, isLast, onUpdateAnswerStatus, onDeleteAnswer }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

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
                <div className="text-gray-500">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {isOpen && (
                <div className="bg-gray-50 px-4 py-2">
                    {question.answers && question.answers.length > 0 ? (
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">คำตอบ:</h4>
                            {question.answers.map((answer) => (
                                <div key={answer.id} className="bg-white p-4 rounded-lg shadow-sm">
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