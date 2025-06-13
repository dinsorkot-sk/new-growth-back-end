import { useState } from "react";
import { X, Download, Edit, Trash, ArrowLeft, Eye, Calendar, HardDrive, Maximize, User } from "lucide-react";
import Image from 'next/image';
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    // Add debug logs
    // console.log('Image data:', image);
    // console.log('Base URL:', baseUrl);
    // console.log('Image path:', image?.image_path);
    // console.log('Video path:', image?.files?.[0]?.file_path);

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
    
    const getFileSize = (filePath) => {
        // In a real implementation, you could get file size from API
        // Here we'll return placeholder text
        return "ไม่สามารถดึงข้อมูลได้";
    };

    const handleDownload = () => {
        try {
            const token = Cookies.get("auth-token");
            if (!token) {
                router.push("/admin/login");
                return;
            }

            const isVideo = !!image.files;
            let downloadAsFileName = '';

            if (isVideo) {
                // Logic for video download using API endpoint
                const downloadApiUrl = `${process.env.NEXT_PUBLIC_IMG}/api/video/downloadVideo/${image.id}`;
                const originalFileNameWithExt = image.files[0].file_path.split('/').pop();
                const fileExtension = originalFileNameWithExt.split('.').pop();
                downloadAsFileName = `${image.title || originalFileNameWithExt.replace(/\.[^/.]+$/, "")}.${fileExtension}`;

                const a = document.createElement('a');
                a.href = downloadApiUrl;
                a.download = downloadAsFileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

            } else {
                // Logic for image download using Canvas
                const fileUrl = `${baseUrl}/${image.image_path}`;
                const originalFileNameWithExt = image.image_path.split('/').pop();
                const fileExtension = originalFileNameWithExt.split('.').pop();
                downloadAsFileName = `${image.title || originalFileNameWithExt.replace(/\.[^/.]+$/, "")}.${fileExtension}`;

                console.log('กำลังดาวน์โหลดรูปภาพจาก:', fileUrl);

                // Try direct download first
                const a = document.createElement('a');
                a.href = fileUrl;
                a.download = downloadAsFileName;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // If direct download fails, try canvas method
                const img = new window.Image();
                img.crossOrigin = 'anonymous';
                
                img.onload = function() {
                    try {
                        console.log('รูปภาพโหลดเสร็จแล้ว, ขนาด:', img.width, 'x', img.height);
                        
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        canvas.width = img.width;
                        canvas.height = img.height;
                        
                        ctx.drawImage(img, 0, 0);
                        
                        canvas.toBlob(function(blob) {
                            if (blob) {
                                console.log('สร้าง blob เสร็จแล้ว, ขนาด:', blob.size, 'bytes');
                                
                                const blobUrl = window.URL.createObjectURL(blob);
                                const downloadLink = document.createElement('a');
                                
                                downloadLink.href = blobUrl;
                                downloadLink.download = downloadAsFileName;
                                downloadLink.style.display = 'none';
                                
                                document.body.appendChild(downloadLink);
                                downloadLink.click();
                                
                                setTimeout(() => {
                                    if (document.body.contains(downloadLink)) {
                                        document.body.removeChild(downloadLink);
                                    }
                                    window.URL.revokeObjectURL(blobUrl);
                                }, 500);
                            } else {
                                console.error('ไม่สามารถสร้าง blob ได้');
                                window.open(fileUrl, '_blank');
                            }
                        }, getMimeType(fileExtension), 0.95);
                        
                    } catch (canvasError) {
                        console.error('Canvas Error:', canvasError);
                        window.open(fileUrl, '_blank');
                    }
                };
                
                img.onerror = function(imgError) {
                    console.error('Image Load Error:', imgError);
                    window.open(fileUrl, '_blank');
                };
                
                // Start loading the image
                img.src = fileUrl;
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์:', error);
            alert('เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์ กรุณาลองใหม่อีกครั้ง');
        }
    };
    
    const handleEdit = () => {
        setIsEditing(true);
    };
    
    const handleSaveEdit = async () => {
        console.log("Saving description:", description , image.id);
        try {
            setIsSaving(true);
            
            // Get the auth-token from cookies
            const authToken = Cookies.get('auth-token');
            if (!authToken) {
                router.push("/admin/login");
            }

            // Call API to update the description
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${isVideo ? 'document/update-document' : 'image'}/${image.id}`, {
                method: isVideo ? 'PUT' : 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
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
            alert("บันทึกรายละเอียดเรียบร้อย");
            
        } catch (err) {
            console.error("Error updating description:", err);
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

    const isVideo = !!image.files;

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
                    <h2 className="text-xl font-semibold text-blue-700 tracking-wide">
                        {isVideo ? 'รายละเอียดวิดีโอ' : 'รายละเอียดรูปภาพ'}
                    </h2>
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
                {/* Media Preview */}
                <div className="md:w-1/2">
                    <div className="bg-gray-100 rounded-lg flex items-center justify-center p-2 h-80 shadow-inner animate-fadeInImg">
                        {isVideo ? (
                            <video 
                                src={`${baseUrl}/${image.files[0].file_path}`}
                                className="max-w-full max-h-full object-contain rounded transition-all duration-500 shadow-lg"
                                controls
                            />
                        ) : (
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
                        )}
                    </div>
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="font-medium text-gray-700 mb-3">ข้อมูลไฟล์</h3>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="flex items-center text-gray-500">
                                <HardDrive className="h-4 w-4 mr-1" />
                                <span>ชื่อไฟล์:</span>
                            </div>
                            <span>{isVideo ? image.files[0].file_path.split('/').pop() : image.image_path.split('/').pop()}</span>
                            {!isVideo && (
                                <>
                                    <div className="flex items-center text-gray-500">
                                        <Maximize className="h-4 w-4 mr-1" />
                                        <span>ความละเอียด:</span>
                                    </div>
                                    <span>{getImageDimensions(image.image_path)}</span>
                                </>
                            )}
                            <div className="flex items-center text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>วันที่อัพโหลด:</span>
                            </div>
                            <span>{formatDate(image.created_at || image.published_date)}</span>
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
                {/* Media Information */}
                <div className="md:w-1/2">
                    <div className="bg-gray-50 rounded-lg p-5">
                        <h3 className="font-medium text-gray-700 mb-4">ข้อมูลเพิ่มเติม</h3>
                        
                        {isEditing ? (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-700">รายละเอียด</h4>
                                </div>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg min-h-32 text-sm"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="กรอกรายละเอียด"
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
                                    <h4 className="font-medium text-gray-700">รายละเอียด</h4>
                                </div>
                                {description ? (
                                    <p className="text-sm text-gray-600 whitespace-pre-line">{description}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">ไม่มีคำอธิบาย</p>
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
                                {isVideo ? `${baseUrl}/${image.files[0].file_path}` : `${baseUrl}/${image.image_path}`}
                            </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">ID:</span>
                                <span className="font-medium">{image.id}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">ขนาดไฟล์:</span>
                                <span className="font-medium">{getFileSize(isVideo ? image.files[0].file_path : image.image_path)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">วันที่แก้ไขล่าสุด:</span>
                                <span className="font-medium">
                                    {image.updated_at ? formatDate(image.updated_at) : formatDate(image.created_at || image.published_date)}
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