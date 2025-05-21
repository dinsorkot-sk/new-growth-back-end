"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { debounce } from "lodash";

const Main = ({ handleViewDetail }) => {
    const router = useRouter();

    const [news, setNews] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("DESC");
    const [category, setCategory] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        offset: 0,
        limit: 6,
        total: 0,
    });
    const [error, setError] = useState(null);

    const { offset, limit } = pagination;

    const fetchNews = useCallback(async (signal) => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API}/news?offset=${offset}&limit=${limit}&search=${searchQuery}&sort=${sortOrder}&category=${category}`,
                { signal }
            );
            setNews(response.data.data || []);
            setPagination(prev => ({
                ...prev,
                total: response.data.total || 0
            }));
            setCategories(response.data.tag)
            setError(null);
        } catch (err) {
            if (err.name === 'CanceledError') return;
            console.error("Error fetching news:", err);
            setError("ไม่สามารถโหลดข้อมูลข่าวสารได้ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsLoading(false);
        }
    }, [offset, limit, searchQuery, sortOrder, category]);

    // สร้าง debounced version ของ fetchNews
    const debouncedFetchNews = useMemo(
        () => debounce((signal) => {
            fetchNews(signal);
        }, 500),
        [fetchNews]
    );

    useEffect(() => {
        const controller = new AbortController();
        debouncedFetchNews(controller.signal);

        return () => {
            controller.abort();
            debouncedFetchNews.cancel();
        };
    }, [debouncedFetchNews]);

    // Handler functions
    const handleSearch = useCallback(() => {
        const controller = new AbortController();
        fetchNews(controller.signal);
    }, [fetchNews]);

    const handleAddNews = () => {
        router.push(`/admin/news/create?mode=edit`);
    };

    const handleView = (item) => {
        router.push(`/admin/news/${item.id}?mode=view`);
    };

    const handleEdit = (item) => {
        router.push(`/admin/news/${item.id}?mode=edit`);
    };

    const handleDelete = (item) => {
        setSelectedNews(item);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const token = Cookies.get("auth-token");
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API}/news/${selectedNews.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setDeleteModalOpen(false);
            fetchNews(); // ดึงข้อมูลใหม่หลังลบ
        } catch (error) {
            console.error("Delete error:", error);
            alert("ลบข้อมูลไม่สำเร็จ");
        }
    };

    // ส่วน Pagination
    const handlePagination = useCallback((action) => {
        let newOffset = pagination.offset;
        const totalPages = Math.ceil(pagination.total / pagination.limit);

        if (action === "next") {
            newOffset += pagination.limit;
        } else if (action === "prev") {
            newOffset -= pagination.limit;
        }

        if (newOffset >= 0 && newOffset < pagination.total) {
            setPagination(prev => ({ ...prev, offset: newOffset }));
        }
    }, [pagination.offset, pagination.limit, pagination.total]);

    // คำนวณเลขหน้า
    const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    const dateFormatter = (p_date) => {
        const date = new Date(p_date);
        const formatter = new Intl.DateTimeFormat("en-GB", { day: '2-digit', month: 'long', year: 'numeric' });
        return formatter.format(date)
    }

    return (
        <div className="p-4 animate-fadeIn">
            <div className="bg-white flex items-center p-5 w-full drop-shadow rounded-2xl my-3 transform transition-all duration-300 hover:shadow-lg">
                <h1 className="text-2xl font-semibold">ข่าวสาร & กิจกรรม</h1>
            </div>

            {/* ส่วนค้นหาและตัวกรอง */}
            <div className="flex gap-4 mb-6 bg-white items-center p-5 w-full drop-shadow rounded-2xl my-3 transform transition-all duration-300 hover:shadow-lg">
                {/* ช่องค้นหา */}
                <input
                    type="text"
                    placeholder="ค้นหาหลักสูตร"
                    className="border border-gray-300 rounded-md p-2 px-4 flex-grow transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* ตัวเลือกการเรียงลำดับ */}
                <div className="w-64">
                    <select
                        className="border border-gray-300 rounded-md p-2 px-4 w-full appearance-none bg-white transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\" fill=\"black\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="DESC">เรียงตาม: ใหม่</option>
                        <option value="ASC">เรียงตาม: เก่า</option>
                    </select>
                </div>

                {/* ตัวเลือกหมวดหมู่ */}
                <div className="w-64">
                    <select
                        className="border border-gray-300 rounded-md p-2 px-4 w-full appearance-none bg-white transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\" fill=\"black\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">เลือกหมวดหมู่</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* ส่วนของปุ่มค้นหาและสร้างข่าวใหม่ */}
                <div className="flex justify-center gap-4">
                    <button
                        className="bg-green-500 hover:bg-green-400 cursor-pointer text-white rounded-md px-6 py-2 transition-all duration-300 transform hover:scale-105"
                        onClick={handleSearch}
                    >
                        ค้นหา
                    </button>
                    <button
                        className="border border-green-500 cursor-pointer text-green-500 rounded-md p-2 flex items-center transition-all duration-300 transform hover:scale-105 hover:bg-green-50"
                        onClick={handleAddNews}
                    >
                        <span className="mr-1">เพิ่ม</span> กิจกรรม
                    </button>
                </div>
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                            <div className="bg-gray-200 h-64 w-full"></div>
                            <div className="p-6">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* ส่วนแสดงรายการข่าว */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.length > 0 ? (
                        news.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                {/* ส่วนภาพ */}
                                <div className="bg-gray-200 h-64 w-full relative overflow-hidden">
                                    {item.image?.image_path ? (
                                        <div className="relative w-full h-64">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_IMG}/${item.image.image_path}`}
                                                alt={item.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-300 hover:scale-110"
                                                priority={false}
                                                quality={85}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
                                            <span className="text-gray-500">ไม่มีรูปภาพ</span>
                                        </div>
                                    )}
                                </div>

                                {/* ส่วนเนื้อหา */}
                                <div className="p-6">
                                    <h3 className="font-bold text-2xl mb-2 transition-colors duration-300 hover:text-green-600">{item.title}</h3>

                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-gray-500">{dateFormatter(item.published_date)}</div>
                                        <div className="text-gray-500">{item.view_count} คนอ่าน</div>
                                    </div>

                                    <p className="text-gray-700 mb-4">{item.short_description}</p>

                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-row flex-wrap">
                                            {item?.tagAssignments.map((data) => (
                                                <button
                                                    key={data.id}
                                                    className="bg-green-100 text-green-600 px-4 py-1 rounded-md text-sm mr-2 mb-2 transition-all duration-300 hover:bg-green-200"
                                                >
                                                    {data?.tag?.name}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                className="w-auto h-8 flex items-center justify-center rounded-md transition-colors duration-300 hover:text-green-600"
                                            >
                                                <span className="text-green-500 underline">อ่านแล้ว</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 mt-4">
                                        <button
                                            className="w-8 h-8 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-300 px-2 flex items-center justify-center text-white text-sm transition-all duration-300 transform hover:scale-110"
                                            onClick={() => handleView(item)}
                                        >
                                            ดู
                                        </button>
                                        <button
                                            className="w-8 h-8 rounded-md cursor-pointer bg-yellow-400 hover:bg-yellow-300 px-2 flex items-center justify-center text-white text-sm transition-all duration-300 transform hover:scale-110"
                                            onClick={() => handleEdit(item)}
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            className="w-8 h-8 rounded-md cursor-pointer bg-red-500 hover:bg-red-400 px-2 flex items-center justify-center text-white text-sm transition-all duration-300 transform hover:scale-110"
                                            onClick={() => handleDelete(item)}
                                        >
                                            ลบ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-10">
                            <p className="text-gray-500">ไม่พบข้อมูลข่าวสารหรือกิจกรรม</p>
                        </div>
                    )}
                </div>
            )}

            {/* ส่วนเลขหน้า */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-1">
                    <button
                        onClick={() => handlePagination("prev")}
                        disabled={currentPage === 1}
                        className="border rounded-md w-8 h-8 flex items-center justify-center disabled:opacity-50 transition-all duration-300 hover:bg-gray-100"
                    >
                        &lt;
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setPagination(prev => ({
                                ...prev,
                                offset: i * pagination.limit
                            }))}
                            className={`border rounded-md w-8 h-8 flex items-center justify-center transition-all duration-300 hover:bg-gray-100 ${
                                currentPage === i + 1 ? "bg-blue-500 text-white hover:bg-blue-600" : ""
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePagination("next")}
                        disabled={currentPage === totalPages}
                        className="border rounded-md w-8 h-8 flex items-center justify-center disabled:opacity-50 transition-all duration-300 hover:bg-gray-100"
                    >
                        &gt;
                    </button>
                </div>
            )}

            {/* Modal ยืนยันการลบ */}
            {deleteModalOpen && selectedNews && (
                <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 transform transition-all duration-300 animate-scaleIn">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold mb-4">ยืนยันการลบ</h2>
                            <p className="text-gray-600">
                                คุณต้องการลบ {selectedNews.title} ใช่หรือไม่?
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                การดำเนินการนี้ไม่สามารถเรียกคืนได้
                            </p>
                        </div>

                        <div className="flex justify-center space-x-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="border border-gray-300 cursor-pointer text-gray-700 px-6 py-2 rounded-md transition-all duration-300 hover:bg-gray-100"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-400 cursor-pointer text-white px-6 py-2 rounded-md transition-all duration-300 transform hover:scale-105"
                            >
                                ลบ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Main;