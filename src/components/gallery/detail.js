
// import { useState } from "react";
// import { X, Download, Edit, Trash, ArrowLeft, Eye, Calendar, HardDrive, Maximize, User } from "lucide-react";

// const Detail = ({ image, onClose, onDelete, baseUrl }) => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [editData, setEditData] = useState({
//         ref_id: image.ref_id
//     });
    
//     const formatDate = (dateString) => {
//         const options = { 
//             year: 'numeric', 
//             month: 'long', 
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         };
//         return new Date(dateString).toLocaleDateString('th-TH', options);
//     };
    
//     const getImageDimensions = (imagePath) => {
//         // In a real implementation, you could get dimensions from API
//         // Here we'll return placeholder text
//         return "ไม่สามารถดึงข้อมูลได้";
//     };
    
//     const getFileSize = (imagePath) => {
//         // In a real implementation, you could get file size from API
//         // Here we'll return placeholder text
//         return "ไม่สามารถดึงข้อมูลได้";
//     };
    
//     // const handleDownload = () => {
//     //     const a = document.createElement('a');
//     //     a.href = `${baseUrl}${image.image_path}`;
//     //     a.download = image.image_path.split('/').pop();
//     //     document.body.appendChild(a);
//     //     a.click();
//     //     document.body.removeChild(a);
//     // };

//     const handleDownload = () => {
//         // สร้าง URL ของรูปภาพ
//         const imageUrl = `${baseUrl}${image.image_path}`;
        
//         // ใช้ fetch เพื่อดาวน์โหลดรูปภาพเป็น Blob
//         fetch(imageUrl)
//             .then(response => response.blob())
//             .then(blob => {
//                 // สร้าง URL ชั่วคราวสำหรับ Blob
//                 const blobUrl = window.URL.createObjectURL(blob);
                
//                 // สร้าง element a สำหรับการดาวน์โหลด
//                 const a = document.createElement('a');
//                 a.href = blobUrl;
                
//                 // ตั้งชื่อไฟล์จากชื่อรูปภาพ
//                 a.download = image.image_path.split('/').pop();
                
//                 // เพิ่ม element เข้าไปใน DOM และคลิกเพื่อดาวน์โหลด
//                 document.body.appendChild(a);
//                 a.click();
                
//                 // ลบ element และเคลียร์ URL ชั่วคราว
//                 document.body.removeChild(a);
//                 window.URL.revokeObjectURL(blobUrl);
//             })
//             .catch(error => {
//                 console.error('เกิดข้อผิดพลาดในการดาวน์โหลดรูปภาพ:', error);
//             });
//     };
    
