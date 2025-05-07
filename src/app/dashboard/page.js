'use client';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from "@/components/sidebar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseURL = process.env.NEXT_PUBLIC_IMG || '';
                const response = await fetch(`${baseURL}/api/admin/dashboard`);
                if (!response.ok) throw new Error('Failed to fetch');
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchData();
    }, []);

    const coursesChartData = {
        labels: data?.courses?.map(c => c.name) || [],
        datasets: [{
            label: 'จำนวนผู้เรียน',
            data: data?.courses?.map(c => c.students || 0) || [],
            backgroundColor: '#2B74D1'
        }]
    };

    const messagesChartData = {
        labels: data?.courses?.map(c => c.name) || [],
        datasets: [{
            label: 'คะแนนความนิยม',
            data: data?.courses?.map(c => c.popularity || 0) || [],
            backgroundColor: '#25BF8C'
        }]
    };

    const monthlyUsersChartData = {
        labels: data?.monthlyUsers.map(u => u.month) || [],
        datasets: [{
            label: 'ผู้ใช้งาน',
            data: data?.monthlyUsers.map(u => u.count) || [],
            backgroundColor: '#2B74D1'
        }]
    };


    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <div className="flex flex-row">

            <div className="fixed top-0">
                <Sidebar />
            </div>
            <div className="ms-56 w-full p-5">
                {/* ส่วนการ์ดข้อมูล */}
                <div className="flex flex-row mt-5 gap-5">
                    {/* Visitor Card */}
                    <div className="bg-white w-1/4 p-5 rounded-2xl shadow">
                        <div className="text-gray-500">ผู้เข้าใช้งาน</div>
                        <div className="text-3xl my-3">{data.visitorCount}</div>
                        <div className="flex gap-2 text-sm">
                            <span
                                className={`${data.visitorsComparison.change > 0 ? 'text-green-500' : 'text-red-500'}`}
                            >
                                {data.visitorsComparison.change > 0 ? `↑ ${data.visitorsComparison.change}%` : `↓ ${Math.abs(data.visitorsComparison.change)}%`}
                            </span>
                            <span className="text-gray-500">จากเดือนก่อน</span>
                        </div>
                    </div>
                    {/* Course Card */}
                    <div className="bg-white w-1/4 p-5 rounded-2xl shadow">
                        <div className="text-gray-500">หลักสูตร</div>
                        <div className="text-3xl my-3">{data.courseCount}</div>
                        <div className="text-green-500 text-sm">หลักสูตรทั้งหมด</div>
                    </div>
                    {/* Messages Card */}
                    <div className="bg-white w-1/4 p-5 rounded-2xl shadow">
                        <div className="text-gray-500">ข้อความใหม่</div>
                        <div className="text-3xl my-3">{data.newMessages}</div>
                        <div className="text-red-500 text-sm">ข้อความวันนี้</div>
                    </div>
                    {/* Activities Card */}
                    <div className="bg-white w-1/4 p-5 rounded-2xl shadow">
                        <div className="text-gray-500">กิจกรรม</div>
                        <div className="text-3xl my-3">{data.todayActivities}</div>
                        <div className="text-blue-500 text-sm">กิจกรรมทั้งหมด</div>
                    </div>
                </div>

                {/* กราฟ */}
                <div className="flex flex-row mt-5 gap-5">
                    <div className="bg-white w-1/2 p-5 rounded-2xl shadow">
                        <h3 className="mb-4">จำนวนผู้ใช้งานต่อเดือน</h3>
                        <Bar data={monthlyUsersChartData} />
                    </div>
                    <div className="bg-white w-1/2 p-5 rounded-2xl shadow">
                        <h3 className="mb-4">หลักสูตรยอดนิยม</h3>
                        <Bar data={messagesChartData} />
                    </div>
                </div>

                <div className="flex flex-row mt-5 gap-5">
                    {/* ข้อความล่าสุด */}
                    <div className="bg-white w-1/2 p-5 rounded-2xl shadow">
                        <div className="flex justify-between mb-4">
                            <h3>ข้อความล่าสุด</h3>
                            <button className="text-blue-600">ดูทั้งหมด →</button>
                        </div>
                        {data.latestMessages?.length > 0 ? (
                            data.latestMessages.map(msg => (
                                <div key={msg.id || msg.createdAt} className="p-3 border-b">
                                    <p className="font-semibold">
                                        {(msg.content || '').substring(0, 40)}...
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'ไม่ทราบวันที่'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">ไม่มีข้อความล่าสุด</p>
                        )}
                    </div>

                    {/* กิจกรรมล่าสุด */}
                    <div className="bg-white w-1/2 p-5 rounded-2xl shadow">
                        <div className="flex justify-between mb-4">
                            <h3>กิจกรรมล่าสุด</h3>
                            <button className="text-blue-600">ดูทั้งหมด →</button>
                        </div>
                        {data.latestActivities?.length > 0 ? (
                            data.latestActivities.map(activity => (
                                <div key={activity.id || activity.date} className="p-3 border-b">
                                    <p className="font-semibold">{activity.title || 'ไม่ทราบหัวข้อ'}</p>
                                    <p className="text-sm text-gray-500">
                                        {activity.date ? new Date(activity.date).toLocaleDateString() : 'ไม่ทราบวันที่'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">ไม่มีกิจกรรมล่าสุด</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}


export default Dashboard;