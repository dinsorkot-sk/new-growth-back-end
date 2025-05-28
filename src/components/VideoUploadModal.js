import { useState } from 'react';

const VideoUploadModal = ({
    onClose,
    onUpload
}) => {
    const [files, setFiles] = useState([]);
    const [description, setDescription] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleRemoveFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUploadClick = () => {
        if (files.length > 0) {
            onUpload(files, [description]);
            setFiles([]);
            setDescription('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-[#00000050] flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white p-6 rounded-lg max-w-md w-full transform transition-all duration-300 animate-scaleIn">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">เพิ่มวิดีโอใหม่</h3>
                    <button
                        onClick={onClose}
                        className="text-3xl text-gray-500 hover:text-gray-700 transition-colors duration-300"
                    >
                        &times;
                    </button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="video-upload-input"
                        multiple
                    />
                    <label htmlFor="video-upload-input" className="cursor-pointer block">
                        <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                            </svg>
                            <p className="mt-2 text-gray-600">คลิกเพื่ออัพโหลดวิดีโอ</p>
                            <p className="text-sm text-gray-500">(รองรับหลายไฟล์)</p>
                        </div>
                    </label>
                    {files.length > 0 && (
                        <div className="mt-4 text-left">
                            <p className="font-semibold">ไฟล์ที่เลือก:</p>
                            <ul className="space-y-2">
                                {files.map((file, index) => (
                                    <li key={index} className="text-sm text-gray-700">
                                        <div className="flex justify-between items-start">
                                            <span>{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(index)}
                                                className="text-red-500 hover:text-red-700 ml-2"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="เพิ่มคำอธิบายวิดีโอ..."
                        rows="3"
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-300"
                        onClick={onClose}
                    >
                        ยกเลิก
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md text-white transition-colors duration-300 ${files.length > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-green-300 cursor-not-allowed'}`}
                        onClick={handleUploadClick}
                        disabled={files.length === 0}
                    >
                        เพิ่มวิดีโอ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoUploadModal; 