"use client";
import Main from "./main";
import Detail from "./detail";
import { useState } from "react";

const Index = ({images: initialImages}) => { 
    const [images, setImages] = useState(initialImages);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    
    // แสดงรายละเอียดรูปภาพ
    const handleViewDetail = (image) => {
        console.log("ดูรายละเอียด:", image);
        setSelectedImage(image);
    };
    
    // เพิ่มรูปภาพใหม่
    const handleAddImage = (newImage) => {
        console.log("เพิ่มรูปภาพใหม่:", newImage);
        const image = {
            ...newImage,
            uploadDate: new Date().toLocaleDateString('th-TH'),
            views: 0,
            fileSize: "1.2 MB",
            dimensions: "1280x720"
        };
        setImages([image, ...images]);
        setShowAddModal(false);
    };
    
    // ลบรูปภาพ
    const handleDeleteImage = (imageToDelete) => {
        console.log("ลบรูปภาพ:", imageToDelete);
        if (confirm("คุณต้องการลบรูปภาพนี้ใช่หรือไม่?")) {
            const updatedImages = images.filter(img => img !== imageToDelete);
            setImages(updatedImages);
            
            // ถ้าลบรูปที่กำลังดูอยู่ ให้กลับไปหน้าหลัก
            if (selectedImage === imageToDelete) {
                setSelectedImage(null);
            }
        }
    };
    
    // แก้ไขรูปภาพ
    const handleUpdateImage = (updatedImage) => {
        console.log("บันทึกการแก้ไข:", updatedImage);
        const updatedImages = images.map(img => 
            img === selectedImage ? updatedImage : img
        );
        setImages(updatedImages);
        setSelectedImage(updatedImage);
    };
    
    // เปิด/ปิด Modal เพิ่มรูปภาพ
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
                    onUpdate={handleUpdateImage}
                />
            ) : (
                <Main 
                    images={images} 
                    handleViewDetail={handleViewDetail}
                    handleAddImage={toggleAddModal}
                    handleDeleteImage={handleDeleteImage}
                    showAddModal={showAddModal}
                    onAddImage={handleAddImage}
                    onCloseModal={() => setShowAddModal(false)}
                />
            )}
        </div>
    );
}

export default Index;