"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const QuillEditor = React.lazy(() => import("../quillEditor"));

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const decimalPart = rating % 1;

  return (
    <div className="flex items-center justify-center">
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

const Detail = ({ courseId }) => {
  const router = useRouter();
  const [mode, setMode] = useState(courseId ? "view" : "create");
  const [course, setCourse] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingVideo, setIsDeletingVideo] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingCourse, setIsDeletingCourse] = useState(false);

  const initialFormState = useMemo(() => ({
    name: "",
    description: "",
    sub_description: "",
    additional_info: "",
    industries: [],
    instructor: "",
    publishDate: new Date().toISOString().split("T")[0],
  }), []);

  const [form, setForm] = useState(initialFormState);

  const fetchCourse = useCallback(async () => {
    if (!courseId || courseId == " " || courseId == "create") {
      setMode("create");
      setForm(initialFormState);
      setIsDataLoaded(true);
      return;
    }

    try {
      setIsLoading(true);
      const token = Cookies.get("auth-token");
      if (!token) {
        router.push("/admin/login");
      }
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCourse(data);
      setForm({
        name: data.name || "",
        description: data.description || "",
        sub_description: data.sub_description || "",
        additional_info: data.additional_info || "",
        industries: data.industries?.map((i) => i.name) || [],
        instructor: data.instructor || "",
        publishDate:
          data.publish_date?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
      });
      setMode("view");
    } catch (err) {
      setError("Failed to load course data");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
      setIsDataLoaded(true);
    }
  }, [courseId, initialFormState, router]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // การจัดการฟอร์ม
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagChange = (index, value) => {
    const newTags = [...form.industries];
    newTags[index] = value;
    setForm((prev) => ({ ...prev, industries: newTags }));
  };

  const addTag = () => {
    setForm((prev) => ({ ...prev, industries: [...prev.industries, ""] }));
  };

  const removeTag = (index) => {
    const newTags = form.industries.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, industries: newTags }));
  };

  // การอัพโหลดไฟล์
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];

    if (file) {
      if (type === "image") setSelectedImage(file);
      if (type === "video") setSelectedVideo(file);
    }
  };

  // ส่งข้อมูลฟอร์ม
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!form.name || !form.description || !form.instructor) {
      setError("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      const token = Cookies.get("auth-token");
      if (!token) {
        router.push("/admin/login");
      }

      // ข้อมูลพื้นฐาน
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("sub_description", form.sub_description);
      formData.append("additional_info", form.additional_info);
      formData.append("industries", form.industries.join(","));
      formData.append("instructor", form.instructor);
      formData.append("author", form.instructor);
      formData.append(
        "published_date",
        new Date(form.publishDate).toISOString()
      );

      // ไฟล์แนบ
      if (selectedImage) formData.append("image", selectedImage);
      if (selectedVideo) formData.append("video", selectedVideo);

      // ส่งคำขอ API
      const url =
        courseId != "create"
          ? `${process.env.NEXT_PUBLIC_API}/course/${courseId}`
          : `${process.env.NEXT_PUBLIC_API}/course`;

      const method = courseId != "create" ? "put" : "post";

      const { data } = await axios({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // จัดการผลลัพธ์

      if (data) {
        setCourse(data);
        setMode("view");
        console.log(data);
        method === "put" ? router.push(`/admin/courses/${data.id}`) : router.push(`/admin/courses/${data.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      console.error("Submit error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ยกเลิกการแก้ไข
  const handleCancel = () => {
    if (courseId) {
      setMode("view");
      setForm({
        name: course.name,
        description: course.description,
        sub_description: course.sub_description,
        additional_info: course.additional_info,
        industries: course.industries?.map((i) => i.name) || [],
        instructor: course.instructor,
        publishDate: course.publish_date?.split("T")[0],
      });
    } else {
      onClose();
    }
    setSelectedImage(null);
    setSelectedVideo(null);
  };

  // คำนวณคะแนนรีวิว
  const calculateAverageRating = (reviews) => {
    if (!reviews?.length) return 0;
    return (
      reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length
    ).toFixed(1);
  };

  // จัดรูปแบบวันที่
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API}/review`, {
        data: {
          id: selectedReview.id,
          course_id: course.id,
        },
      });
      // Optional: reload or update the review list
      fetchCourse(); // หรือเรียกฟังก์ชัน refresh
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDeleteVideo = async () => {
    if (window.confirm("คุณต้องการลบวิดีโอนี้ใช่หรือไม่?")) {
      try {
        const token = Cookies.get("auth-token");
        if (!token) {
          router.push("/admin/login");
        }
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API}/video/delete/${course.resources.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        // Update local state
        setSelectedVideo(null);
        setCourse(prev => ({
          ...prev,
          resources: null
        }));
        
        // Refresh course data
        await fetchCourse();
      } catch (err) {
        setError(err.response?.data?.error || "Failed to delete video");
        console.error("Delete video error:", err);
      }
    }
  };

  const handleDeleteCourse = async () => {
    try {
      setIsDeletingCourse(true);
      const token = Cookies.get("auth-token");
      if (!token) {
        router.push("/admin/login");
      }
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      router.push('/admin/courses');
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete course");
      console.error("Delete course error:", err);
    } finally {
      setIsDeletingCourse(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (!isDataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!courseId && mode === "view") return null;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const onClose = () => {
    router.back();
  };

  return (
    <div>
      <div className="bg-white rounded-2xl drop-shadow">
        {/* ส่วนหัว */}
        <div
          className={`relative flex flex-col items-center justify-center text-white p-5 ${
            !selectedImage && !course?.image ? "bg-[#0A2463]" : ""
          }`}
          style={{
            backgroundImage: selectedImage
              ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${URL.createObjectURL(
                  selectedImage
                )})`
              : course?.image?.image_path
              ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${process.env.NEXT_PUBLIC_IMG}${course.image.image_path.startsWith('/') ? '' : '/'}${course.image.image_path.replace(/\\/g, "/")})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute top-5 right-5 flex flex-col gap-2">
            {mode === "edit" || mode === "create" ? (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-500 rounded-md disabled:opacity-50 cursor-pointer"
                >
                  {isLoading
                    ? "กำลังบันทึก..."
                    : courseId
                    ? "บันทึกการเปลี่ยนแปลง"
                    : "สร้างเนื้อหา"}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 rounded-md cursor-pointer"
                >
                  ยกเลิก
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setMode("edit")}
                  className="px-4 py-2 bg-blue-500 rounded-md cursor-pointer"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isDeletingCourse}
                  className="px-4 py-2 bg-red-500 rounded-md cursor-pointer disabled:opacity-50"
                >
                  {isDeletingCourse ? "กำลังลบ..." : "ลบ"}
                </button>
              </div>
            )}
          </div>

          <div className="absolute top-5 left-5">
            {(mode === "edit" || mode === "create") && (
              <>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "image")}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="px-4 py-2 bg-blue-500 rounded-md cursor-pointer"
                >
                  {selectedImage ? "เปลี่ยนภาพพื้นหลัง" : "เพิ่มภาพพื้นหลัง"}
                </label>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <div className="text-center w-[30%]">
              <h1 className="text-2xl mb-2">
                {mode === "view" ? (
                  course?.name || "เนื้อหาใหม่"
                ) : (
                  <input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="border-b text-center w-full"
                    placeholder="ชื่อเนื้อหา"
                  />
                )}
              </h1>

              {mode === "view" ? (
                <>
                  <p>{course?.description}</p>
                  {course?.review && (
                    <div className="mt-2">
                      {renderStars(calculateAverageRating(course.review))}
                      <span className="text-sm ml-2">
                        ({course.review.length} รีวิว)
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-gray-300 mt-2">
                    อัปเดตล่าสุด: {formatDate(course?.updated_at)}
                  </p>
                </>
              ) : (
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full p-2 bg-transparent border-b text-center"
                  placeholder="คำอธิบายสั้น"
                />
              )}
            </div>

            {/* ส่วนอัพโหลดภาพ */}
            <div className="relative group">
              <div className="relative group w-full max-w-2xl">
                <div className="bg-black aspect-video flex h-48 items-center justify-center overflow-hidden rounded-lg">
                  {mode === "edit" || mode === "create" ? (
                    <>
                      <input
                        type="file"
                        id="video-upload"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, "video")}
                        className="hidden"
                      />
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer w-full h-full flex items-center justify-center"
                      >
                        {selectedVideo ? (
                          <div className="relative w-full h-full">
                            <video
                              className="w-full h-full object-cover"
                              controls
                              preload="metadata"
                              playsInline
                            >
                              <source
                                src={URL.createObjectURL(selectedVideo)}
                                type="video/mp4"
                              />
                              ขอโทษค่ะ เบราว์เซอร์ของคุณไม่รองรับแท็กวิดีโอ
                            </video>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteVideo();
                              }}
                              disabled={isDeletingVideo}
                              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                            >
                              {isDeletingVideo ? "กำลังลบ..." : "ลบวิดีโอ"}
                            </button>
                          </div>
                        ) : course?.resources ? (
                          <div className="relative w-full h-full">
                            <video
                              className="w-full h-full object-cover"
                              controls
                              autoPlay
                              preload="auto"
                              poster={`${process.env.NEXT_PUBLIC_IMG}${
                                course.resources.poster_path || "/default-poster.jpg"
                              }`}
                              data-setup="{}"
                            >
                              <source
                                src={`${process.env.NEXT_PUBLIC_IMG}/${course.resources.files[0].file_path}`}
                                type="video/mp4"
                              />
                              ขอโทษค่ะ เบราว์เซอร์ของคุณไม่รองรับแท็กวิดีโอ
                            </video>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteVideo();
                              }}
                              disabled={isDeletingVideo}
                              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                            >
                              {isDeletingVideo ? "กำลังลบ..." : "ลบวิดีโอ"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-300">
                            คลิกเพื่ออัพโหลดวิดีโอพื้นหลัง
                          </span>
                        )}
                      </label>
                    </>
                  ) : (
                    course?.resources && (
                      <video
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                        preload="auto"
                        poster={`${process.env.NEXT_PUBLIC_IMG}/${
                          course.resources.poster_path || "/default-poster.jpg"
                        }`}
                        data-setup="{}"
                      >
                        <source
                          src={`${process.env.NEXT_PUBLIC_IMG}/${course.resources.files[0].file_path}`}
                          type="video/mp4"
                        />
                        ขอโทษค่ะ เบราว์เซอร์ของคุณไม่รองรับแท็กวิดีโอ
                      </video>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ส่วนเนื้อหาหลัก */}
        <div className="flex flex-col md:flex-row p-5 gap-5">
          {/* คอลัมน์ซ้าย - เนื้อหาเนื้อหา */}
          <div className="flex flex-col w-full md:w-1/2">
            <h2 className="text-xl font-bold mb-4">เนื้อหาเนื้อหา</h2>

            {mode === "view" ? (
              <div className="ql-editor" dangerouslySetInnerHTML={{ __html: form.sub_description }} />
            ) : (
              <div>
                <Suspense fallback={<div>Loading editor...</div>}>
                  <QuillEditor
                    key={`sub_description_${mode}`}
                    value={form.sub_description}
                    onChange={(value) => handleChange("sub_description", value)}
                  />
                </Suspense>
              </div>
            )}

            {/* ส่วนรีวิว */}
            {mode === "view" && course?.review && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">รีวิวจากผู้เรียน</h2>
                {course.review.length === 0 ? (
                  <p className="text-gray-500">ยังไม่มีรีวิว</p>
                ) : (
                  course.review.map((review) => (
                    <div
                      key={review.id}
                      className="border rounded-lg p-4 mb-3 relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            {review.username?.[0] || "U"}
                          </div>
                          <span>{review.username || "ผู้ใช้ไม่ระบุชื่อ"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {formatDate(review.created_at)}
                          </span>
                          <button
                            onClick={() => handleDeleteClick(review)}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.score)}
                        <span className="text-sm">{review.score}/5</span>
                      </div>
                      <p className="mt-2">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* คอลัมน์ขวา - ข้อมูลเพิ่มเติม */}
          <div className="flex flex-col space-y-6 w-full md:w-1/2">
            <div>
              <h2 className="text-xl font-bold mb-4">ข้อมูลเพิ่มเติม</h2>
              {mode === "view" ? (
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{ __html: form.additional_info }}
                />
              ) : (
                <div>
                  <Suspense fallback={<div>Loading editor...</div>}>
                    <QuillEditor
                      key={`additional_info_${mode}`}
                      value={form.additional_info}
                      onChange={(value) => handleChange("additional_info", value)}
                    />
                  </Suspense>
                </div>
              )}
            </div>

            {/* หมวดหมู่ */}
            <div>
              <h3 className="text-lg font-semibold mb-2">หมวดหมู่</h3>
              {mode === "view" ? (
                <div className="flex flex-wrap gap-2">
                  {form.industries.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {form.industries.map((tag, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={tag}
                        onChange={(e) => handleTagChange(i, e.target.value)}
                        className="flex-1 p-2 border rounded"
                      />
                      <button
                        onClick={() => removeTag(i)}
                        className="px-3 bg-red-500 text-white rounded"
                      >
                        ลบ
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    เพิ่มหมวดหมู่
                  </button>
                </div>
              )}
            </div>

            {/* ผู้สอน */}
            <div>
              <h3 className="text-lg font-semibold mb-2">ผู้สอน</h3>
              {mode === "view" ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {form.instructor?.[0] || "T"}
                  </div>
                  <span>{form.instructor}</span>
                </div>
              ) : (
                <input
                  value={form.instructor}
                  onChange={(e) => handleChange("instructor", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="ชื่อผู้สอน"
                />
              )}
            </div>

            {/* วันที่เผยแพร่ */}
            <div>
              <h3 className="text-lg font-semibold mb-2">วันที่เผยแพร่</h3>
              {mode === "view" ? (
                <p>{formatDate(form.publishDate)}</p>
              ) : (
                <input
                  type="date"
                  value={form.publishDate}
                  onChange={(e) => handleChange("publishDate", e.target.value)}
                  className="p-2 border rounded w-full"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/">
          <button
            onClick={onClose}
            className="text-blue-500 underline flex items-center cursor-pointer"
          >
            <span className="mr-1">&lt;</span>
            กลับไปหน้ารายการ
          </button>
        </Link>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">ยืนยันการลบ</h2>
            <p className="text-sm mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบรีวิวนี้?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                ยกเลิก
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                onClick={confirmDelete}
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">ยืนยันการลบคอร์ส</h2>
            <p className="text-sm mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบคอร์สนี้? การลบจะไม่สามารถย้อนกลับได้</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeletingCourse}
              >
                ยกเลิก
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                onClick={handleDeleteCourse}
                disabled={isDeletingCourse}
              >
                {isDeletingCourse ? "กำลังลบ..." : "ลบ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
