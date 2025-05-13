import { useState } from "react";
import { Search, Plus, Eye, Trash, Edit, X, Image, Upload, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";

const Main = ({ 
    images, 
    loading,
    error,
    pagination,
    refType,
    onPageChange,
    onLimitChange,
    onRefTypeChange,
    handleViewDetail, 
    handleAddImage, 
    handleDeleteImage,
    showAddModal,
    onAddImage,
    onCloseModal,
    baseUrl
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [newImage, setNewImage] = useState({
        ref_id: null,
        ref_type: refType
    });
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState("");
    
    const filteredImages = images.filter(image => 
        // Only filter client-side if searching
        !searchTerm || 
        (image.id && image.id.toString().includes(searchTerm)) ||
        (image.ref_id && image.ref_id.toString().includes(searchTerm)) ||
        (image.image_path && image.image_path.toLowerCase().includes(searchTerm.toLowerCase()))
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
    
    // const handleSubmit = (e) => {
    //     e.preventDefault();
        
    //     if (!selectedFile) {
    //         alert("กรุณาเลือกรูปภาพ");
    //         return;
    //     }
        
    //     onAddImage(newImage, selectedFile);
        
    //     // Reset form
    //     setNewImage({
    //         ref_id: null,
    //         ref_type: refType
    //     });
    //     setSelectedFile(null);
    // };

     const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("กรุณาเลือกรูปภาพ");
      return;
    }
    if (!description) {
      alert("กรุณากรอกรายละเอียด");
      return;
    }
    
    // Include the description in your newImage object
    const imageData = {
      ...newImage,
      description: description
    };
    
    onAddImage(imageData, selectedFile,description);
    
    // Reset form
    setNewImage({
      ref_id: null,
      ref_type: refType
    });
    setSelectedFile(null);
    setDescription("");
  };

    const toggleMenu = (index) => {
        if (openMenuIndex === index) {
            setOpenMenuIndex(null);
        } else {
            setOpenMenuIndex(index);
        }
    };
    
    const closeMenu = () => {
        setOpenMenuIndex(null);
    };
    
    // Calculate total pages for pagination
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    // Generate page numbers for pagination display
    const getPageNumbers = () => {
        const pages = [];
        const maxDisplayedPages = 5;
        const currentPage = pagination.currentPage;
        
        if (totalPages <= maxDisplayedPages) {
            // Show all pages if total pages are less than max display
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always include first page
            pages.push(1);
            
            // Calculate start and end of displayed pages
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            
            // Adjust if at edges
            if (currentPage <= 2) {
                end = 4;
            } else if (currentPage >= totalPages - 1) {
                start = totalPages - 3;
            }
            
            // Add ellipsis if needed
            if (start > 2) {
                pages.push('...');
            }
            
            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            // Add ellipsis if needed
            if (end < totalPages - 1) {
                pages.push('...');
            }
            
            // Always include last page
            pages.push(totalPages);
        }
        
        return pages;
    };

    const refTypeOptions = [
        { value: "course", label: "หลักสูตร" },
        { value: "news", label: "ข่าวสาร" },
        { value: "event", label: "กิจกรรม" }
    ];

    return (
        <div className="bg-white p-5 rounded-2xl drop-shadow">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-3">
                <div className="flex items-center w-full md:w-auto">
                    <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full md:w-64 mr-3">
                        <Search className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="ค้นหารูปภาพ..."
                            className="bg-transparent outline-none w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* <select 
                        className="border border-gray-300 rounded-lg px-3 py-2 outline-none"
                        value={refType}
                        onChange={(e) => onRefTypeChange(e.target.value)}
                    >
                        {refTypeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select> */}
                </div>
                
                <button 
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center w-full md:w-auto justify-center"
                    onClick={handleAddImage}
                >
                    <Plus className="h-5 w-5 mr-2" />
                    เพิ่มรูปภาพ
                </button>
            </div>
            
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-5">
                    {error}
                </div>
            )}
            
            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center p-10">
                    <div className="loading-bounce">
                        <span className="loading-bounce-dot"></span>
                        <span className="loading-bounce-dot"></span>
                        <span className="loading-bounce-dot"></span>
                    </div>
                </div>
            )}
            
            {/* Empty State */}
            {!loading && images.length === 0 && (
                <div className="bg-gray-50 rounded-lg p-10 text-center">
                    <Image className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">ไม่พบรูปภาพ</h3>
                    <p className="text-gray-500 mb-4">ยังไม่มีรูปภาพในระบบ หรือลองเปลี่ยนประเภทการค้นหา</p>
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                        onClick={handleAddImage}
                    >
                        <Plus className="h-5 w-5 inline mr-2" />
                        เพิ่มรูปภาพใหม่
                    </button>
                </div>
            )}
            
            {/* Gallery Grid */}
            {!loading && images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredImages.map((image, index) => (
                        <div key={image.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                            {/* Image Preview */}
                            <div 
                                className="h-48 bg-gray-200 flex items-center justify-center relative cursor-pointer"
                                onClick={() => handleViewDetail(image)}
                            >
                                <img 
                                    src={`${baseUrl}/${image.image_path}`} 
                                    alt={`รูปภาพ ${image.id}`}
                                    className="w-full h-full object-cover animate-fadeInImg"
                                />
                                {/* Menu Button */}
                                <button 
                                    className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 rounded-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMenu(index);
                                    }}
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                                
                                {/* Dropdown Menu */}
                                {openMenuIndex === index && (
                                    <div className="absolute top-10 right-2 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                                        <button 
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewDetail(image);
                                                closeMenu();
                                            }}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            ดูรายละเอียด
                                        </button>
                                        <button 
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteImage(image);
                                                closeMenu();
                                            }}
                                        >
                                            <Trash className="h-4 w-4 mr-2" />
                                            ลบ
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-500">
                        แสดง {Math.min(pagination.offset + 1, pagination.total)} - {Math.min(pagination.offset + pagination.limit, pagination.total)} จาก {pagination.total} รายการ
                        {/* <select 
                            className="ml-2 border border-gray-300 rounded px-2 py-1"
                            value={pagination.limit}
                            onChange={(e) => onLimitChange(Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select> */}
                    </div>
                    
                    <div className="flex items-center">
                        <button 
                            className="p-2 border rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={pagination.currentPage === 1}
                            onClick={() => onPageChange(pagination.currentPage - 1)}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        
                        {getPageNumbers().map((page, index) => (
                            <button 
                                key={index}
                                className={`px-3 py-1 border-t border-b ${
                                    page === pagination.currentPage 
                                        ? 'bg-blue-500 text-white' 
                                        : 'hover:bg-gray-50'
                                } ${page === '...' ? 'cursor-default' : ''}`}
                                onClick={() => page !== '...' && onPageChange(page)}
                                disabled={page === '...'}
                            >
                                {page}
                            </button>
                        ))}
                        
                        <button 
                            className="p-2 border rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={pagination.currentPage === totalPages}
                            onClick={() => onPageChange(pagination.currentPage + 1)}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
            
            {/* Add Image Modal */}
            {/* {showAddModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-xl shadow-xl transform transition-all animate-fade-in ">
            <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50 rounded-t-lg">
                <h3 className="text-lg font-semibold text-gray-800">เพิ่มรูปภาพใหม่</h3>
                <button 
                    onClick={onCloseModal} 
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-full transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
               
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        อัพโหลดรูปภาพ <span className="text-red-500">*</span>
                    </label>
                    <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                        onClick={() => document.getElementById('fileUpload').click()}
                    >
                        {selectedFile ? (
                            <>
                                <Image className="h-12 w-12 text-green-500 mb-3" />
                                <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {Math.round(selectedFile.size / 1024)} KB
                                </p>
                            </>
                        ) : (
                            <>
                                <Upload className="h-12 w-12 text-gray-400 mb-3" />
                                <p className="text-sm font-medium text-gray-700">คลิกเพื่ออัพโหลดรูปภาพ</p>
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
                
                
                <div className="flex justify-end space-x-3 mt-8">
                    <button
                        type="button"
                        onClick={onCloseModal}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium shadow-sm transition-colors"
                    >
                        เพิ่มรูปภาพ
                    </button>
                </div>
            </form>
        </div>
    </div>
)} */}

 {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-xl shadow-xl transform transition-all animate-fade-in">
            <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-800">เพิ่มรูปภาพใหม่</h3>
              <button 
                onClick={onCloseModal} 
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  อัพโหลดรูปภาพ <span className="text-red-500">*</span>
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                  onClick={() => document.getElementById('fileUpload').click()}
                >
                  {selectedFile ? (
                    <>
                      <Image className="h-12 w-12 text-green-500 mb-3" />
                      <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round(selectedFile.size / 1024)} KB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-700">คลิกเพื่ออัพโหลดรูปภาพ</p>
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
              
              {/* Text Editor for Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รายละเอียดรูปภาพ
                </label>
                <div className="border border-gray-300 rounded-lg">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-32 p-3 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="กรอกรายละเอียดของรูปภาพ..."
                  />
                  
                </div>
              
              </div>
              
              {/* Footer */}
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium shadow-sm transition-colors"
                >
                  เพิ่มรูปภาพ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
    );
};

export default Main;