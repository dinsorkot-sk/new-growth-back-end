"use client";

import { useState } from "react";
import QuestionsList from "./questions-list";
import CategoryList from "./category-list";
import AddQuestionModal from "./add-question-modal";

const QuestionsIndex = ({ categories, questions: initialQuestions }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [questions, setQuestions] = useState(initialQuestions);
    
    // กรองคำถามตามหมวดหมู่ที่เลือกและคำค้นหา (ถ้ามี)
    const filteredQuestions = questions.filter(question => {
        // กรองตามหมวดหมู่ถ้ามีการเลือกหมวดหมู่
        const matchesCategory = selectedCategory 
            ? question.categoryId === selectedCategory.id 
            : true;
            
        // กรองตามคำค้นหาถ้ามีการกรอกข้อความค้นหา
        const matchesSearch = searchTerm 
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
        const newId = Math.max(...questions.map(q => q.id), 0) + 1;
        
        // สร้างคำถามใหม่พร้อม ID
        const questionToAdd = {
            id: newId,
            text: newQuestion.text,
            categoryId: newQuestion.categoryId,
            createdAt: new Date().toISOString()
        };
        
        // เพิ่มคำถามใหม่ไว้ด้านบนสุดของรายการ
        setQuestions([questionToAdd, ...questions]);
        
        // ปิด modal
        setShowModal(false);
    };
    
    return (
        <div className="flex flex-col gap-5">
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl drop-shadow">
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ค้นหาคำถาม..."
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                        ค้นหา
                    </button>
                    <button 
                        className="bg-white border border-green-500 text-green-500 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                        onClick={handleAddQuestion}
                    >
                        <span>+</span> <span>เพิ่มกระดู่คำถาม</span>
                    </button>
                </div>
            </div>
            
            {/* Category Grid */}
            <CategoryList 
                categories={categories} 
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
            />
            
            {/* Questions List */}
            <QuestionsList questions={filteredQuestions} />
            
            {/* Add Question Modal */}
            {showModal && (
                <AddQuestionModal 
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveQuestion}
                    categories={categories}
                    selectedCategory={selectedCategory}
                />
            )}
        </div>
    );
};

export default QuestionsIndex;