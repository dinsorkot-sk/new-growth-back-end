import { X, Download, Edit, Trash, ArrowLeft, Eye } from "lucide-react";

const Detail = ({ image, onClose }) => {
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
                    <button className="text-blue-500 hover:text-blue-700">
                        <Download className="h-5 w-5" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                        <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
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
                            src={`/api/placeholder/600/400`} 
                            alt={image.title}
                            className="max-w-full max-h-full object-contain rounded"
                        />
                    </div>
                    
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-700 mb-3">ข้อมูลไฟล์</h3>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <span className="text-gray-500">ชื่อไฟล์:</span>
                            <span>image_{Math.floor(Math.random() * 1000)}.jpg</span>
                            
                            <span className="text-gray-500">ขนาด:</span>
                            <span>{image.fileSize}</span>
                            
                            <span className="text-gray-500">ความละเอียด:</span>
                            <span>{image.dimensions}</span>
                            
                            <span className="text-gray-500">วันที่อัพโหลด:</span>
                            <span>{image.uploadDate}</span>
                        </div>
                    </div>
                </div>
                
                {/* Image Details */}
                <div className="md:w-1/2">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อรูปภาพ</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={image.title}
                            readOnly
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
                        <textarea 
                            className="w-full p-2 border border-gray-300 rounded-lg h-32"
                            value={image.description}
                            readOnly
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">แท็ก</label>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">กิจกรรม</span>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">อบรม</span>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">สัมมนา</span>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-700">สถิติการเข้าชม</h3>
                            <div className="flex items-center text-sm text-gray-500">
                                <Eye className="h-4 w-4 mr-1" />
                                <span>{image.views} ครั้ง</span>
                            </div>
                        </div>
                        <div className="h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                            กราฟแสดงสถิติการเข้าชม
                        </div>
                    </div>
                    
                    <div>
                        <button
                            onClick={onClose}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mr-2"
                        >
                            ยกเลิก
                        </button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;