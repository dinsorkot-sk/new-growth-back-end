"use client";


const Detail = () => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden drop-shadow">
            <div className="bg-[#0A2463] flex flex-row items-center justify-center gap-10 text-white p-5">
                <div>
                    <div className="text-2xl">ชื่อหลักสูตร</div>
                    <div className="text-md">รายละเอียดหลักสูตร</div>
                    <div className="text-xs text-gray-300">อัพเดทเมื่อ 11 กุมภาพันธ์ 68</div>
                    <div className="text-[#FBC700]">★★★★★ <span className="text-xs text-gray-300">(25 รีวิว)</span></div>
                </div>
                <div className="bg-[#D9D9D9] h-48 w-48">
                    
                </div>
            </div>
            <div className="flex flex-row justify-center p-5 gap-5">
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

export default Detail;