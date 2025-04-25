"use client";
import Main from "./main";
import Detail from "./detail";
import { useState } from "react";

const Index = ({courses}) => { 

    const [selectedCourse, setSelectedCourse] = useState(null);
    

    const handleViewDetail = (course) => {
        console.log("ดูรายละเอียด:", course);
        // อาจจะเปิด modal หรือเปลี่ยน route

        setSelectedCourse(course);
      };


    return (
        <div>
            {selectedCourse ? (
                <Detail course={selectedCourse} onClose={() => setSelectedCourse(null)} />
            ) : (
                <Main courses={courses} handleViewDetail={handleViewDetail} />
            )}

        </div>
    );
}

export default Index;