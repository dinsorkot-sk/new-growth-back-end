// "use client";
// import Main from "./main";
// import Detail from "./detail";
// import { useState } from "react";

// const Index = ({images: initialImages}) => { 
//     const [images, setImages] = useState(initialImages);
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [showAddModal, setShowAddModal] = useState(false);
    
//     // แสดงรายละเอียดรูปภาพ
//     const handleViewDetail = (image) => {
//         console.log("ดูรายละเอียด:", image);
//         setSelectedImage(image);
//     };
    
//     // เพิ่มรูปภาพใหม่
//     const handleAddImage = (newImage) => {
//         console.log("เพิ่มรูปภาพใหม่:", newImage);
//         const image = {
//             ...newImage,
//             uploadDate: new Date().toLocaleDateString('th-TH'),
//             views: 0,
//             fileSize: "1.2 MB",
//             dimensions: "1280x720"
//         };
//         setImages([image, ...images]);
//         setShowAddModal(false);
//     };
    
//     // ลบรูปภาพ
//     const handleDeleteImage = (imageToDelete) => {
//         console.log("ลบรูปภาพ:", imageToDelete);
//         if (confirm("คุณต้องการลบรูปภาพนี้ใช่หรือไม่?")) {
//             const updatedImages = images.filter(img => img !== imageToDelete);
//             setImages(updatedImages);
            
//             // ถ้าลบรูปที่กำลังดูอยู่ ให้กลับไปหน้าหลัก
//             if (selectedImage === imageToDelete) {
//                 setSelectedImage(null);
//             }
//         }
//     };
    
//     // แก้ไขรูปภาพ
//     const handleUpdateImage = (updatedImage) => {
//         console.log("บันทึกการแก้ไข:", updatedImage);
//         const updatedImages = images.map(img => 
//             img === selectedImage ? updatedImage : img
//         );
//         setImages(updatedImages);
//         setSelectedImage(updatedImage);
//     };
    
//     // เปิด/ปิด Modal เพิ่มรูปภาพ
//     const toggleAddModal = () => {
//         setShowAddModal(!showAddModal);
//     };

//     return (
//         <div>
//             {selectedImage ? (
//                 <Detail 
//                     image={selectedImage} 
//                     onClose={() => setSelectedImage(null)}
//                     onDelete={handleDeleteImage}
//                     onUpdate={handleUpdateImage}
//                 />
//             ) : (
//                 <Main 
//                     images={images} 
//                     handleViewDetail={handleViewDetail}
//                     handleAddImage={toggleAddModal}
//                     handleDeleteImage={handleDeleteImage}
//                     showAddModal={showAddModal}
//                     onAddImage={handleAddImage}
//                     onCloseModal={() => setShowAddModal(false)}
//                 />
//             )}
//         </div>
//     );
// }

// export default Index;


"use client";
import Main from "./main";
import Detail from "./detail";
import { useState, useEffect } from "react";
import axios from "axios";

const Index = ({ initialRefType = "course" }) => { 
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        offset: 0,
        limit: 9,
        total: 0,
        currentPage: 1
    });
    const [refType, setRefType] = useState(initialRefType);
    
    // Fetch images from API
    const fetchImages = async () => {
        try {
            setLoading(true);
            const { offset, limit } = pagination;
            const response = await axios.get(
               `${process.env.NEXT_PUBLIC_IMG}/api/image/getAllImage/${refType}?offset=${offset}&limit=${limit}`
            );
            
            setImages(response.data.images || []);
            setPagination(prev => ({
                ...prev,
                total: response.data.total || 0
            }));
            setError(null);
        } catch (err) {
            console.error("Error fetching images:", err);
            setError("ไม่สามารถโหลดข้อมูลรูปภาพได้ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setLoading(false);
        }
    };
    
    // Load images on initial render or when pagination/refType changes
    useEffect(() => {
        fetchImages();
    }, [pagination.offset, pagination.limit, refType]);
    
    // Change page
    const handlePageChange = (newPage) => {
        const newOffset = (newPage - 1) * pagination.limit;
        setPagination(prev => ({
            ...prev,
            offset: newOffset,
            currentPage: newPage
        }));
    };
    
    // Change items per page
    const handleLimitChange = (newLimit) => {
        setPagination(prev => ({
            ...prev,
            limit: newLimit,
            offset: 0,
            currentPage: 1
        }));
    };
    
    // Change ref type
    const handleRefTypeChange = (newRefType) => {
        setRefType(newRefType);
        setPagination(prev => ({
            ...prev,
            offset: 0,
            currentPage: 1
        }));
    };
    
    // View image details
    const handleViewDetail = (image) => {
        console.log("ดูรายละเอียด:", image);
        setSelectedImage(image);
    };
    
    // Add new image
    const handleAddImage = async (newImageData, file,description) => {
        console.log("เพิ่มรูปภาพใหม่:", description);
        try {
            setLoading(true);
            
            // Create form data for file upload
            const formData = new FormData();
            formData.append('image', file);
            formData.append('ref_type', refType);
            formData.append('ref_id', newImageData.ref_id || null);
            formData.append('description', description);
            // Upload image to server
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API}/image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            // Refresh images list
            fetchImages();
            setShowAddModal(false);
        } catch (err) {
            console.error("Error adding image:", err);
            alert("เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setLoading(false);
        }
    };
    
    // Delete image
    const handleDeleteImage = async (imageToDelete) => {
        if (confirm("คุณต้องการลบรูปภาพนี้ใช่หรือไม่?")) {
            try {
                setLoading(true);
                
                // Call API to delete image
                await axios.delete(`${process.env.NEXT_PUBLIC_API}/image/${imageToDelete.id}`);
                
                // Refresh images list
                fetchImages();
                
                // If viewing the deleted image, return to gallery
                if (selectedImage && selectedImage.id === imageToDelete.id) {
                    setSelectedImage(null);
                }
            } catch (err) {
                console.error("Error deleting image:", err);
                alert("เกิดข้อผิดพลาดในการลบรูปภาพ กรุณาลองใหม่อีกครั้ง");
            } finally {
                setLoading(false);
            }
        }
    };
    
    // Toggle add modal
    const toggleAddModal = () => {
        setShowAddModal(!showAddModal);
    };

    return (
        <div>
            {selectedImage ? (
                <Detail 
                    image={selectedImage} 
                    onClose={() => setSelectedImage(null)}
                    onDelete={handleDeleteImage}
                    baseUrl={`${process.env.NEXT_PUBLIC_IMG}`}
                />
            ) : (
                <Main 
                    images={images} 
                    loading={loading}
                    error={error}
                    pagination={pagination}
                    refType={refType}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    onRefTypeChange={handleRefTypeChange}
                    handleViewDetail={handleViewDetail}
                    handleAddImage={toggleAddModal}
                    handleDeleteImage={handleDeleteImage}
                    showAddModal={showAddModal}
                    onAddImage={handleAddImage}
                    onCloseModal={() => setShowAddModal(false)}
                    baseUrl={`${process.env.NEXT_PUBLIC_IMG}`}
                />
            )}
        </div>
    );
}

export default Index;