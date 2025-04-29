// components/activity/list.js
"use client";
import { Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const ActivityList = ({ activities, onAddNew, onEdit, onDelete }) => {
    if (!activities) {
        activities = [];
    }

    return (
        <div className="bg-white rounded-md shadow-sm">
            <div className="flex justify-between items-center p-4 border-b">
                <h1 className="text-xl font-medium">กิจกรรม/อีเวนท์ออนไลน์</h1>
                <button 
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded-md transition"
                    onClick={onAddNew}
                >
                    + เพิ่มกิจกรรม
                </button>
            </div>
            
            <div className="p-4 border-b">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="ค้นหากิจกรรม..." 
                                className="pl-10 pr-3 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <div className="relative">
                            <input 
                                type="date" 
                                className="pl-10 pr-3 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-4">
                {activities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">ไม่พบข้อมูลกิจกรรม</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อกิจกรรม</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {activities.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{activity.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{activity.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button 
                                                className="text-blue-600 hover:text-blue-800 mr-2"
                                                onClick={() => onEdit(activity)}
                                            >
                                                แก้ไข
                                            </button>
                                            <button 
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => onDelete(activity.id)}
                                            >
                                                ลบ
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {activities.length > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-500">
                            แสดง 1-{Math.min(activities.length, 10)} จาก {activities.length} รายการ
                        </div>
                        <div className="flex items-center">
                            <button className="p-1 rounded-md border mr-1 hover:bg-gray-50">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="px-3 py-1 rounded-md border mx-1 bg-green-500 text-white">
                                1
                            </button>
                            <button className="px-3 py-1 rounded-md border mx-1 hover:bg-gray-50">
                                2
                            </button>
                            <button className="p-1 rounded-md border ml-1 hover:bg-gray-50">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityList;