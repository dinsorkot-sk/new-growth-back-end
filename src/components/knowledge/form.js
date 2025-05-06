"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";

const DocumentForm = ({ document, onBack, onSave }) => {
  const initialState = document
    ? { ...document }
    : {
      title: "",
      description: "",
      fileType: "",
      size: "",
      fileUrl: "",
      uploadedFileName: "",
    };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [fileSelected, setFileSelected] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(
    document?.name || ""
  );
  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "กรุณาระบุชื่อเอกสาร";
    if (!document && !fileSelected) newErrors.file = "กรุณาเลือกไฟล์";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const title = e.target.title;
    const value = e.target.value;
    setFormData({ ...formData, [title]: value });
    // Clear error when user types
    if (errors[title]) {
      setErrors({ ...errors, [title]: null });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop();

    setFormData({
      ...formData,
      fileType: fileExtension,
      size: formatFileSize(file.size),
      fileUrl: URL.createObjectURL(file),
      uploadedFileName: file.name,
      file: file, // ✅ เก็บไฟล์ไว้เพื่อส่งเข้า API
    });

    console.log(formData);

    setFileSelected(true);
  };
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const clearFileSelection = () => {
    setFileSelected(false);
    setUploadedFileName("");
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Reset file-related form data
    setFormData({
      ...formData,
      fileType: "",
      size: "",
      fileUrl: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("ssss", formData.file);
      onSave(formData);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm">
      <div className="flex justify-between items-center p-4 border-b">
        <button
          className="flex items-center text-gray-600 hover:text-gray-900"
          onClick={onBack}
        >
          <ArrowLeft size={18} className="mr-1" />
          กลับ
        </button>
        <h1 className="text-xl font-medium">
          {document ? "แก้ไขเอกสาร" : "เพิ่มเอกสาร"}
        </h1>
        <div></div> {/* ช่องว่างเพื่อให้หัวข้ออยู่ตรงกลาง */}
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            ชื่อเอกสาร <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            title="title" // Add this line
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 ${errors.name ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            รายละเอียด
          </label>
          <textarea
            name="description"
            title="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          ></textarea>
        </div>

        {!document && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              อัปโหลดไฟล์ <span className="text-red-500">*</span>
            </label>

            {!fileSelected ? (
              <>
                <div
                  className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 ${errors.file ? "border-red-500" : "border-gray-300"
                    }`}
                  onClick={() => fileInputRef.current.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-600">
                    คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    สนับสนุนไฟล์: PDF, DOCX, XLSX, PPTX, JPG, PNG
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                {errors.file && (
                  <p className="text-red-500 text-xs mt-1">{errors.file}</p>
                )}
              </>
            ) : (
              <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-md">
                    {/* <FileIcon fileType={formData.fileType} /> */}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{uploadedFileName}</p>
                    <p className="text-xs text-gray-500">
                      {formData.size} • {formData.fileType}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearFileSelection}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {document && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              ข้อมูลไฟล์
            </label>
            <div className="flex items-center p-3 border rounded-md bg-gray-50">
              <div className="bg-blue-100 p-2 rounded-md">
                {/* <FileIcon fileType={document.fileType} /> */}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{document.name}</p>
                <p className="text-xs text-gray-500">
                  {document.size} • {document.fileType}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            {document ? "อัปเดต" : "บันทึก"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;
