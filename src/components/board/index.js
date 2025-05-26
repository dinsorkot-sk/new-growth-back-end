"use client";
import Main from "./main";
import Detail from "./detail";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Index = ({ initialRefType = "board" }) => { 
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paginationState, setPaginationState] = useState({
        offset: 0,
        limit: 9,
        total: 0,
        currentPage: 1
    });
    const [refType, setRefType] = useState(initialRefType);
    
    const paginationValues = useMemo(() => ({
        offset: paginationState.offset,
        limit: paginationState.limit
    }), [paginationState.offset, paginationState.limit]);
    
    // Fetch images from API
    const fetchImages = useCallback(async () => {
        let isMounted = true;
        try {
            setLoading(true);
            const { offset, limit } = paginationValues;
            const authToken = Cookies.get("auth-token");
            const response = await axios.get(
               `${process.env.NEXT_PUBLIC_IMG}/api/image/getAllImage/${refType}?offset=${offset}&limit=${limit}`,
               {
                   headers: {
                       Authorization: `Bearer ${authToken}`
                   }
               }
            );
            console.log(response);
            if (isMounted) {
                setImages(response.data.images || []);
                setPaginationState(prev => ({
                    ...prev,
                    total: response.data.total || 0
                }));
                setError(null);
            }
        } catch (err) {
            if (isMounted) {
                console.error("Error fetching images:", err);
                setError("ไม่สามารถโหลดข้อมูลรูปภาพได้ กรุณาลองใหม่อีกครั้ง");
                setImages([]); // Clear images on error
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
        return () => {
            isMounted = false;
        };
    }, [paginationValues, refType]);
    
    // Load images on initial render or when pagination/refType changes
    useEffect(() => {
        const controller = new AbortController();
        fetchImages();
        return () => {
            controller.abort();
        };
    }, [fetchImages]);
    
    // Change page
    const handlePageChange = (newPage) => {
        const newOffset = (newPage - 1) * paginationValues.limit;
        setPaginationState(prev => ({
            ...prev,
            offset: newOffset,
            currentPage: newPage
        }));
    };
    
    // Change items per page
    const handleLimitChange = (newLimit) => {
        setPaginationState(prev => ({
            ...prev,
            limit: newLimit,
            offset: 0,
            currentPage: 1
        }));
    };
    
    // Change ref type
    const handleRefTypeChange = (newRefType) => {
        setRefType(newRefType);
        setPaginationState(prev => ({
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
    const handleAddImage = async (newImageData, file, description) => {
        console.log("เพิ่มรูปภาพใหม่:", description);
        try {
            setUploadLoading(true);
            const token = Cookies.get("auth-token");
            
            // Create form data for file upload
            const formData = new FormData();
            formData.append('media', file);
            formData.append('description', description);
            // Upload image to server
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API}/board/media`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(response);
            // Refresh images list
            fetchImages();
            setShowAddModal(false);
        } catch (err) {
            console.error("Error adding image:", err);
            alert("เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setUploadLoading(false);
        }
    };
    
    // Delete image
    const handleDeleteImage = async (imageToDelete) => {
        if (confirm("คุณต้องการลบรูปภาพนี้ใช่หรือไม่?")) {
            try {
                setLoading(true);
                const token = Cookies.get("auth-token");
                
                // Call API to delete image
                await axios.delete(
                    `${process.env.NEXT_PUBLIC_API}/board/${imageToDelete.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                
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
                    uploadLoading={uploadLoading}
                    error={error}
                    pagination={paginationValues}
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
                    isEmpty={!loading && (!images || images.length === 0)}
                />
            )}
        </div>
    );
}

export default Index;