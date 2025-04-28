// detail.js
import { useState } from "react";

const Detail = ({ news, onClose }) => {
    const [content, setContent] = useState(news?.content || "");
    
    const handleSave = () => {
        console.log("บันทึกเนื้อหา:", content);
        // บันทึกข้อมูลลงฐานข้อมูล
        onClose(); // กลับไปหน้ารายการ
    };
    
    return (
        <div className="">
            <div className="bg-white flex items-center p-5 w-full drop-shadow rounded-2xl my-3">
                    <h1 className="text-2xl font-semibold">ข่าวสาร & กิจกรรม</h1>
                </div>
            
            <div className="bg-white drop-shadow rounded-2xl px-10 py-10 flex justify-center">
                <div className="w-full max-w-2xl">
                <div className="flex justify-between mb-4">
                    <h2 className="font-bold text-lg">ชื่อบทความ</h2>
                    <button 
                        className="bg-blue-900 text-white px-4 py-1 rounded"
                        onClick={handleSave}
                    >
                        แก้ไข
                    </button>
                </div>
                
                <div className="border rounded min-h-90  ">
                    <textarea
                        className="w-full min-h-100 p-4 resize-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="เขียนบทความเกี่ยวกับข่าว
เป็น editor"
                    />
                </div>
                </div>
            </div>
            
            <div className="mt-4">
                <button 
                    className="text-blue-500 underline"
                    onClick={onClose}
                >
                    &lt; กลับไปหน้ารายการ
                </button>
            </div>
        </div>
    );
};

export default Detail;