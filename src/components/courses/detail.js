"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import axios from "axios";
import Cookies from 'js-cookie';

const QuillEditor = dynamic(() => import('../quillEditor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

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

const CourseForm = ({ courseId, onClose }) => {
  const router = useRouter();
  const [mode, setMode] = useState(courseId ? 'view' : 'create');
  const [course, setCourse] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const initialFormState = {
    name: "",
    description: "",
    sub_description: "",
    additional_info: "",
    industries: [],
    instructor: "",
    publishDate: new Date().toISOString().split('T')[0],
  };

  const [form, setForm] = useState(initialFormState);

  // ดึงข้อมูลหลักสูตร (เมื่อมี courseId)
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId || courseId == " ") {
        setMode('create')
        setForm(initialFormState);
        return;
      }

      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/course/${courseId}`
        );

        setCourse(data);
        setForm({
          name: data.name || "",
          description: data.description || "",
          sub_description: data.sub_description || "",
          additional_info: data.additional_info || "",
          industries: data.industries?.map(i => i.name) || [],
          instructor: data.instructor || "",
          publishDate: data.publish_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        });
        setMode('view');
      } catch (err) {
        setError("Failed to load course data");
        console.error("Fetch error:", err);
      }
    };

    fetchCourse();
  }, [courseId]);

  // การจัดการฟอร์ม
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTagChange = (index, value) => {
    const newTags = [...form.industries];
    newTags[index] = value;
    setForm(prev => ({ ...prev, industries: newTags }));
  };

  const addTag = () => {
    setForm(prev => ({ ...prev, industries: [...prev.industries, ""] }));
  };

  const removeTag = (index) => {
    const newTags = form.industries.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, industries: newTags }));
  };

  // การอัพโหลดไฟล์
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    console.log(file);
    
    if (file) {
      if (type === 'image') setSelectedImage(file);
      if (type === 'video') setSelectedVideo(file);
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
      const token = Cookies.get('auth-token');

      // ข้อมูลพื้นฐาน
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('sub_description', form.sub_description);
      formData.append('additional_info', form.additional_info);
      formData.append('industries', form.industries.join(','));
      formData.append('instructor', form.instructor);
      formData.append('author', form.instructor);
      formData.append('published_date', new Date(form.publishDate).toISOString());

      // ไฟล์แนบ
      if (selectedImage) formData.append('image', selectedImage);
      if (selectedVideo) formData.append('video', selectedVideo);

      // ส่งคำขอ API
      const url = courseId != " "
        ? `${process.env.NEXT_PUBLIC_API}/course/${courseId}`
        : `${process.env.NEXT_PUBLIC_API}/course`;

      const method = courseId != " " ? 'put' : 'post';

      const { data } = await axios({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // จัดการผลลัพธ์
      if (courseId) {
        setCourse(data);
        setMode('view');
        router.refresh();
      } else {
        router.push(`/admin/courses/${data.id}`);
        onClose();
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
      setMode('view');
      setForm({
        name: course.name,
        description: course.description,
        sub_description: course.sub_description,
        additional_info: course.additional_info,
        industries: course.industries?.map(i => i.name) || [],
        instructor: course.instructor,
        publishDate: course.publish_date?.split('T')[0],
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
    return (reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length).toFixed(1);
  };

  // จัดรูปแบบวันที่
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  if (!courseId && mode === 'view') return null;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div>
      <div className="bg-white rounded-2xl drop-shadow">
        {/* ส่วนหัว */}
        <div className="bg-[#0A2463] flex flex-col items-center justify-center text-white p-5 relative">
          <div className="absolute top-5 right-5 flex gap-2">
            {mode === 'edit' || mode === 'create' ? (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-500 rounded-md disabled:opacity-50"
                >
                  {isLoading ? 'กำลังบันทึก...' : (courseId ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างหลักสูตร')}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 rounded-md"
                >
                  ยกเลิก
                </button>
              </>
            ) : (
              <button
                onClick={() => setMode('edit')}
                className="px-4 py-2 bg-blue-500 rounded-md"
              >
                แก้ไข
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <div className="text-center">
              <h1 className="text-2xl mb-2">
                {mode === 'view' ? (
                  course?.name || "หลักสูตรใหม่"
                ) : (
                  <input
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="bg-[#0A2463] border-b text-center w-full"
                    placeholder="ชื่อหลักสูตร"
                  />
                )}
              </h1>

              {mode === 'view' ? (
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
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full p-2 bg-transparent border-b text-center"
                  placeholder="คำอธิบายสั้น"
                />
              )}
            </div>

            {/* ส่วนอัพโหลดภาพ */}
            <div className="relative group">
              <div className="bg-[#D9D9D9] h-48 w-48 flex items-center justify-center overflow-hidden rounded-lg">
                {(mode === 'edit' || mode === 'create') ? (
                  <>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer w-full h-full flex items-center justify-center"
                    >
                      {selectedImage ? (
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : course?.image ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMG}${course.image.image_path}`}
                          alt="Course"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600">คลิกเพื่ออัพโหลดภาพปก</span>
                      )}
                    </label>
                  </>
                ) : (
                  course?.image && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMG}${course.image.image_path}`}
                      alt="Course"
                      className="w-full h-full object-cover"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ส่วนเนื้อหาหลัก */}
        <div className="flex flex-col-reverse md:flex-row p-5 gap-5">
          {/* คอลัมน์ซ้าย - เนื้อหาหลักสูตร */}
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">เนื้อหาหลักสูตร</h2>

            {mode === 'view' ? (
              <div dangerouslySetInnerHTML={{ __html: form.sub_description }} />
            ) : (
              <div>
                <QuillEditor
                  value={form.sub_description}
                  onChange={(value) => handleChange('sub_description', value)}
                />
              </div>
            )}

            {/* ส่วนรีวิว */}
            {mode === 'view' && course?.review && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">รีวิวจากผู้เรียน</h2>
                {course.review.length === 0 ? (
                  <p className="text-gray-500">ยังไม่มีรีวิว</p>
                ) : (
                  course.review.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            {review.username?.[0] || 'U'}
                          </div>
                          <span>{review.username || 'ผู้ใช้ไม่ระบุชื่อ'}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.created_at)}
                        </span>
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
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">ข้อมูลเพิ่มเติม</h2>
              {mode === 'view' ? (
                <div dangerouslySetInnerHTML={{ __html: form.additional_info }} />
              ) : (
                <div>
                  <QuillEditor
                    value={form.additional_info}
                    onChange={(value) => handleChange('additional_info', value)}
                  />
                </div>
              )}
            </div>

            {/* หมวดหมู่ */}
            <div>
              <h3 className="text-lg font-semibold mb-2">หมวดหมู่</h3>
              {mode === 'view' ? (
                <div className="flex flex-wrap gap-2">
                  {form.industries.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-200 rounded-full text-sm">
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
              {mode === 'view' ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {form.instructor?.[0] || 'T'}
                  </div>
                  <span>{form.instructor}</span>
                </div>
              ) : (
                <input
                  value={form.instructor}
                  onChange={(e) => handleChange('instructor', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="ชื่อผู้สอน"
                />
              )}
            </div>

            {/* วิดีโอ */}
            <div>
              <h3 className="text-lg font-semibold mb-2">วิดีโอหลักสูตร</h3>
              {mode === 'view' ? (
                course?.resources?.files?.[0] ? (
                  <div className="p-2 border rounded">
                    {course.resources.files[0].file_path}
                  </div>
                ) : (
                  <p className="text-gray-500">ไม่มีวิดีโอ</p>
                )
              ) : (
                <>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, 'video')}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="block p-2 border rounded cursor-pointer"
                  >
                    {selectedVideo
                      ? selectedVideo.name
                      : course?.resources?.files?.[0]?.file_path || 'คลิกเพื่ออัพโหลดวิดีโอ'}
                  </label>
                </>
              )}
            </div>

            {/* วันที่เผยแพร่ */}
            <div>
              <h3 className="text-lg font-semibold mb-2">วันที่เผยแพร่</h3>
              {mode === 'view' ? (
                <p>{formatDate(form.publishDate)}</p>
              ) : (
                <input
                  type="date"
                  value={form.publishDate}
                  onChange={(e) => handleChange('publishDate', e.target.value)}
                  className="p-2 border rounded w-full"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={onClose}
          className="text-blue-500 underline flex items-center"
        >
          <span className="mr-1">&lt;</span>
          กลับไปหน้ารายการ
        </button>
      </div>
    </div>
  );
};

export default CourseForm;