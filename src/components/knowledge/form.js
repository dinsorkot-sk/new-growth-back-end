// components/activity/form.js
"use client";
import { useState, useEffect } from "react";

const ActivityForm = ({ activity, onBack, onSave }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        location: "",
        capacity: "",
        organizer: ""
    });
    
    const [activeTab, setActiveTab] = useState("info");
    const [isSubmitting, setIsSubmitting] = useState(false); // เพิ่ม state สำหรับตรวจสอบการส่งฟอร์ม
    const [errors, setErrors] = useState({}); // เพิ่ม state สำหรับเก็บข้อผิดพลาด

    // นำข้อมูลกิจกรรมที่มีอยู่มาแสดงในฟอร์มเมื่อเป็นการแก้ไข
    useEffect(() => {
        if (activity) {
            setFormData({
                title: activity.title || "",
                description: activity.description || "",
                date: activity.date || new Date().toISOString().split('T')[0],
                location: activity.location || "",
                capacity: activity.capacity || "",
                organizer: activity.organizer || ""
            });
        }
    }, [activity]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // ล้างข้อผิดพลาดเมื่อกรอกข้อมูล
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = "กรุณาระบุชื่อกิจกรรม";
        }
        if (!formData.date) {
            newErrors.date = "กรุณาระบุวันที่จัดกิจกรรม";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        // ในสถานการณ์จริงนี่คือจุดที่คุณจะเรียก API
        setTimeout(() => {
            onSave(formData);
            setIsSubmitting(false);
        }, 500); // จำลองการส่งข้อมูลไปยัง API
    };

    const handleCancel = () => {
        if (window.confirm("คุณต้องการยกเลิกการแก้ไขใช่หรือไม่? ข้อมูลที่กรอกจะหายไป")) {
            onBack();
        }
    };

    const handleFileUpload = (e) => {
        // จำลองการอัพโหลดไฟล์
        const file = e.target.files[0];
        if (file) {
            console.log("ไฟล์ที่อัพโหลด:", file.name);
            alert(`อัพโหลดไฟล์ ${file.name} สำเร็จ`);
        }
    };

    return (
        <div className="bg-white rounded-md shadow-sm">
            {/* <div className="flex justify-between items-center p-4 border-b">
                <h1 className="text-xl font-medium">
                    {activity ? "แก้ไขกิจกรรม/อีเวนท์" : "เพิ่มกิจกรรม/อีเวนท์ใหม่"}
                </h1>
                <button 
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded-md transition"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
                </button>
            </div> */}
            
            <form onSubmit={handleSubmit}>
                <div className="p-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">ชื่อกิจกรรม / อีเวนท์<span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${errors.title ? 'border-red-500' : ''}`}
                            placeholder="ระบุชื่อกิจกรรม / อีเวนท์"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        <p className="text-xs text-gray-500 mt-1">ตัวอย่างชื่อกิจกรรม / อีเวนท์</p>
                    </div>

                    {/* ส่วนของ Tab interface */}
                    <div className="bg-white rounded-md border mt-8">
                        <div className="border-b">
                            <ul className="flex -mb-px">
                                <TabButton 
                                    active={activeTab === "info"}
                                    onClick={() => setActiveTab("info")}
                                    text="ข้อมูลทั่วไป / อีเวนท์"
                                />
                                {/* <TabButton 
                                    active={activeTab === "schedule"}
                                    onClick={() => setActiveTab("schedule")}
                                    text="กำหนดการ"
                                /> */}
                                <TabButton
                                    active={activeTab === "attachments"}
                                    onClick={() => setActiveTab("attachments")}
                                    text="เอกสารแนบ"
                                />
                            </ul>
                        </div>

                        <div className="p-4">
                            {activeTab === "info" && (
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">รายละเอียด</label>
                                        <textarea 
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md h-32 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            placeholder="รายละเอียดกิจกรรม / อีเวนท์"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">วันที่จัดกิจกรรม<span className="text-red-500">*</span></label>
                                            <input 
                                                type="date" 
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${errors.date ? 'border-red-500' : ''}`}
                                            />
                                            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">สถานที่จัด</label>
                                            <input 
                                                type="text" 
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                                                placeholder="ระบุสถานที่จัดกิจกรรม"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">จำนวนผู้เข้าร่วม</label>
                                            <input 
                                                type="number" 
                                                name="capacity"
                                                value={formData.capacity}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                                                placeholder="ระบุจำนวนผู้เข้าร่วม"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">ผู้จัด</label>
                                            <input 
                                                type="text" 
                                                name="organizer"
                                                value={formData.organizer}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                                                placeholder="ระบุชื่อผู้จัดกิจกรรม"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "schedule" && (
                                <div>
                                    <p className="text-gray-500 mb-4">กำหนดรายละเอียดตารางเวลากิจกรรมได้ในส่วนนี้</p>
                                    <div className="flex justify-end">
                                        <button 
                                            type="button"
                                            className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition"
                                        >
                                            + เพิ่มตารางเวลา
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "attachments" && (
                                <div>
                                    <p className="text-gray-500 mb-4">แนบไฟล์เอกสารที่เกี่ยวข้องกับกิจกรรม</p>
                                    <div className="flex items-center mt-4">
                                        <input 
                                            type="file" 
                                            id="fileUpload" 
                                            className="hidden" 
                                            onChange={handleFileUpload}
                                            multiple
                                        />
                                        <label 
                                            htmlFor="fileUpload"
                                            className="text-gray-700 bg-gray-100 px-4 py-2 rounded-md mr-2 hover:bg-gray-200 transition cursor-pointer"
                                        >
                                            แนบเอกสาร
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end p-4 border-t">
                            <button 
                                type="button" 
                                className="bg-white border border-gray-300 px-4 py-1 rounded-md mr-2 hover:bg-gray-50 transition"
                                onClick={handleCancel}
                            >
                                ยกเลิก
                            </button>
                            <button 
                                type="submit" 
                                className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

const TabButton = ({ active, onClick, text }) => {
    return (
        <li className="-mb-px">
            <button
                type="button"
                onClick={onClick}
                className={`inline-block py-2 px-4 text-sm font-medium ${
                    active 
                        ? "border-b-2 border-green-500 text-green-600" 
                        : "text-gray-500 hover:text-gray-700"
                }`}
            >
                {text}
            </button>
        </li>
    );
};

export default ActivityForm;