// ส่วนการแสดงการ์ดข่าวที่ปรับปรุงใหม่ใน main.js
import { useState } from "react";

const Main = ({ news, handleViewDetail }) => {
    // const [searchQuery, setSearchQuery] = useState("");
    
    // const filteredNews = news?.filter(item => 
    //     item.title.toLowerCase().includes(searchQuery.toLowerCase())
    // ) || [];

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [category, setCategory] = useState("");
    
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
                        className="border border-gray-300 rounded-md p-2 px-4 w-full appearance-none bg-white border-2 border-black"
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
            <div className="flex justify-center gap-4 mb-6">
                <button className="bg-green-500 text-white rounded-md px-6 py-2">ค้นหา</button>
                <button className="border border-green-500 text-green-500 rounded-md p-2 flex items-center" onClick={() => handleViewDetail(news)}>
                    <span className="mr-1">+</span> สร้างข่าวสาร/กิจกรรม
                </button>
            </div>
            </div>
            
           
            
            {/* ส่วนแสดงรายการข่าว */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* ส่วนภาพ */}
                        <div className="bg-gray-200 h-64 w-full"></div>
                        
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
                                    onClick={() => handleViewDetail(item)}
                                >
                                    {item.category}
                                </button>
                                
                                <div className="flex space-x-2">
                                    <button 
                                        className="w-8 h-8 flex items-center justify-center rounded-md"
                                        onClick={() => handleViewDetail(item)}
                                    >
                                        <span className="text-green-500 underline">อ่านแล้ว</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex space-x-2 mt-4">
                                <button className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white text-sm" onClick={() => handleViewDetail(news)}>
                                    ดู
                                </button>
                                <button className="w-8 h-8 rounded-md bg-yellow-400 flex items-center justify-center text-white text-sm" onClick={() => handleViewDetail(news)}>
                                    แก้ไข
                                </button>
                                <button className="w-8 h-8 rounded-md bg-red-500 flex items-center justify-center text-white text-sm">
                                    ลบ
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* ส่วนเลขหน้า */}
            <div className="mt-6 flex justify-center gap-1">
                <button className="border rounded-md w-8 h-8 flex items-center justify-center">&lt;</button>
                <button className="border rounded-md w-8 h-8 flex items-center justify-center bg-blue-500 text-white">1</button>
                <button className="border rounded-md w-8 h-8 flex items-center justify-center">2</button>
                <button className="border rounded-md w-8 h-8 flex items-center justify-center">3</button>
                <button className="border rounded-md w-8 h-8 flex items-center justify-center">4</button>
                <button className="border rounded-md w-8 h-8 flex items-center justify-center">5</button>
                <button className="border rounded-md w-8 h-8 flex items-center justify-center">&gt;</button>
            </div>
        </div>
    );
};

export default Main;