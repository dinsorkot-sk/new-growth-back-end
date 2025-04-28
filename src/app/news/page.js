import Sidebar from "@/components/sidebar";
import Index from "@/components/news/index";

export const metadata = {
    title: "News",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const News = () => {
    const sampleNewsData = [
        {
            id: 1,
            title: "กิจกรรมเปิดบ้านหลักสูตร 2025",
            shortDescription: "ขอเชิญทุกท่านร่วมงานเปิดบ้านหลักสูตร ประจำปี 2025 พบกับกิจกรรมน่าสนใจ การสาธิตการเรียนการสอน และพูดคุยกับอาจารย์โดยตรง",
            content: "รายละเอียดกิจกรรมเปิดบ้านหลักสูตร 2025...",
            publishDate: "18 เมษายน 2025",
            viewCount: 100,
            category: "กิจกรรม",
            image: "/images/openhouse.jpg"
        },
        {
            id: 2,
            title: "งานสัมมนาประจำปี",
            shortDescription: "ขอเชิญทุกท่านเข้าร่วมงานสัมมนาประจำปี 2025 พบกับวิทยากรชื่อดังมากมาย และกิจกรรมที่น่าสนใจตลอดทั้งวัน",
            content: "รายละเอียดงานสัมมนาประจำปี 2025...",
            publishDate: "20 พฤษภาคม 2025",
            viewCount: 85,
            category: "สัมมนา",
            image: "/images/seminar.jpg"
        },
        {
            id: 3,
            title: "แนะนำกิจกรรมส่งเสริมการเรียนรู้",
            shortDescription: "กิจกรรมส่งเสริมการเรียนรู้นอกห้องเรียนสำหรับนักเรียนนักศึกษา เพิ่มทักษะการเรียนรู้นอกตำราเรียน",
            content: "รายละเอียดกิจกรรมส่งเสริมการเรียนรู้...",
            publishDate: "5 มิถุนายน 2025",
            viewCount: 120,
            category: "การศึกษา",
            image: "/images/activity.jpg"
        }
    ];     

    
    return (
        <div className="flex flex-row h-screen relative">
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>
            <div className="w-full p-5 overflow-auto">
                <Index news={sampleNewsData} />
            </div>
            
        </div>
    );
}

export default News;