// "use client";

// import { useState, useEffect } from "react";


// const AddQuestionModal = ({ onClose, onSave, selectedCategory }) => {
//     const [questionText, setQuestionText] = useState("");
//     const [categoryId, setCategoryId] = useState(selectedCategory?.id || "");
//     const [error, setError] = useState("");
    
//     // ถ้ามีการเลือกหมวดหมู่มาก่อนหน้านี้ ให้ใช้หมวดหมู่นั้นเป็นค่าเริ่มต้น
//     // useEffect(() => {
//     //     if (selectedCategory) {
//     //         setCategoryId(selectedCategory.id);
//     //     }
//     // }, [selectedCategory]);
    
//     const handleSubmit = (e) => {
//         e.preventDefault();
        
//         // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
//         if (!questionText.trim()) {
//             setError("กรุณากรอกคำถาม");
//             return;
//         }
        
//         // if (!categoryId) {
//         //     setError("กรุณาเลือกหมวดหมู่");
//         //     return;
//         // }
        
//         // บันทึกคำถามใหม่
//         onSave({
//             text: questionText.trim(),
//             categoryId: parseInt(categoryId)
//         });
//     };
    
//     return (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl w-full max-w-lg">
//                 <div className="flex justify-between items-center p-4 border-b">
//                     <h2 className="text-lg font-semibold">เพิ่มกระดู่คำถามใหม่</h2>
//                     <button 
//                         onClick={onClose}
//                         className="text-gray-500 hover:text-gray-700"
//                     >
//                         {/* <X size={20} /> */}
//                     </button>
//                 </div>
                
//                 <form onSubmit={handleSubmit} className="p-4">
//                     {error && (
//                         <div className="mb-4 p-2 bg-red-50 text-red-500 rounded border border-red-200">
//                             {error}
//                         </div>
//                     )}
                    
//                     {/* <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             หมวดหมู่
//                         </label>
//                         <select
//                             value={categoryId}
//                             onChange={(e) => setCategoryId(e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         >
//                             <option value="">เลือกหมวดหมู่</option>
//                             {categories.map(category => (
//                                 <option key={category.id} value={category.id}>
//                                     {category.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div> */}
                    
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             คำถาม
//                         </label>
//                         <textarea
//                             value={questionText}
//                             onChange={(e) => setQuestionText(e.target.value)}
//                             placeholder="พิมพ์คำถามของคุณที่นี่..."
//                             className="w-full p-2 border border-gray-300 rounded-lg h-32 focus:ring-blue-500 focus:border-blue-500"
//                         ></textarea>
//                     </div>
                    
//                     <div className="flex justify-end gap-2">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                         >
//                             ยกเลิก
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//                         >
//                             บันทึก
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddQuestionModal;


"use client";

import { useState, useEffect } from "react";

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
            const response = await fetch('http://localhost:3001/api/admin/topic', {
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">เพิ่มกระดู่คำถามใหม่</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        {/* <X size={20} /> */}
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4">
                    {error && (
                        <div className="mb-4 p-2 bg-red-50 text-red-500 rounded border border-red-200">
                            {error}
                        </div>
                    )}
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            คำถาม
                        </label>
                        <textarea
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            placeholder="พิมพ์คำถามของคุณที่นี่..."
                            className="w-full p-2 border border-gray-300 rounded-lg h-32 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            disabled={isSubmitting}
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300"
                            disabled={isSubmitting}
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