// index.js
"use client";
import Main from "./main";
import Detail from "./detail";
import { useState } from "react";

const Index = ({ news }) => { 
    const [selectedNews, setSelectedNews] = useState(null);
    
    const handleViewDetail = (newsItem) => {
        console.log("ดูรายละเอียดข่าว:", newsItem);
        setSelectedNews(newsItem);
    };

    return (
        <div className="min-h-screen">
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