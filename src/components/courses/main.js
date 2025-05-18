"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const decimalPart = rating % 1;

  return (
    <div className="flex items-center">
      {/* ดาวเต็ม */}
      {[...Array(fullStars)].map((_, index) => (
        <svg
          key={`full-${index}`}
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}

      {/* ดาวครึ่ง */}
      {decimalPart >= 0.5 && (
        <svg
          key="half"
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M5.354 5.119L7.538.792A.516.516 0 018 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0116 6.32a.548.548 0 01-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 01-.746-.592l.83-4.73L.173 6.765a.55.55 0 01-.172-.403.59.59 0 01.085-.302.513.513 0 01.37-.245l4.898-.696zM8 12.027a.5.5 0 01.232.056l3.686 1.894-.694-3.957a.565.565 0 01.162-.505l2.907-2.77-4.052-.576a.525.525 0 01-.393-.288L8.001 2.223 8 2.226v9.8z" />
        </svg>
      )}

      {/* ดาวว่าง */}
      {[...Array(5 - Math.ceil(rating))].map((_, index) => (
        <svg
          key={`empty-${index}`}
          className="w-4 h-4 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// const Main = ({ handleViewDetail })
const Main = () => {
  const router = useRouter();

  const handleViewDetail = (course) => {
  if (!course?.id) {
    router.push("/admin/courses/create");
  } else {
    router.push(`/admin/courses/${course.id}`);
  }
};
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [industries, setIndustries] = useState([]);

  const limit = 8; // จำนวนคอร์สต่อหน้า

  // ดึงข้อมูลเนื้อหา
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * limit;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/course`,
        {
          params: {
            offset,
            limit,
            search: searchTerm,
            sort: sortOrder,
            category,
          },
        }
      );

      setCourses(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setIndustries(response.data.industries);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, sortOrder, category]);

  // เปลี่ยนหน้า
  const handlePagination = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // สร้างปุ่ม pagination
  const renderPagination = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i}>
          <button
            onClick={() => handlePagination(i)}
            className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 cursor-pointer ${
              currentPage === i
                ? "bg-[#26A65B] text-white"
                : "bg-white text-gray-500 hover:bg-gray-100"
            }`}
          >
            {i}
          </button>
        </li>
      );
    }

    return pages;
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews?.length) return 0;
    return (
      reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length
    ).toFixed(1);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Search and Filter Section */}
      <div className="bg-white flex flex-col md:flex-row items-center gap-3 p-5 w-full drop-shadow rounded-2xl">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#26A65B] focus:border-[#26A65B]"
            placeholder="ค้นหาเนื้อหา"
          />
        </div>

        <div className="w-full md:w-1/6">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full border border-gray-300 text-sm rounded-lg p-2.5 focus:ring-[#26A65B] focus:border-[#26A65B] cursor-pointer"
          >
            <option value="DESC">ใหม่ล่าสุด</option>
            <option value="ASC">เก่าที่สุด</option>
          </select>
        </div>

        <div className="w-full md:w-1/6">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 text-sm rounded-lg p-2.5 focus:ring-[#26A65B] focus:border-[#26A65B] cursor-pointer"
          >
            <option value="">ทั้งหมด</option>
            {industries.map((industry) => (
              <option key={industry.id} value={industry.id}>
                {industry.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/4 flex gap-3">
          <button
            onClick={fetchCourses}
            className="w-full bg-[#26A65B] text-white rounded-lg px-3 py-2 hover:bg-[#1F8347] transition-colors cursor-pointer"
          >
            ค้นหาเนื้อหา
          </button>

          <button
            onClick={() => handleViewDetail(null)}
            className="w-full border-2 border-[#26A65B] text-[#26A65B] rounded-lg px-3 py-2 hover:bg-[#26A65B]/10 transition-colors cursor-pointer"
          >
            เพิ่มเนื้อหา
          </button>

        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white drop-shadow rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-[#D9D9D9] h-48 w-full relative">
                  {course?.image && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMG}${course.image.image_path}`}
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="text-lg font-medium">{course.name}</h3>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>โดย {course.instructor || "ไม่ระบุ"}</span>
                    <span>{course.views || 0} คนดู</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(calculateAverageRating(course.review))}
                    <span className="text-sm text-gray-600">
                      ({course.review.length || 0} รีวิว)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex justify-end mt-2">
                    {/* <button
                      onClick={() => handleViewDetail(course)}
                      className="bg-[#26A65B] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#1F8347] transition-colors cursor-pointer"
                    >
                      ดูรายละเอียด
                    </button> */}

                    <button
                      onClick={() => handleViewDetail(course)}
                      className="bg-[#26A65B] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#1F8347] transition-colors cursor-pointer"
                    >
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
                <button
                  onClick={() => handlePagination(currentPage - 1)}
                  className="flex items-center justify-center px-3 h-8 ms-0 text-gray-500 bg-white cursor-pointer border border-gray-300 rounded-s-lg hover:bg-gray-100"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-2.5 h-2.5 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                </button>
              </li>
              {renderPagination()}
              <li>
                <button
                  onClick={() => handlePagination(currentPage + 1)}
                  className="flex items-center justify-center px-3 h-8 text-gray-500 bg-white cursor-pointer border border-gray-300 rounded-e-lg hover:bg-gray-100"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-2.5 h-2.5 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default Main;
