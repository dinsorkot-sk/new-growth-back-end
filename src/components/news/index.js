// // index.js
// "use client";
// import Main from "./main";
// import Detail from "./detail";
// import { useState } from "react";

// const Index = ({ news }) => { 
//     const [selectedNews, setSelectedNews] = useState(null);
    
//     const handleViewDetail = (newsItem) => {
//         console.log("ดูรายละเอียดข่าว:", newsItem);
//         setSelectedNews(newsItem);
//     };

//     return (
//         <div >
//             {selectedNews ? (
//                 <Detail 
//                     news={selectedNews} 
//                     onClose={() => setSelectedNews(null)} 
//                 />
//             ) : (
//                 <Main 
//                     news={news} 
//                     handleViewDetail={handleViewDetail} 
//                 />
//             )}
//         </div>
//     );
// }

// export default Index;

"use client";
import Main from "./main";
import Detail from "./detail";
import { useState } from "react";

const Index = ({ news }) => { 
    const [selectedNews, setSelectedNews] = useState(null);
    
    const handleViewDetail = (newsItem) => {
        // ถ้าเป็น null จะเป็นการสร้างใหม่
        if (newsItem === null) {
            // สร้างออบเจ็กต์เปล่าและกำหนดโหมดเป็น 'edit' โดยตรง
            setSelectedNews({
                mode: 'edit', // กำหนดโหมดแก้ไขโดยตรง
                // ค่าเริ่มต้นอื่นๆ ถ้าจำเป็น
                title: "",
                content: "",
                category: "กิจกรรม",
                publishDate: new Date().toISOString().split('T')[0],
                shortDescription: ""
            });
            console.log("สร้างข่าวใหม่");
        } else {
            console.log("ดูรายละเอียดข่าว:", newsItem);
            setSelectedNews(newsItem);
        }
    };

    return (
        <div>
            {selectedNews ? (
                <Detail 
                    news={selectedNews} 
                    onClose={() => setSelectedNews(null)} 
                />
            ) : (
                <Main 
                    news={news} 
                    handleViewDetail={handleViewDetail} 
                />
            )}
        </div>
    );
}

export default Index;