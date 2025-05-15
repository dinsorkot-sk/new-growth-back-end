"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const AddQuestionModal = ({ onClose, onSave, selectedCategory }) => {
    const [questionText, setQuestionText] = useState("");
    const [categoryId, setCategoryId] = useState(selectedCategory?.id || "");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        if (selectedCategory) {
            setCategoryId(selectedCategory.id);
        }
    }, [selectedCategory]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!questionText.trim()) {
            setError("กรุณากรอกคำถาม");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Prepare data for API
            const topicData = {
                title: questionText.trim(),
                posted_by: "admin", // You might want to make this dynamic
                is_approved: 0,
                status: "show",
                answers: [] // Initial state with no answers
            };
            
            // Send data to the API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/topic`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(topicData),
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Also call the existing onSave function to maintain current functionality
            onSave({
                text: questionText.trim(),
                categoryId: parseInt(categoryId || 0)
            });
            
            // Close modal on success
            onClose();
            
        } catch (error) {
            console.error("Failed to save topic:", error);
            setError(`บันทึกไม่สำเร็จ: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-gray-900 opacity-50"
                onClick={onClose}
            />

            {/* Modal panel */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto transform transition-all">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        เพิ่มกระดู้คำถามใหม่
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-md">
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            คำถาม
                        </label>
                        <textarea
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            placeholder="พิมพ์คำถามของคุณที่นี่..."
                            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm h-32 focus:border-blue-500 focus:ring-blue-500 p-2"
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:bg-green-300 cursor-pointer"
                        >
                            {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddQuestionModal;