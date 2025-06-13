"use client";
import Main from "./main";
import Detail from "./detail";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Index = ({ initialRefType = "vibe" }) => { 
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
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
        limit: paginationState.limit,
        total: paginationState.total,
        currentPage: paginationState.currentPage
    }), [paginationState.offset, paginationState.limit, paginationState.total, paginationState.currentPage]);
    
    // Fetch images and videos from API
    const fetchImages = useCallback(async () => {
        let isMounted = true;
        try {
            setLoading(true);
            const { offset, limit } = paginationValues;
            const authToken = Cookies.get("auth-token");
            if (!authToken) {
                router.push("/admin/login");
            }
            const response = await axios.get(
               `${process.env.NEXT_PUBLIC_IMG}/api/image/getAllImage/${refType}?offset=${offset}&limit=${limit}`,
               {
                   headers: {
                       Authorization: `Bearer ${authToken}`
                   }
               }
            );
            
            if (isMounted) {
                setImages(response.data.images || []);
                setVideos(response.data.videos || []);
                setPaginationState(prev => ({
                    ...prev,
                    total: (response.data.pagination.images.total || 0) + (response.data.pagination.videos.total || 0),
                    offset: response.data.pagination.images.offset || 0,
                    limit: response.data.pagination.images.limit || 9
                }));
                setError(null);
            }
        } catch (err) {
            if (isMounted) {
                console.error("Error fetching images:", err);
                setError("ไม่สามารถโหลดข้อมูลรูปภาพได้ กรุณาลองใหม่อีกครั้ง");
                setImages([]); // Clear images on error
                setVideos([]); // Clear videos on error
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
    const handleAddImage = async (mediaData, file, description, uploadType) => {
        console.log(`เพิ่ม${uploadType === 'image' ? 'รูปภาพ' : 'วิดีโอ'}ใหม่:`, description);
        try {
            setLoading(true);
            const token = Cookies.get("auth-token");
            if (!token) {
                router.push("/admin/login");
            }

            // Create form data for file upload
            const formData = new FormData();
            if (uploadType === 'image') {
                formData.append('image', file);
            } else {
                formData.append('video', file); // Assuming the backend expects 'video' for video files
                formData.append('title', mediaData.description); // Assuming video title is the description
            }
            formData.append('ref_type', refType);
            formData.append('ref_id', mediaData.ref_id || null);
            formData.append('description', description);

            let apiUrl = '';
            if (uploadType === 'image') {
                apiUrl = `${process.env.NEXT_PUBLIC_API}/image`;
            } else {
                apiUrl = `${process.env.NEXT_PUBLIC_API}/video/upload-video`; // Assuming this is the video upload endpoint
            }

            // Upload file to server
            const response = await axios.post(
                apiUrl,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Refresh images list
            fetchImages();
            setShowAddModal(false);
        } catch (err) {
            console.error(`Error adding ${uploadType === 'image' ? 'image' : 'video'}:`, err);
            alert(`เกิดข้อผิดพลาดในการอัพโหลด${uploadType === 'image' ? 'รูปภาพ' : 'วิดีโอ'} กรุณาลองใหม่อีกครั้ง`);
        } finally {
            setLoading(false);
        }
    };
    
    // Delete image
    const handleDeleteImage = async (itemToDelete) => {
        const isVideo = !!itemToDelete.files;
        const confirmMessage = isVideo ? "คุณต้องการลบวิดีโอนี้ใช่หรือไม่?" : "คุณต้องการลบรูปภาพนี้ใช่หรือไม่?";

        if (confirm(confirmMessage)) {
            try {
                setLoading(true);
                const token = Cookies.get("auth-token");
                if (!token) {
                    router.push("/admin/login");
                }
                
                let apiUrl = '';
                if (isVideo) {
                    apiUrl = `${process.env.NEXT_PUBLIC_API}/video/delete/${itemToDelete.id}`;
                } else {
                    apiUrl = `${process.env.NEXT_PUBLIC_API}/image/${itemToDelete.id}`;
                }

                // Call API to delete item
                await axios.delete(
                    apiUrl,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                
                // Refresh images list
                fetchImages();
                
                // If viewing the deleted item, return to gallery
                if (selectedImage && selectedImage.id === itemToDelete.id) {
                    setSelectedImage(null);
                }
            } catch (err) {
                console.error("Error deleting item:", err);
                alert("เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง");
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
                    onRefresh={fetchImages}
                />
            ) : (
                <Main 
                    images={images}
                    videos={videos}
                    loading={loading}
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
                    isEmpty={!loading && (!images || images.length === 0) && (!videos || videos.length === 0)}
                    onRefresh={fetchImages}
                />
            )}
        </div>
    );
}

export default Index;