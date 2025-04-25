
"use client";

const Main = ({ courses, handleViewDetail }) => {    

    return (
        <div className="flex flex-col gap-5 w-full">
        {/* Search and Filter Section */}
        <div className="bg-white flex flex-col md:flex-row items-center gap-3 p-5 w-full drop-shadow rounded-2xl">
                <div className="w-full md:w-1/3">
                    <label htmlFor="search" className="sr-only">ค้นหาหลักสูตร</label>
                    <input 
                        type="text" 
                        id="search"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#26A65B] focus:border-[#26A65B]" 
                        placeholder="ค้นหาหลักสูตร" 
                    />
                </div>
                
                <div className="w-full md:w-1/6">
                    <label htmlFor="sorter" className="sr-only">เรียงตาม</label>
                    <select 
                        id="sorter" 
                        className="w-full border border-gray-300 text-sm rounded-lg p-2.5 focus:ring-[#26A65B] focus:border-[#26A65B]"
                    >
                        <option value="">เรียงตาม</option>
                        <option value="new">ใหม่</option>
                        <option value="old">เก่า</option>
                    </select>
                </div>

                <div className="w-full md:w-1/6">
                    <label htmlFor="categories" className="sr-only">หมวดหมู่</label>
                    <select 
                        id="categories" 
                        className="w-full border border-gray-300 text-sm rounded-lg p-2.5 focus:ring-[#26A65B] focus:border-[#26A65B]"
                    >
                        <option value="">หมวดหมู่</option>
                        <option value="1">หมวดหมู่ที่ 1</option>
                        <option value="2">หมวดหมู่ที่ 2</option>
                    </select>
                </div>

                <div className="w-full md:w-1/4 flex gap-3">
                    <button className="w-full bg-[#26A65B] text-white rounded-lg px-3 py-2 hover:bg-[#1F8347] transition-colors">
                        ค้นหาหลักสูตร
                    </button>
                    <button className="w-full border-2 border-[#26A65B] text-[#26A65B] rounded-lg px-3 py-2 hover:bg-[#26A65B]/10 transition-colors">
                        เพิ่มหลักสูตร
                    </button>
                </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.map((course, index) => (
                <div key={index} className="bg-white drop-shadow rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-[#D9D9D9] h-48 w-full"></div>
                    <div className="p-4 flex flex-col gap-2">
                        <h3 className="text-lg font-medium">{course.title}</h3>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>โดย {course.instructor}</span>
                            <span>{course.interested} คนสนใจ</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-xl ${i < course.rating ? 'text-[#FBC700]' : 'text-gray-300'}`}>★</span>
                            ))}
                            <span className="text-sm text-gray-600">({course.reviews} รีวิว)</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>
                        <div className="flex justify-end mt-2">
                            <button className="bg-[#26A65B] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#1F8347] transition-colors cursor-pointer" onClick={() => handleViewDetail(course)}>
                                ดูรายละเอียด
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Pagination */}
        <nav aria-label="Page navigation">
            <ul className="flex items-center -space-x-px h-8 text-sm justify-center mt-4">
                <li>
                    <button className="flex items-center justify-center px-3 h-8 ms-0 text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100">
                        <span className="sr-only">Previous</span>
                        <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
                        </svg>
                    </button>
                </li>
                {[1, 2, 3, 4, 5].map((page) => (
                    <li key={page}>
                        <button className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 ${page === 3 ? 'bg-[#26A65B] text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
                            {page}
                        </button>
                    </li>
                ))}
                <li>
                    <button className="flex items-center justify-center px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100">
                        <span className="sr-only">Next</span>
                        <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    </div>
    );
}

export default Main;