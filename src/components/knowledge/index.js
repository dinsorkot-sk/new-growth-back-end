// components/activity/index.js
"use client";
import { useState, useEffect } from "react";
import Form from "./form";
import List from "./list";

const ActivityIndex = () => {
    const [view, setView] = useState("list"); // list หรือ form
    const [currentActivity, setCurrentActivity] = useState(null);
    const [activities, setActivities] = useState([
        { id: 1, title: "การอบรมเชิงปฏิบัติการ React", date: "2025-05-10", description: "อบรมการใช้งาน React เบื้องต้นถึงขั้นสูง" },
        { id: 2, title: "สัมมนาเทคโนโลยี AI และการประยุกต์ใช้", date: "2025-05-15", description: "แนะนำเทคโนโลยี AI ล่าสุดและการประยุกต์ใช้ในธุรกิจ" },
    ]);

    const handleAddNew = () => {
        setCurrentActivity(null);
        setView("form");
    };

    const handleEdit = (activity) => {
        setCurrentActivity(activity);
        setView("form");
    };

    const handleBack = () => {
        setView("list");
    };

    const handleSave = (formData) => {
        if (currentActivity) {
            // Edit existing activity
            setActivities(activities.map(item => 
                item.id === currentActivity.id ? {...formData, id: currentActivity.id} : item
            ));
        } else {
            // Add new activity
            const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
            setActivities([...activities, { ...formData, id: newId }]);
        }
        setView("list");
    };

    const handleDelete = (id) => {
        if (window.confirm("คุณต้องการลบกิจกรรมนี้ใช่หรือไม่?")) {
            setActivities(activities.filter(activity => activity.id !== id));
        }
    };

    return (
        <div>
            {view === "list" ? (
                <List 
                    activities={activities} 
                    onAddNew={handleAddNew} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete}
                />
            ) : (
                <Form 
                    activity={currentActivity} 
                    onBack={handleBack}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default ActivityIndex;