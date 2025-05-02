// "use client";

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
//     return (
//         <div className={`p-4 ${!isLast ? 'border-b border-gray-200' : ''}`}>
//             <h3 className="text-gray-700">{question.text}</h3>
//         </div>
//     );
// };

// export default QuestionsList;

"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

const QuestionsList = ({ questions }) => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden drop-shadow">
            {questions.length > 0 ? (
                questions.map((question, index) => (
                    <QuestionItem 
                        key={question.id} 
                        question={question} 
                        isLast={index === questions.length - 1}
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

const QuestionItem = ({ question, isLast }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
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
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-2">
                                            {answer.user?.name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="font-medium">{answer.user?.name || "ผู้ใช้"}</p>
                                            <p className="text-xs text-gray-500">{answer.createdAt ? new Date(answer.createdAt).toLocaleDateString('th-TH') : "ไม่ระบุวันที่"}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{answer.text}</p>
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