//     const handleEdit = () => {
//         setIsEditing(true);
//         setEditData({
//             ref_id: image.ref_id
//         });
//     };
    
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditData({
//             ...editData,
//             [name]: value
//         });
//     };
    
//     const handleSaveEdit = async () => {
//         try {
//             // In a real implementation, you would call the API to update the image
//             // For example:
//             // await axios.put(`${baseUrl}/api/image/update/${image.id}`, editData);
            
//             // Update local state
//             // In a real implementation, you would refresh data from API
//             // For now, we'll just close edit mode
//             setIsEditing(false);
            
//             // Show success message
//             alert("บันทึกการเปลี่ยนแปลงเรียบร้อย");
//         } catch (err) {
//             console.error("Error updating image:", err);
//             alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
//         }
//     };
    
//     const handleCancelEdit = () => {
//         setIsEditing(false);
//         setEditData({
//             ref_id: image.ref_id
//         });
//     };
    
//     const refTypeToLabel = (refType) => {
//         const types = {
//             "course": "หลักสูตร",
//             "news": "ข่าวสาร",
//             "event": "กิจกรรม"
//         };
//         return types[refType] || refType;
//     };

//     return (
//         <div className="bg-white rounded-2xl drop-shadow">
//             {/* Header */}
//             <div className="flex justify-between items-center p-5 border-b">
//                 <div className="flex items-center">
//                     <button 
//                         onClick={onClose}
//                         className="flex items-center text-gray-500 hover:text-gray-700 mr-4"
//                     >
//                         <ArrowLeft className="h-5 w-5" />
//                     </button>
//                     <h2 className="text-xl font-semibold">รายละเอียดรูปภาพ</h2>
//                 </div>
                
//                 <div className="flex items-center space-x-4">
//                     <button 
//                         className="text-blue-500 hover:text-blue-700"
//                         onClick={handleDownload}
//                     >
//                         <Download className="h-5 w-5" />
//                     </button>
//                     {/* <button 
//                         className="text-gray-500 hover:text-gray-700"
//                         onClick={handleEdit}
//                     >
//                         <Edit className="h-5 w-5" />
//                     </button> */}
//                     <button 
//                         className="text-red-500 hover:text-red-700"
//                         onClick={() => onDelete(image)}
//                     >
//                         <Trash className="h-5 w-5" />
//                     </button>
//                 </div>
//             </div>
            
//             {/* Content */}
//             <div className="p-6 flex flex-col md:flex-row gap-8">
//                 {/* Image Preview */}
//                 <div className="md:w-1/2">
//                     <div className="bg-gray-100 rounded-lg flex items-center justify-center p-2 h-80">
//                         <img 
//                             src={`${baseUrl}${image.image_path}`} 
//                             alt={`รูปภาพ ${image.id}`}
//                             className="max-w-full max-h-full object-contain rounded"
//                             onError={(e) => {
//                                 e.target.onerror = null;
//                                 e.target.src = `/api/placeholder/600/400`;
//                             }}
//                         />
//                     </div>
                    
//                     <div className="mt-4 bg-gray-50 p-4 rounded-lg">
//                         <h3 className="font-medium text-gray-700 mb-3">ข้อมูลไฟล์</h3>
//                         <div className="grid grid-cols-2 gap-y-2 text-sm">
//                             <div className="flex items-center text-gray-500">
//                                 <HardDrive className="h-4 w-4 mr-1" />
//                                 <span>ชื่อไฟล์:</span>
//                             </div>
//                             <span>{image.image_path.split('/').pop()}</span>
                            
//                             <div className="flex items-center text-gray-500">
//                                 <Maximize className="h-4 w-4 mr-1" />
//                                 <span>ความละเอียด:</span>
//                             </div>
//                             <span>{getImageDimensions(image.image_path)}</span>
                            
//                             <div className="flex items-center text-gray-500">
//                                 <Calendar className="h-4 w-4 mr-1" />
//                                 <span>วันที่อัพโหลด:</span>
//                             </div>
//                             <span>{formatDate(image.created_at)}</span>
                            
//                             <div className="flex items-center text-gray-500">
//                                 <User className="h-4 w-4 mr-1" />
//                                 <span>ประเภท:</span>
//                             </div>
//                             <span>{refTypeToLabel(image.ref_type)}</span>
                            
//                             <div className="flex items-center text-gray-500">
//                                 <Eye className="h-4 w-4 mr-1" />
//                                 <span>ID อ้างอิง:</span>
//                             </div>
//                             <span>{image.ref_id || '-'}</span>
//                         </div>
//                     </div>
//                 </div>
                
//                 {/* Image Information */}
//                 <div className="md:w-1/2">
//                     {isEditing ? (
//                         <div className="bg-white border border-gray-200 rounded-lg p-5">
//                             <h3 className="font-medium text-gray-700 mb-4">แก้ไขข้อมูล</h3>
                            
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     ประเภท
//                                 </label>
//                                 <div className="p-2 bg-gray-100 rounded border border-gray-200">
//                                     {refTypeToLabel(image.ref_type)}
//                                 </div>
//                                 <p className="text-xs text-gray-500 mt-1">
//                                     ไม่สามารถแก้ไขประเภทได้
//                                 </p>
//                             </div>
                            
//                             <div className="mb-4">
//                                 <label htmlFor="ref_id" className="block text-sm font-medium text-gray-700 mb-1">
//                                     ID อ้างอิง
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="ref_id"
//                                     name="ref_id"
//                                     className="w-full p-2 border border-gray-300 rounded-lg"
//                                     value={editData.ref_id || ''}
//                                     onChange={handleInputChange}
//                                     placeholder="ระบุ ID อ้างอิง (ถ้ามี)"
//                                 />
//                             </div>
                            
//                             <div className="flex justify-end mt-6 space-x-2">
//                                 <button
//                                     type="button"
//                                     onClick={handleCancelEdit}
//                                     className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                                 >
//                                     ยกเลิก
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={handleSaveEdit}
//                                     className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                                 >
//                                     บันทึก
//                                 </button>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="bg-gray-50 rounded-lg p-5">
//                             <h3 className="font-medium text-gray-700 mb-4">ข้อมูลเพิ่มเติม</h3>
                            
//                             <div className="mb-6">
//                                 <div className="flex justify-between text-sm mb-1">
//                                     <span className="text-gray-500">ID:</span>
//                                     <span className="font-medium">{image.id}</span>
//                                 </div>
//                                 <div className="flex justify-between text-sm mb-1">
//                                     <span className="text-gray-500">พาท:</span>
//                                     <span className="font-medium">{image.image_path}</span>
//                                 </div>
//                                 <div className="flex justify-between text-sm mb-1">
//                                     <span className="text-gray-500">ขนาดไฟล์:</span>
//                                     <span className="font-medium">{getFileSize(image.image_path)}</span>
//                                 </div>
//                                 <div className="flex justify-between text-sm">
//                                     <span className="text-gray-500">วันที่แก้ไขล่าสุด:</span>
//                                     <span className="font-medium">
//                                         {image.updated_at ? formatDate(image.updated_at) : formatDate(image.created_at)}
//                                     </span>
//                                 </div>
//                             </div>
                            
//                             <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
//                                 <div className="flex justify-between items-center mb-2">
//                                     <h4 className="font-medium text-gray-700">การใช้งาน</h4>
//                                 </div>
//                                 <p className="text-sm text-gray-600 mb-2">
//                                     URL สำหรับใช้งาน:
//                                 </p>
//                                 <div className="bg-gray-100 p-2 rounded text-sm font-mono break-all">
//                                     {`${baseUrl}${image.image_path}`}
//                                 </div>
//                             </div>
                            
//                             <div className="bg-white border border-gray-200 rounded-lg p-4">
//                                 <div className="flex justify-between items-center mb-2">
//                                     <h4 className="font-medium text-gray-700">คำแนะนำ</h4>
//                                 </div>
//                                 <p className="text-sm text-gray-600">
//                                     คุณสามารถแก้ไขข้อมูลรูปภาพได้โดยคลิกที่ปุ่มแก้ไขด้านบน
//                                 </p>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Detail;

import { useState } from "react";
import { X, Download, Edit, Trash, ArrowLeft, Eye, Calendar, HardDrive, Maximize, User } from "lucide-react";

const Detail = ({ image, onClose, onDelete, baseUrl }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(image.description || "");

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
        const imageUrl = `${baseUrl}${image.image_path}`;
        
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
        try {
            // In a real implementation, you would call the API to update the image description
            // For example:
            // await axios.put(`${baseUrl}/api/image/update/${image.id}`, { description });
            
            // Update local state
            // In a real implementation, you would refresh data from API
            // For now, we'll just close edit mode
            setIsEditing(false);
            
            // Show success message
            alert("บันทึกรายละเอียดรูปภาพเรียบร้อย");
        } catch (err) {
            console.error("Error updating image description:", err);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
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

    return (
        <div className="bg-white rounded-2xl drop-shadow">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b">
                <div className="flex items-center">
                    <button 
                        onClick={onClose}
                        className="flex items-center text-gray-500 hover:text-gray-700 mr-4"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-semibold">รายละเอียดรูปภาพ</h2>
                </div>
                
                <div className="flex items-center space-x-4">
                    <button 
                        className="text-blue-500 hover:text-blue-700"
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
                        className="text-red-500 hover:text-red-700"
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
                    <div className="bg-gray-100 rounded-lg flex items-center justify-center p-2 h-80">
                        <img 
                            src={`${baseUrl}${image.image_path}`} 
                            alt={`รูปภาพ ${image.id}`}
                            className="max-w-full max-h-full object-contain rounded"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `/api/placeholder/600/400`;
                            }}
                        />
                    </div>
                    
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
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
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                                    >
                                        บันทึก
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
                                {`${baseUrl}${image.image_path}`}
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