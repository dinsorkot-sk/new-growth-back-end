
// "use client";

// import { useState } from "react";
// import dynamic from 'next/dynamic';

// const QuillEditor = dynamic(() => import('../quillEditor'), {
//   ssr: false,
//   loading: () => <p>Loading editor...</p>,
// });

// const Detail = ({ course }) => {
//     const [form, setForm] = useState({
//         title: course.title,
//         instructor: course.instructor,
//         description: course.description,
//         category: "เทคโนโลยี", // ตั้งค่าค่าเริ่มต้นหรือรับจาก course
//       });
//     return (
//         <div className="bg-white rounded-2xl overflow-hidden drop-shadow">
//             <div className="bg-[#0A2463] flex flex-row items-center justify-center gap-10 text-white p-5">
//                 <div>
//                     <div className="text-2xl">ชื่อหลักสูตร</div>
//                     <div className="text-md">รายละเอียดหลักสูตร</div>
//                     <div className="text-xs text-gray-300">อัพเดทเมื่อ 11 กุมภาพันธ์ 68</div>
//                     <div className="text-[#FBC700]">★★★★★ <span className="text-xs text-gray-300">(25 รีวิว)</span></div>
//                 </div>
//                 <div className="bg-[#D9D9D9] h-48 w-48">
                    
//                 </div>
//             </div>
//             <div className="flex flex-row justify-center p-5 gap-5">
//                 <div><QuillEditor readOnly={true}
//           value={form.description}
//           onChange={(value) => handleChange("description", value)} /></div>
//                 <div>
//                     <div>หลักสูตรเรียนฟรี ไม่มีค่าใช้จ่าย</div>
//                     <div>เรียนอัพสกิลกับเราในโครงการ OPEN ACCESS ได้แล้ววันนี้เข้าสู่ระบบเพื่อเรียนฟรีได้แล้ววันนี้ !</div>
                    
//                     <QuillEditor readOnly={true}
//           value={form.description}
//           onChange={(value) => handleChange("description", value)} />
//                     {/* ส่วนของแท็กหมวดหมู่ */}
//                     <div className="mt-4">
//                         <div className="text-lg font-medium">หมวดหมู่</div>
//                         <div className="flex flex-wrap gap-2 mt-2">
//                             <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">เทคโนโลยี</span>
//                             <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">การพัฒนาตนเอง</span>
//                             <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">อาชีพ</span>
//                         </div>
//                     </div>
                    
//                     {/* ส่วนของอาจารย์ผู้สอน */}
//                     <div className="mt-4">
//                         <div className="text-lg font-medium">อาจารย์ผู้สอน</div>
//                         <div className="flex items-center gap-3 mt-2">
//                             <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
//                             <span className="font-medium">อาจารย์ ดร. สมชาย ใจดี</span>
//                         </div>
//                     </div>
                    
                    
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Detail

"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';

const QuillEditor = dynamic(() => import('../quillEditor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const Detail = ({ course }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: course?.title || "ชื่อหลักสูตร",
    instructor: course?.instructor || "อาจารย์ ดร. สมชาย ใจดี",
    description: course?.description || "",
    additionalInfo: course?.additionalInfo || "",
    category: course?.category || "เทคโนโลยี",
    tags: course?.tags || ["เทคโนโลยี", "การพัฒนาตนเอง", "อาชีพ"]
  });

//   // Function to handle form changes
//   const handleChange = (field, value) => {
//     setForm({
//       ...form,
//       [field]: value
//     });
//   };

//   // Function to handle tag changes
//   const handleTagChange = (index, value) => {
//     const newTags = [...form.tags];
//     newTags[index] = value;
//     setForm({
//       ...form,
//       tags: newTags
//     });
//   };

//   // Function to add a new tag
//   const addTag = () => {
//     setForm({
//       ...form,
//       tags: [...form.tags, ""]
//     });
//   };

//   // Function to remove a tag
//   const removeTag = (index) => {
//     const newTags = [...form.tags];
//     newTags.splice(index, 1);
//     setForm({
//       ...form,
//       tags: newTags
//     });
//   };

//   // Function to save changes
//   const saveChanges = () => {
//     // Filter out empty tags
//     const filteredTags = form.tags.filter(tag => tag.trim() !== "");
//     setForm({
//       ...form,
//       tags: filteredTags
//     });
    
//     // Here you would typically send the updated data to your backend
//     console.log("Saving changes:", form);
    
//     // Exit edit mode
//     setIsEditing(false);
//   };


