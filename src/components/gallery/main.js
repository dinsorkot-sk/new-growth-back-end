

import { useState } from "react";
import { Search, Plus, Eye, Trash, Edit, X, Image, Upload } from "lucide-react";

const Main = ({ 
    images, 
    handleViewDetail, 
    handleAddImage, 
    handleDeleteImage,
    showAddModal,
    onAddImage,
    onCloseModal
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [newImage, setNewImage] = useState({
        title: "",
        description: "",
        uploadedBy: "คุณสมศักดิ์",
        tags: ["กิจกรรม"]
    });
    const [selectedFile, setSelectedFile] = useState(null);
    
    const filteredImages = images.filter(image => 
        image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewImage({
            ...newImage,
            [name]: value
        });
    };
    
    const handleFileSelect = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newImage.title) {
            alert("กรุณาระบุชื่อรูปภาพ");
            return;
        }
        
        onAddImage(newImage);
        
        // รีเซ็ตฟอร์ม
        setNewImage({
            title: "",
            description: "",
            uploadedBy: "คุณสมศักดิ์",
            tags: ["กิจกรรม"]
        });
        setSelectedFile(null);
    };

    return (
        <div className="bg-white p-5 rounded-2xl drop-shadow">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
                    <Search className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="ค้นหารูปภาพ..."
                        className="bg-transparent outline-none w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <button 
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                    onClick={handleAddImage}
                >
                    <Plus className="h-5 w-5 mr-2" />
                    เพิ่มรูปภาพ
                </button>
            </div>
            
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                        {/* Image Preview */}
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                            <img 
                                src={`/api/placeholder/400/300`} 
                                alt={image.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {/* Image Info */}
                        <div className="p-4">
                            <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{image.description}</p>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>อัพโหลดโดย: {image.uploadedBy}</span>
                                <span>{image.uploadDate}</span>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex justify-between mt-4">
                                <button 
                                    onClick={() => handleViewDetail(image)}
                                    className="flex items-center text-blue-500 hover:text-blue-700"
                                >
                                    <Eye className="h-4 w-4 mr-1" />
                                    ดูรายละเอียด
                                </button>
                                
                                <div className="flex space-x-3">
                                    <button 
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => handleViewDetail(image)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button 
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleDeleteImage(image)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Add Image Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center border-b px-6 py-4">
                            <h3 className="text-lg font-semibold">เพิ่มรูปภาพใหม่</h3>
                            <button onClick={onCloseModal} className="text-gray-500 hover:text-gray-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            {/* File Upload */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    อัพโหลดรูปภาพ
                                </label>
                                <div 
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer"
                                    onClick={() => document.getElementById('fileUpload').click()}
                                >
                                    {selectedFile ? (
                                        <>
                                            <Image className="h-10 w-10 text-green-500 mb-2" />
                                            <p className="text-sm text-gray-700">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {Math.round(selectedFile.size / 1024)} KB
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-700">คลิกเพื่ออัพโหลดรูปภาพ</p>
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG หรือ GIF (สูงสุด 5MB)</p>
                                        </>
                                    )}
                                    <input 
                                        type="file" 
                                        id="fileUpload" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                    />
                                </div>
                            </div>
                            
                            {/* Title */}
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    ชื่อรูปภาพ *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    value={newImage.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            {/* Description */}
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    คำอธิบาย
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="3"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    value={newImage.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            
                            {/* Footer */}
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    type="button"
                                    onClick={onCloseModal}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    เพิ่มรูปภาพ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Main;