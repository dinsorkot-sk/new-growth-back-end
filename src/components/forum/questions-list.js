"use client";

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
    return (
        <div className={`p-4 ${!isLast ? 'border-b border-gray-200' : ''}`}>
            <h3 className="text-gray-700">{question.text}</h3>
        </div>
    );
};

export default QuestionsList;