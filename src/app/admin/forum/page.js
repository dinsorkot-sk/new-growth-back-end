"use client";
import Sidebar from "@/components/sidebar";
import ForumContent from "@/components/forum/forum-content";

const Questions = () => {
  return (
    <div className="flex flex-row min-h-screen bg-gray-50">
      <div className="fixed top-0">
        <Sidebar />
      </div>
      
      <div className="ms-56 w-full gap-5 p-5 flex flex-col">
        {/* Header with animation */}
        <div className="bg-white flex items-center p-5 w-full drop-shadow rounded-2xl transform transition-all duration-300 hover:scale-[1.01]">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            กระดู่คำถาม
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <ForumContent />
        </div>
      </div>
    </div>
  );
};

export default Questions;