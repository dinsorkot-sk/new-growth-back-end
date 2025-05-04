import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Main = ({ handleViewDetail }) => {
    const [news, setNews] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [category, setCategory] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [pagination, setPagination] = useState({
        offset: 0,
        limit: 6,
        total: 0,
    });

    // กรองและจัดเรียงข่าว
    const getFilteredNews = () => {
        let result = [...news];

        // กรองตามข้อความค้นหา
        if (searchQuery) {
            result = result.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // กรองตามหมวดหมู่
        if (category) {
            result = result.filter(item => item.category === category);
        }

        // จัดเรียง
        if (sortOrder === "newest") {
            result.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        } else if (sortOrder === "oldest") {
            result.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
        }

        return result;
    };

    const filteredNews = getFilteredNews();

    // รายการหมวดหมู่สำหรับ dropdown
    const categories = [
        { value: "", label: "หมวดหมู่" },
        { value: "กิจกรรม", label: "กิจกรรม" },
        { value: "การศึกษา", label: "การศึกษา" },
        { value: "สัมมนา", label: "สัมมนา" },
        { value: "ข่าวสาร", label: "ข่าวสาร" }
    ];

    const fetchNews = async () => {
        try {
            const token = Cookies.get("auth-token");
            const params = {
                offset: pagination.offset,
                limit: pagination.limit,
                search: searchQuery,
                category,
                sort: sortOrder === "newest" ? "DESC" : "ASC",
            };

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API}/news`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params,
                }
            );

            setNews(response.data.data);
            setPagination(prev => ({
                ...prev,
                total: response.data.pagination.totalCount,
            }));
        } catch (error) {
            console.error("Error fetching news:", error);
            alert("ดึงข้อมูลไม่สำเร็จ");
        }
    };

    useEffect(() => {
        fetchNews();
    }, [pagination.offset, searchQuery, sortOrder, category]);

    // Handler functions
    const handleSearch = () => {
        fetchNews();
    };

    const handleAddNews = () => {
        handleViewDetail(null);
    };

    const handleView = (item) => {
        handleViewDetail(item);
    };

    const handleEdit = (item) => {
        handleViewDetail({ ...item, mode: "edit" });
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
    const handlePagination = (action) => {
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
    };

    // คำนวณเลขหน้า
    const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    return (
        <div className="p-4">
            <div className="bg-white flex items-center p-5 w-full drop-shadow rounded-2xl my-3">
                <h1 className="text-2xl font-semibold">ข่าวสาร & กิจกรรม</h1>
            </div>

            {/* ส่วนค้นหาและตัวกรอง */}
            <div className="flex gap-4 mb-6 bg-white items-center p-5 w-full drop-shadow rounded-2xl my-3">
                {/* ช่องค้นหา */}
                <input
                    type="text"
                    placeholder="ค้นหาหลักสูตร"
                    className="border border-gray-300 rounded-md p-2 px-4 flex-grow"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* ตัวเลือกการเรียงลำดับ */}
                <div className="w-64">
                    <select
                        className="border border-gray-300 rounded-md p-2 px-4 w-full appearance-none bg-white"
                        style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\" fill=\"black\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest">เรียงตาม: ใหม่</option>
                        <option value="oldest">เรียงตาม: เก่า</option>
                    </select>
                </div>

                {/* ตัวเลือกหมวดหมู่ */}
                <div className="w-64">
                    <select
                        className="border border-gray-300 rounded-md p-2 px-4 w-full appearance-none bg-white"
                        style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\" fill=\"black\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                {/* ส่วนของปุ่มค้นหาและสร้างข่าวใหม่ */}
                <div className="flex justify-center gap-4">
                    <button
                        className="bg-green-500 text-white rounded-md px-6 py-2"
                        onClick={handleSearch}
                    >
                        ค้นหา
                    </button>
                    <button
                        className="border border-green-500 text-green-500 rounded-md p-2 flex items-center"
                        onClick={handleAddNews}
                    >
                        <span className="mr-1">+</span> กิจกรรม
                    </button>
                </div>
            </div>

            {/* ส่วนแสดงรายการข่าว */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.length > 0 ? (
                    filteredNews.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* ส่วนภาพ */}
                            <div className="bg-gray-200 h-64 w-full relative">
                                {item.image?.image_path ? (
                                    <img
                                        crossorigin='anonymous'
                                        src={`${process.env.NEXT_PUBLIC_IMG}/${item.image.image_path}`}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-gray-500">ไม่มีรูปภาพ</span>
                                    </div>
                                )}
                            </div>

                            {/* ส่วนเนื้อหา */}
                            <div className="p-6">
                                <h3 className="font-bold text-2xl mb-2">{item.title}</h3>

                                <div className="flex justify-between items-center mb-3">
                                    <div className="text-gray-500">{item.publishDate}</div>
                                    <div className="text-gray-500">{item.viewCount} คนอ่าน</div>
                                </div>

                                <p className="text-gray-700 mb-4">{item.shortDescription}</p>

                                <div className="flex justify-between items-center">
                                    <button
                                        className="bg-green-100 text-green-600 px-4 py-1 rounded-md text-sm"
                                    >
                                        {item.category}
                                    </button>

                                    <div className="flex space-x-2">
                                        <button
                                            className="w-8 h-8 flex items-center justify-center rounded-md"
                                        >
                                            <span className="text-green-500 underline">อ่านแล้ว</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex space-x-2 mt-4">
                                    <button
                                        className="w-8 h-8 rounded-md bg-blue-500 px-2 flex items-center justify-center text-white text-sm"
                                        onClick={() => handleView(item)}
                                    >
                                        ดู
                                    </button>
                                    <button
                                        className="w-8 h-8 rounded-md bg-yellow-400 px-2 flex items-center justify-center text-white text-sm"
                                        onClick={() => handleEdit(item)}
                                    >
                                        แก้ไข
                                    </button>
                                    <button
                                        className="w-8 h-8 rounded-md bg-red-500 px-2 flex items-center justify-center text-white text-sm"
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

            {/* ส่วนเลขหน้า */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-1">
                    <button
                        onClick={() => handlePagination("prev")}
                        disabled={currentPage === 1}
                        className="border rounded-md w-8 h-8 flex items-center justify-center disabled:opacity-50"
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
                            className={`border rounded-md w-8 h-8 flex items-center justify-center ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePagination("next")}
                        disabled={currentPage === totalPages}
                        className="border rounded-md w-8 h-8 flex items-center justify-center disabled:opacity-50"
                    >
                        &gt;
                    </button>
                </div>
            )}

            {/* Modal ยืนยันการลบ */}
            {deleteModalOpen && selectedNews && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6">
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
                                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 text-white px-6 py-2 rounded-md"
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