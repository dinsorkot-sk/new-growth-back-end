import { useState } from "react";
import { X, Download, Edit, Trash, ArrowLeft, Eye, Calendar, HardDrive, Maximize, User } from "lucide-react";
import Image from 'next/image';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] animate-fadeIn">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
    </div>
    <p className="mt-4 text-gray-600 animate-pulse">กำลังโหลดข้อมูลรูปภาพ...</p>
  </div>
);

const Detail = ({ image, onClose, onDelete, baseUrl }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(image.description || "");
    const [isSaving, setIsSaving] = useState(false);

    const [editData, setEditData] = useState({
        ref_id: image?.ref_id
    });
    
    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };
    
    const getImageDimensions = (imagePath) => {
        // In a real implementation, you could get dimensions from API
        // Here we'll return placeholder text
        return "ไม่สามารถดึงข้อมูลได้";
    };
    
    const getFileSize = (imagePath) => {
        // In a real implementation, you could get file size from API
        // Here we'll return placeholder text
        return "ไม่สามารถดึงข้อมูลได้";
    };

    const handleDownload = () => {
        // สร้าง URL ของรูปภาพ
        const imageUrl = `${baseUrl}/${image.image_path}`;
        
        // ใช้ fetch เพื่อดาวน์โหลดรูปภาพเป็น Blob
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                // สร้าง URL ชั่วคราวสำหรับ Blob
                const blobUrl = window.URL.createObjectURL(blob);
                
                // สร้าง element a สำหรับการดาวน์โหลด
                const a = document.createElement('a');
                a.href = blobUrl;
                
                // ตั้งชื่อไฟล์จากชื่อรูปภาพ
                a.download = image.image_path.split('/').pop();
                
                // เพิ่ม element เข้าไปใน DOM และคลิกเพื่อดาวน์โหลด
                document.body.appendChild(a);
                a.click();
                
                // ลบ element และเคลียร์ URL ชั่วคราว
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch(error => {
                console.error('เกิดข้อผิดพลาดในการดาวน์โหลดรูปภาพ:', error);
            });
    };
    
    const handleEdit = () => {
        setIsEditing(true);
    };
    
    const handleSaveEdit = async () => {
        console.log("Saving description:", description , image.id);
        try {
            setIsSaving(true);
            
            // Call API to update the image description
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/image/${image.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description })
            });
            
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            
            // Parse response data if needed
            const updatedData = await response.json();
            
            // Close edit mode
            setIsEditing(false);
            
            // Show success message
            alert("บันทึกรายละเอียดรูปภาพเรียบร้อย");
            
            // ถ้าต้องการอัปเดตข้อมูลในหน้าจอโดยใช้ข้อมูลที่ได้รับกลับจาก API
            // คุณสามารถเพิ่ม event callback เพื่อส่งข้อมูลกลับไปยัง parent component
            // เช่น onImageUpdated(updatedData);
            
        } catch (err) {
            console.error("Error updating image description:", err);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setDescription(image.description || "");
    };
    
    const refTypeToLabel = (refType) => {
        const types = {
            "course": "หลักสูตร",
            "news": "ข่าวสาร",
            "event": "กิจกรรม"
        };
        return types[refType] || refType;
    };

    if (!image) {
        return <LoadingSpinner />;
    }

    return (
        <div className="bg-white rounded-2xl drop-shadow-lg animate-fadeIn max-w-4xl mx-auto my-8 border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
                <div className="flex items-center">
                    <button 
                        onClick={onClose}
                        className="flex items-center text-gray-500 hover:text-blue-600 mr-4 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-semibold text-blue-700 tracking-wide">รายละเอียดรูปภาพ</h2>
                </div>
                <div className="flex items-center space-x-4">
                    <button 
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        onClick={handleDownload}
                    >
                        <Download className="h-5 w-5" />
                    </button>
                    <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={handleEdit}
                    >
                        <Edit className="h-5 w-5" />
                    </button>
                    <button 
                        className="text-red-500 hover:text-red-700 transition-colors"
                        onClick={() => onDelete(image)}
                    >
                        <Trash className="h-5 w-5" />
                    </button>
                </div>
            </div>
            {/* Content */}
            <div className="p-6 flex flex-col md:flex-row gap-8">
                {/* Image Preview */}
                <div className="md:w-1/2">
                    <div className="bg-gray-100 rounded-lg flex items-center justify-center p-2 h-80 shadow-inner animate-fadeInImg">
                        <Image 
                            src={`${baseUrl}/${image.image_path}`} 
                            alt={`รูปภาพ ${image.id}`}
                            className="max-w-full max-h-full object-contain rounded transition-all duration-500 shadow-lg"
                            width={800}
                            height={600}
                            style={{ objectFit: 'contain' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `/api/placeholder/600/400`;
                            }}
                        />
                    </div>
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="font-medium text-gray-700 mb-3">ข้อมูลไฟล์</h3>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="flex items-center text-gray-500">
                                <HardDrive className="h-4 w-4 mr-1" />
                                <span>ชื่อไฟล์:</span>
                            </div>
                            <span>{image.image_path.split('/').pop()}</span>
                            <div className="flex items-center text-gray-500">
                                <Maximize className="h-4 w-4 mr-1" />
                                <span>ความละเอียด:</span>
                            </div>
                            <span>{getImageDimensions(image.image_path)}</span>
                            <div className="flex items-center text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>วันที่อัพโหลด:</span>
                            </div>
                            <span>{formatDate(image.created_at)}</span>
                            <div className="flex items-center text-gray-500">
                                <User className="h-4 w-4 mr-1" />
                                <span>ประเภท:</span>
                            </div>
                            <span>{refTypeToLabel(image.ref_type)}</span>
                            <div className="flex items-center text-gray-500">
                                <Eye className="h-4 w-4 mr-1" />
                                <span>ID อ้างอิง:</span>
                            </div>
                            <span>{image.ref_id || '-'}</span>
                        </div>
                    </div>
                </div>
                {/* Image Information */}
                <div className="md:w-1/2">
                    <div className="bg-gray-50 rounded-lg p-5">
                        <h3 className="font-medium text-gray-700 mb-4">ข้อมูลเพิ่มเติม</h3>
                        
                        {isEditing ? (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-700">รายละเอียดรูปภาพ</h4>
                                </div>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg min-h-32 text-sm"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="กรอกรายละเอียดรูปภาพ"
                                />
                                <div className="flex justify-end mt-4 space-x-2">
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                                    >
                                        ยกเลิก
                                    </button>
                                     <button
                                        type="button"
                                        onClick={handleSaveEdit}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm disabled:bg-blue-300"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? "กำลังบันทึก..." : "บันทึก"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-700">รายละเอียดรูปภาพ</h4>
                                    {/* <button 
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={handleEdit}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button> */}
                                </div>
                                {description ? (
                                    <p className="text-sm text-gray-600 whitespace-pre-line">{description}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">ไม่มีคำอธิบายรูปภาพ</p>
                                )}
                            </div>
                        )}
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium text-gray-700">การใช้งาน</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                                URL สำหรับใช้งาน:
                            </p>
                            <div className="bg-gray-100 p-2 rounded text-sm font-mono break-all">
                                {`${baseUrl}/${image.image_path}`}
                            </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">ID:</span>
                                <span className="font-medium">{image.id}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">ขนาดไฟล์:</span>
                                <span className="font-medium">{getFileSize(image.image_path)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">วันที่แก้ไขล่าสุด:</span>
                                <span className="font-medium">
                                    {image.updated_at ? formatDate(image.updated_at) : formatDate(image.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;