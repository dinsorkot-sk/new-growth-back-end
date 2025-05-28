"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import axios from 'axios'; // เพิ่มการนำเข้า axios
import { useRouter } from "next/navigation";
import Image from 'next/image';
import ImageUploadModal from '../ImageUploadModal'; // Import the new image modal component
import VideoUploadModal from '../VideoUploadModal'; // Import the new video modal component


const QuillEditor = dynamic(() => import('../quillEditor'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
});

const Detail = ({ id, mode: initialMode }) => {
    const router = useRouter();
    const [mode, setMode] = useState(initialMode === 'edit' || !id ? 'edit' : 'view');
    const [imageFiles, setImageFiles] = useState([]);
    const [imageDescriptions, setImageDescriptions] = useState([]);
    const [existingVideos, setExistingVideos] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);
    const [videoDescriptions, setVideoDescriptions] = useState([]);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [showAddVideoModal, setShowAddVideoModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImageViewModal, setShowImageViewModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [news, setNews] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        categories: [],
        publishDate: new Date().toISOString().split('T')[0],
        status: "show",
        shortDescription: "",
    });
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            if (id && id !== "create") {
                try {
                    setIsLoading(true);
                    const token = Cookies.get("auth-token");
                    if (!token) {
                        router.push("/admin/login");
                        return;
                    }
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/news/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const newsData = response.data;
                    setNews(newsData);
                    
                    const initialCategories = newsData.tagAssignments?.map(t => t.tag.name) || [];
                    setFormData({
                        title: newsData?.title || "",
                        content: newsData?.content || "",
                        categories: initialCategories || [],
                        publishDate: newsData?.publishDate || new Date().toISOString().split('T')[0],
                        status: newsData?.status || "show",
                        shortDescription: newsData?.short_description || "",
                    });
                    setExistingVideos(newsData?.resources || []);
                    setExistingImages(newsData?.images || []);
                } catch (error) {
                    console.error('Error fetching news:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchNews();
        setMode(initialMode === 'edit' || !id ? 'edit' : 'view');
    }, [id, initialMode]);

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

    const handleVideoUpload = (e) => {
        const files = Array.from(e.target.files);
        setVideoFiles(prev => [...prev, ...files]);
    };

    const handleRemoveVideo = (index) => {
        setVideoFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
        setShowVideoModal(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const token = Cookies.get('auth-token');
        if (!token) {
            router.push("/admin/login");
            setIsSaving(false);
            return;
        }

        const formPayload = new FormData();
        formPayload.append('title', formData.title);
        formPayload.append('content', formData.content);
        formPayload.append('published_date', new Date(formData.publishDate).toISOString());
        formPayload.append('tag', JSON.stringify(formData.categories));
        formPayload.append('status', formData.status);
        formPayload.append('short_description', formData.shortDescription);

        // Handle image uploads with descriptions
        imageFiles.forEach((file, index) => {
            formPayload.append('image', file);
        });
        formPayload.append('image_description', JSON.stringify(imageDescriptions));
        
        // Handle video uploads with descriptions
        videoFiles.forEach((file, index) => {
            formPayload.append('video', file);
        });
        formPayload.append('video_description', JSON.stringify(videoDescriptions));
        
        // Add keepVideoIds and keepImageIds for PUT
        if (id && id !== "create") {
            formPayload.append('keep_video_file_ids', JSON.stringify(existingVideos.map(v => v.id)));
            formPayload.append('keep_image_ids', JSON.stringify(existingImages.map(img => img.id)));
        }
        try {
            const url = id && id !== "create"
                ? `${process.env.NEXT_PUBLIC_API}/news/${id}`
                : `${process.env.NEXT_PUBLIC_API}/news`;

            const method = id && id !== "create" ? 'put' : 'post';
            
            const response = await axios({
                method,
                url,
                data: formPayload,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);
            router.push(`/admin/news/${response.data.data.id}?mode=view`);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการบันทึก:', error);
            alert('บันทึกข้อมูลไม่สำเร็จ');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = () => {
        setMode('edit');
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

    const handleRemoveCategory = (index) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter((_, i) => i !== index)
        }));
    };

    const handleRemoveExistingVideo = (index) => {
        setExistingVideos(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImageDescriptions(prev => prev.filter((_, i) => i !== index));
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
        <div className="min-h-screen bg-gray-50">
            {isLoading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600">กำลังโหลด...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="bg-white flex items-center p-5 w-full drop-shadow-lg rounded-2xl my-3 transform transition-all duration-300 hover:shadow-xl">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            {mode === 'edit' ?
                                (id && id !== "create" ? 'แก้ไขข่าวสาร & กิจกรรม' : 'สร้างข่าวสาร & กิจกรรมใหม่') :
                                'รายละเอียดข่าวสาร & กิจกรรม'}
                        </h1>
                    </div>

                    <div className="bg-white drop-shadow-lg rounded-2xl px-10 py-10 transform transition-all duration-300 hover:shadow-xl">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex flex-col">
                                    {mode === 'edit' ? (
                                        <input
                                            type="text"
                                            name="title"
                                            className="text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-1 w-full transition-all duration-300"
                                            value={formData.title}
                                            onChange={handleFormChange}
                                            placeholder="ระบุชื่อหัวข้อข่าว"
                                        />
                                    ) : (
                                        <h2 className="text-2xl font-bold text-gray-800">{formData.title}</h2>
                                    )}
                                    {mode === 'view' && (
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {dateFormatter(formData.publishDate)}
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                                {formData.categories.join(', ')}
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {news?.viewCount || 0} คนอ่าน
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className={`px-6 py-2 rounded-md text-white transform transition-all duration-300 hover:scale-105 ${mode === 'edit' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} ${mode === 'edit' ? (isSaving ? 'cursor-not-allowed opacity-70' : 'cursor-pointer') : 'cursor-pointer'}`}
                                    onClick={mode === 'edit' ? handleSave : handleEdit}
                                    disabled={mode === 'edit' && isSaving}
                                >
                                    {mode === 'edit' ? (
                                        isSaving ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                                </svg>
                                                กำลังบันทึก...
                                            </span>
                                        ) : 'บันทึก'
                                    ) : 'แก้ไข'}
                                </button>
                            </div>

                            {mode === 'view' && (
                                <div className="mb-6">
                                    {(news?.image?.image_path || (news?.images && news.images.length > 0)) && (
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_IMG}/${news?.image?.image_path || news.images[0].image_path}`}
                                            alt={formData.title}
                                            className="w-full h-auto object-contain rounded-lg"
                                            width={800}
                                            height={600}
                                            style={{ objectFit: 'contain' }}
                                        />
                                    )}
                                </div>
                            )}

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
                                        <button
                                            type="button"
                                            className="w-full p-2 border border-gray-300 rounded-md text-left text-gray-500 hover:bg-gray-100 transition-colors duration-300"
                                            onClick={() => setShowImageModal(true)}
                                        >
                                            <div className="flex items-center justify-center">
                                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                                                </svg>
                                                คลิกเพื่ออัพโหลดรูปภาพ
                                            </div>
                                        </button>
                                        {/* แสดงรูปภาพที่มีอยู่แล้ว */}
                                        {existingImages.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {existingImages.map((image, index) => (
                                                    <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                                                        <span>{image.image_path.split('/').pop()}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveExistingImage(index)}
                                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {/* รูปภาพที่อัพโหลดใหม่ */}
                                        {imageFiles.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {imageFiles.map((file, index) => (
                                                    <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                                                        <span>{file.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(index)}
                                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 mb-2">อัพโหลดวิดีโอ (สูงสุด 5 ไฟล์)</label>
                                        <button
                                            type="button"
                                            className="w-full p-2 border border-gray-300 rounded-md text-left text-gray-500 hover:bg-gray-100 transition-colors duration-300"
                                            onClick={() => setShowAddVideoModal(true)}
                                        >
                                             <div className="flex items-center justify-center">
                                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                                                </svg>
                                                คลิกเพื่ออัพโหลดวิดีโอ
                                            </div>
                                        </button>
                                        {/* วิดีโอที่มีอยู่แล้ว */}
                                        {existingVideos.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {existingVideos.map((video, index) => (
                                                    <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                                                        <span>{video.files?.[0]?.file_path || 'video'}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveExistingVideo(index)}
                                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* วิดีโอที่อัปโหลดใหม่ */}
                                        {videoFiles.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {videoFiles.map((file, index) => (
                                                    <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                                                        <span>{file.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveVideo(index)}
                                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    
                                </div>
                            )}

                            {mode === 'view' && (
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">คำอธิบาย</h3>
                                    <p className="text-lg text-gray-700">{formData.shortDescription}</p>
                                </div>
                            )}

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
                                            <div className="ql-editor" dangerouslySetInnerHTML={{ __html: formData.content }} />
                                        ) : (
                                            <p className="text-gray-500 italic">ไม่มีเนื้อหา</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {mode === 'view' && news?.resources && news.resources.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3 text-gray-800">วิดีโอ</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {news.resources.map((video, index) => (
                                            <div
                                                key={index}
                                                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                                            >
                                                <div 
                                                    className="relative cursor-pointer"
                                                    onClick={() => handleVideoClick(video)}
                                                >
                                                    <video
                                                        className="w-full h-48 object-cover"
                                                        src={`${process.env.NEXT_PUBLIC_IMG}/${video.files[0].file_path}`}
                                                    >
                                                        <source src={`${process.env.NEXT_PUBLIC_IMG}/${video.files[0].file_path}`} type="video/mp4" />
                                                    </video>
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black opacity-50 transition-opacity duration-300 hover:opacity-40">
                                                        <svg
                                                            className="w-12 h-12 text-white transform transition-transform duration-300 hover:scale-110"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-semibold text-gray-800 mb-2">วิดีโอ {index + 1}</h4>
                                                    {video.description && (
                                                        <p className="text-gray-600 text-sm">{video.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {mode === 'view' && news?.images && news.images.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3 text-gray-800">รูปภาพ</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {news.images.map((image, index) => (
                                            <div
                                                key={index}
                                                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                                            >
                                                <div 
                                                    className="relative cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedImage(image);
                                                        setShowImageViewModal(true);
                                                    }}
                                                >
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_IMG}/${image.image_path}`}
                                                        alt={`Image ${index + 1}`}
                                                        width={400}
                                                        height={300}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black opacity-50 transition-opacity duration-300 hover:opacity-40">
                                                        <svg
                                                            className="w-12 h-12 text-white transform transition-transform duration-300 hover:scale-110"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-semibold text-gray-800 mb-2">รูปภาพ {index + 1}</h4>
                                                    {image.description && (
                                                        <p className="text-gray-600 text-sm">{image.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {showVideoModal && selectedVideo && (
                                <div className="fixed inset-0 bg-[#00000050] flex items-center justify-center z-50 animate-fadeIn">
                                    <div className="bg-white p-4 rounded-lg max-w-4xl w-full transform transition-all duration-300 animate-scaleIn">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-semibold text-gray-800">วิดีโอ</h3>
                                            <button
                                                onClick={() => setShowVideoModal(false)}
                                                className="text-5xl text-gray-500 hover:text-gray-700 transition-colors duration-300"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <video
                                            className="w-full rounded-lg shadow-lg"
                                            autoPlay
                                            controls
                                            src={`${process.env.NEXT_PUBLIC_IMG}/${selectedVideo.files[0].file_path}`}
                                        />
                                        {selectedVideo.description && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                <h4 className="font-semibold text-gray-800 mb-2">รายละเอียด</h4>
                                                <p className="text-gray-600">{selectedVideo.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {showImageViewModal && selectedImage && (
                                <div className="fixed inset-0 bg-[#00000050] flex items-center justify-center z-50 animate-fadeIn">
                                    <div className="bg-white p-4 rounded-lg max-w-4xl w-full transform transition-all duration-300 animate-scaleIn">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-semibold text-gray-800">รูปภาพ</h3>
                                            <button
                                                onClick={() => setShowImageViewModal(false)}
                                                className="text-5xl text-gray-500 hover:text-gray-700 transition-colors duration-300"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_IMG}/${selectedImage.image_path}`}
                                            alt="Selected image"
                                            width={800}
                                            height={600}
                                            className="w-full rounded-lg shadow-lg"
                                        />
                                        {selectedImage.description && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                <h4 className="font-semibold text-gray-800 mb-2">รายละเอียด</h4>
                                                <p className="text-gray-600">{selectedImage.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            className="text-blue-500 hover:text-blue-700 underline flex items-center cursor-pointer transition-colors duration-300"
                            onClick={onClose}
                        >
                            <span className="mr-1">&lt;</span> กลับไปหน้ารายการ
                        </button>
                    </div>
                </>
            )}

            {showImageModal && (
                <ImageUploadModal
                    onClose={() => setShowImageModal(false)}
                    onUpload={(files, descriptions) => {
                        setImageFiles(prev => [...prev, ...files]);
                        setImageDescriptions(prev => [...prev, ...descriptions]);
                    }}
                />
            )}

            {/* Render the add video modal */}
            {showAddVideoModal && (
                <VideoUploadModal
                    onClose={() => setShowAddVideoModal(false)}
                    onUpload={(files, descriptions) => {
                        setVideoFiles(prev => [...prev, ...files]);
                        setVideoDescriptions(prev => [...prev, ...descriptions]);
                    }}
                />
            )}
        </div>
    );
};

export default Detail;