// Function to handle form changes
const handleChange = (field, value) => {
    setForm(prevForm => ({
      ...prevForm,
      [field]: value
    }));
  };

  // Function to handle tag changes
  const handleTagChange = (index, value) => {
    const newTags = [...form.tags];
    newTags[index] = value;
    setForm(prevForm => ({
      ...prevForm,
      tags: newTags
    }));
  };

  // Function to add a new tag
  const addTag = () => {
    setForm(prevForm => ({
      ...prevForm,
      tags: [...prevForm.tags, ""]
    }));
  };

  // Function to remove a tag
  const removeTag = (index) => {
    const newTags = [...form.tags];
    newTags.splice(index, 1);
    setForm(prevForm => ({
      ...prevForm,
      tags: newTags
    }));
  };

  // Function to save changes
  const saveChanges = () => {
    // Filter out empty tags
    const filteredTags = form.tags.filter(tag => tag.trim() !== "");
    setForm(prevForm => ({
      ...prevForm,
      tags: filteredTags
    }));
    
    // Here you would typically send the updated data to your backend
    console.log("Saving changes:", form);
    
    // Exit edit mode
    setIsEditing(false);
  };
  return (
    
    <div className="bg-white rounded-2xl overflow-hidden drop-shadow">
      {/* Header Section */}
      
      <div className="bg-[#0A2463] flex flex-col items-center justify-center text-white p-5  relative">
      <div className="absolute top-5 right-5">
    {isEditing ? (
      <div className="flex flex-col gap-2">
        <button 
          onClick={saveChanges}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          บันทึก
        </button>
        <button 
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          ยกเลิก
        </button>
      </div>
    ) : (
      <button 
        onClick={() => setIsEditing(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        แก้ไข
      </button>
    )}
  </div>
  
  {/* ส่วนรายละเอียดหลักสูตรอยู่ตรงกลาง */}
  <div className="flex items-center justify-center gap-10 text-white">
    <div className="text-center">
      {isEditing ? (
        <input
          type="text"
          className="text-2xl bg-[#0A2463] border-b border-white w-full text-center"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      ) : (
        <div className="text-2xl">{form.title}</div>
      )}
      <div className="text-md">รายละเอียดหลักสูตร</div>
      <div className="text-xs text-gray-300">อัพเดทเมื่อ 11 กุมภาพันธ์ 68</div>
      <div className="text-[#FBC700]">★★★★★ <span className="text-xs text-gray-300">(25 รีวิว)</span></div>
    </div>
    <div className="bg-[#D9D9D9] h-48 w-48 flex items-center justify-center">
      {isEditing ? (
        <div className="text-black text-center">
          <div>อัพโหลดรูปภาพ</div>
          <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm">เลือกรูป</button>
        </div>
      ) : null}
    </div>
  </div>
        
        
      </div>
      
      {/* Content Section */}
      <div className="flex flex-row justify-center p-5 gap-5">
        <div className="w-1/2">
        <QuillEditor 
              readOnly={!isEditing}
              value={form.description}
              onChange={(value) => handleChange("description", value)}
              id="description-editor"
            />
        </div>
        <div className="w-1/2">
          <div>หลักสูตรเรียนฟรี ไม่มีค่าใช้จ่าย</div>
          <div>เรียนอัพสกิลกับเราในโครงการ OPEN ACCESS ได้แล้ววันนี้เข้าสู่ระบบเพื่อเรียนฟรีได้แล้ววันนี้ !</div>
          
          {/* Second Editor */}
          <div className="mt-4">
          <QuillEditor 
                readOnly={!isEditing}
                value={form.additionalInfo}
                onChange={(value) => handleChange("additionalInfo", value)}
                id="additional-info-editor"
              />
              
          </div>
          
          {/* Tags Section */}
          <div className="mt-4">
            <div className="text-lg font-medium">หมวดหมู่</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {isEditing ? (
                <>
                  {form.tags.map((tag, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        className="px-3 py-1 border rounded-l-full text-sm"
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                      />
                      <button 
                        onClick={() => removeTag(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded-r-full text-sm"
                      >
                        x
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addTag}
                    className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                  >
                    + เพิ่มหมวดหมู่
                  </button>
                </>
              ) : (
                form.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))
              )}
            </div>
          </div>
          
          {/* Instructor Section */}
          <div className="mt-4">
            <div className="text-lg font-medium">อาจารย์ผู้สอน</div>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              {isEditing ? (
                <input
                  type="text"
                  className="border border-gray-300 px-2 py-1 rounded"
                  value={form.instructor}
                  onChange={(e) => handleChange("instructor", e.target.value)}
                />
              ) : (
                <span className="font-medium">{form.instructor}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;