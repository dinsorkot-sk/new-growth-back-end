"use client";
import Main from "./main";
import Detail from "./detail";
import { useState } from "react";

const Index = () => { 

    const [selectedCourse, setSelectedCourse] = useState(null);
    

    const handleViewDetail = (course) => {
        // console.log("ดูรายละเอียด:", course);
        // // อาจจะเปิด modal หรือเปลี่ยน route

        // setSelectedCourse(course.id);

        if (course === null) {
            setSelectedCourse(" ");
        } else {
            setSelectedCourse(course.id);
        }
      };


    return (
        <div>
            {selectedCourse ? (
                <Detail courseId={selectedCourse} onClose={() => setSelectedCourse(null)} />
            ) : (
                <Main handleViewDetail={handleViewDetail} />
            )}

        </div>
    );
}

export default Index;

