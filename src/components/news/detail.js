"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import axios from 'axios'; // เพิ่มการนำเข้า axios
import { useRouter } from "next/navigation";


const QuillEditor = dynamic(() => import('../quillEditor'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
});

const Detail = ({ news, mode: initialMode }) => {
    const router = useRouter();
    // ตรวจสอบโหมดโดยตรง - ถ้ามี initialMode เป็น 'edit' หรือไม่มี news.id (สร้างใหม่) ให้เป็นโหมดแก้ไข
    const [mode, setMode] = useState(initialMode === 'edit' || !news?.id ? 'edit' : 'view');
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        title: news?.title || "",
        content: news?.content || "",
        categories: [],
        publishDate: news?.publishDate || new Date().toISOString().split('T')[0],
        status: news?.status || "show",
        shortDescription: news?.short_description || "",
    });
    const [newCategory, setNewCategory] = useState('');

    // เมื่อมีการเปลี่ยนโหมดหรือข้อมูลข่าว ให้อัปเดต state
    useEffect(() => {
        if (news) {
            const initialCategories = news.tagAssignments?.map(t => t.tag.name) || [];
            // อัปเดตฟอร์มข้อมูล
            setFormData({
                title: news?.title || "",
                content: news?.content || "",
                categories: initialCategories || [],
                publishDate: news?.publishDate || new Date().toISOString().split('T')[0],
                status: news?.status || "show",
                shortDescription: news?.short_description || "",
            });

            // เช็คเงื่อนไขเพื่อกำหนดโหมด:
            // 1. ถ้า initialMode เป็น 'edit' หรือ
            // 2. ไม่มี news.id (หมายถึงเป็นการสร้างใหม่)
            setMode(initialMode === 'edit' || !news.id ? 'edit' : 'view');
        }
    }, [news, initialMode]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleSave = async () => {
        const token = Cookies.get('auth-token');
        if (!token) {
            alert('กรุณาเข้าสู่ระบบอีกครั้ง');
            return;
        }

        const formPayload = new FormData();
        formPayload.append('title', formData.title);
        formPayload.append('content', formData.content);
        formPayload.append('published_date', new Date(formData.publishDate).toISOString());
        formPayload.append('tag', JSON.stringify(formData.categories))
        formPayload.append('status', formData.status);
        formPayload.append('short_description', formData.shortDescription);

        if (imageFile) {
            formPayload.append('image', imageFile);
        }

        try {
            const url = news?.id
                ? `${process.env.NEXT_PUBLIC_API}/news/${news.id}`
                : `${process.env.NEXT_PUBLIC_API}/news`;

            const method = news?.id ? 'put' : 'post';

            await axios({
                method,
                url,
                data: formPayload,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            onClose();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการบันทึก:', error);
            alert('บันทึกข้อมูลไม่สำเร็จ');
        }
    };

    const handleEdit = () => {
        setMode('edit'); // เปลี่ยนเป็นโหมดแก้ไข
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
            setFormData(prev => ({
                ...prev,
                categories: [...prev.categories, newCategory.trim()]
            }));
            setNewCategory('');
        }
    };

    // ฟังก์ชันลบหมวดหมู่
    const handleRemoveCategory = (index) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter((_, i) => i !== index)
        }));
    };
    
    const dateFormatter = (p_date) => {
        const date = new Date(p_date);
        const formatter = new Intl.DateTimeFormat("en-GB", { day: '2-digit', month: 'long', year: 'numeric' });
        return formatter.format(date)
    }

    const onClose = () => {
        router.back();
    }   

    return (
        <div className="">
            <div className="bg-white flex items-center p-5 w-full drop-shadow rounded-2xl my-3">
                <h1 className="text-2xl font-semibold">
                    {mode === 'edit' ?
                        (news?.id ? 'แก้ไขข่าวสาร & กิจกรรม' : 'สร้างข่าวสาร & กิจกรรมใหม่') :
                        'รายละเอียดข่าวสาร & กิจกรรม'}
                </h1>
            </div>

            <div className="bg-white drop-shadow rounded-2xl px-10 py-10">
                <div className="max-w-4xl mx-auto">
                    {/* ส่วนหัวข้อและปุ่มบันทึก/แก้ไข */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col">
                            {mode === 'edit' ? (
                                <input
                                    type="text"
                                    name="title"
                                    className="text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-1 w-full"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    placeholder="ระบุชื่อหัวข้อข่าว"
                                />
                            ) : (
                                <h2 className="text-2xl font-bold">{formData.title}</h2>
                            )}
                            {mode === 'view' && (
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span>วันที่: {dateFormatter(formData.publishDate)}</span>
                                    <span>หมวดหมู่: {formData.categories.join(', ')}</span>
                                    <span>{news?.viewCount || 0} คนอ่าน</span>
                                </div>
                            )}
                        </div>

                        <button
                            className={`px-6 py-2 rounded-md text-white ${mode === 'edit' ? 'bg-green-500' : 'bg-blue-600'}`}
                            onClick={mode === 'edit' ? handleSave : handleEdit}
                        >
                            {mode === 'edit' ? 'บันทึก' : 'แก้ไข'}
                        </button>
                    </div>

                    {/* ส่วนรูปภาพ (ถ้ามี) */}
                    {mode === 'view' && news?.image?.image_path && (
                        <div className="mb-6">
                            <img
                                src={`${process.env.NEXT_PUBLIC_IMG}/${news.image.image_path}`}
                                alt={formData.title}
                                className="w-full h-auto max-h-96 object-contain border rounded-lg"
                            />
                        </div>
                    )}

                    {/* ส่วนฟอร์มแก้ไข */}
                    {mode === 'edit' && (
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2">หมวดหมู่</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="พิมพ์หมวดหมู่ใหม่"
                                        className="flex-1 p-2 border border-gray-300 rounded-md"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCategory}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        เพิ่ม
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {formData.categories.map((category, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                                        >
                                            <span>{category}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCategory(index)}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">วันที่เผยแพร่</label>
                                <input
                                    type="date"
                                    name="publishDate"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={formData.publishDate}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-gray-700 mb-2">คำอธิบาย</label>
                                <textarea
                                    name="shortDescription"
                                    className="w-full p-2 border border-gray-300 rounded-md h-20"
                                    value={formData.shortDescription}
                                    onChange={handleFormChange}
                                    placeholder="ระบุคำอธิบายสั้น"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">สถานะ</label>
                                <select
                                    name="status"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={formData.status}
                                    onChange={handleFormChange}
                                >
                                    <option value="show">แสดง</option>
                                    <option value="hide">ซ่อน</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-gray-700 mb-2">อัพโหลดรูปภาพ</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    )}

                    {/* ส่วนคำอธิบายสั้น (โหมดดู) */}
                    {mode === 'view' && (
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">คำอธิบาย</h3>
                            <p className="text-lg text-gray-700">{formData.shortDescription}</p>
                        </div>
                    )}

                    {/* ส่วนเนื้อหาหลัก */}
                    <div className="mt-4">
                        <h3 className="font-semibold mb-3">{mode === 'edit' ? 'เนื้อหา' : 'รายละเอียด'}</h3>
                        {mode === 'edit' ? (
                            <div>
                                <QuillEditor
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    id="additional-info-editor"
                                />
                            </div>
                        ) : (
                            <div className="prose max-w-none bg-gray-50 p-6 rounded-lg">
                                {formData.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                                ) : (
                                    <p className="text-gray-500 italic">ไม่มีเนื้อหา</p>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <div className="mt-6">
                <button
                    className="text-blue-500 underline flex items-center cursor-pointer"
                    onClick={onClose}
                >
                    <span className="mr-1">&lt;</span> กลับไปหน้ารายการ
                </button>
            </div>
        </div>
    );
};

export default Detail;