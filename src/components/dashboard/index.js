'use client';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  Book, 
  MessageCircle, 
  Calendar, 
  Users,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: {
          family: 'Kanit, sans-serif',
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        family: 'Kanit, sans-serif',
        size: 14
      },
      bodyFont: {
        family: 'Kanit, sans-serif',
        size: 12
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        font: {
          family: 'Kanit, sans-serif'
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: 'Kanit, sans-serif'
        }
      }
    }
  }
};

const Index = () => {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const baseURL = process.env.NEXT_PUBLIC_API || '';
        const response = await axios.get(`${baseURL}/dashboard`);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const coursesChartData = {
    labels: data?.courses?.map(c => c.name) || [],
    datasets: [{
      label: 'จำนวนผู้เรียน',
      data: data?.courses?.map(c => c.students || 0) || [],
      backgroundColor: 'rgba(43, 116, 209, 0.8)',
      borderColor: '#2B74D1',
      borderWidth: 1,
      borderRadius: 6
    }]
  };

  const messagesChartData = {
    labels: data?.courses?.map(c => c.name) || [],
    datasets: [{
      label: 'คะแนนความนิยม',
      data: data?.courses?.map(c => c.score || 0) || [],
      backgroundColor: 'rgba(37, 191, 140, 0.8)',
      borderColor: '#25BF8C',
      borderWidth: 1,
      borderRadius: 6
    }]
  };

  const monthlyUsersChartData = {
    labels: data?.monthlyUsers?.map(u => u.month) || [],
    datasets: [{
      label: 'ผู้ใช้งาน',
      data: data?.monthlyUsers?.map(u => u.count) || [],
      backgroundColor: 'rgba(43, 116, 209, 0.8)',
      borderColor: '#2B74D1',
      borderWidth: 1,
      borderRadius: 6
    }]
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-xl border border-red-200 shadow-lg">
          <div className="text-red-500 text-xl font-medium mb-2">เกิดข้อผิดพลาด</div>
          <div className="text-gray-700">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto"></div>
          <div className="mt-4 text-gray-600 text-lg">กำลังโหลดข้อมูล...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">แดชบอร์ดผู้ดูแลระบบ</h1>

      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Visitor Card */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-gray-500">ผู้เข้าใช้งาน</div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold my-3">{data.visitorCount?.toLocaleString() || 0}</div>
          <div className="flex gap-2 text-sm items-center">
            {data.visitorsComparison?.change > 0 ? (
              <span className="text-green-600 flex items-center">
                <TrendingUp size={16} className="mr-1" />
                {data.visitorsComparison.change}%
              </span>
            ) : (
              <span className="text-red-500 flex items-center">
                <TrendingDown size={16} className="mr-1" />
                {Math.abs(data.visitorsComparison?.change || 0)}%
              </span>
            )}
            <span className="text-gray-500">จากเดือนก่อน</span>
          </div>
        </div>

        {/* Course Card */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-gray-500">หลักสูตร</div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Book size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold my-3">{data.courseCount?.toLocaleString() || 0}</div>
          <Link href={'/admin/courses'}>
            <div className="text-green-600 text-sm cursor-pointer flex items-center">
              หลักสูตรทั้งหมด
              <ChevronRight size={16} className="ml-1" />
            </div>
          </Link>
        </div>

        {/* Messages Card */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-gray-500">ข้อความใหม่</div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <MessageCircle size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold my-3">{data.newMessages?.toLocaleString() || 0}</div>
          <Link href='#messages'>
            <div className="text-red-600 text-sm flex items-center">
              ข้อความวันนี้
              <ChevronRight size={16} className="ml-1" />
            </div>
          </Link>
        </div>

        {/* Activities Card */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-gray-500">กิจกรรม</div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Calendar size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold my-3">{data.newsCount?.toLocaleString() || 0}</div>
          <Link href={'/admin/news'}>
            <div className="text-blue-600 text-sm flex items-center">
              กิจกรรมทั้งหมด
              <ChevronRight size={16} className="ml-1" />
            </div>
          </Link>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">จำนวนผู้ใช้งานต่อเดือน</h3>
          <div className="h-64">
            <Bar data={monthlyUsersChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">หลักสูตรยอดนิยม</h3>
          <div className="h-64">
            <Bar data={messagesChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Messages and Activities Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ข้อความล่าสุด */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 id='messages' className="text-lg font-semibold text-gray-800">ข้อความล่าสุด</h3>
          </div>
          
          {data.latestMessages?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.latestMessages.map((msg, index) => (
                <div 
                  key={msg.id || msg.created_at || index} 
                  className="py-4 hover:bg-gray-50 px-2 rounded transition-colors cursor-pointer"
                  onClick={() => {
                    if (msg.type === 'forum') {
                      router.push(`/admin/forum?questionId=${msg.topic_id}#answer-${msg.id}`);
                    } else if (msg.type === 'course') {
                      router.push(`/admin/courses/${msg.course_id}`);
                    }
                  }}
                >
                  <p className="font-medium text-gray-800">
                    {(msg.answer_text || msg.comment || '').substring(0, 40)}...
                  </p>
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'ไม่ทราบวันที่'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <MessageCircle className="mx-auto mb-2 text-gray-400" size={32} />
              <p>ไม่มีข้อความล่าสุด</p>
            </div>
          )}
        </div>

        {/* กิจกรรมล่าสุด */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">กิจกรรมล่าสุด</h3>
            <button className="text-blue-600 hover:text-blue-800 transition-colors flex items-center text-sm font-medium cursor-pointer" onClick={() => router.push('/admin/news')}>
              ดูทั้งหมด
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          
          {data.latestActivities?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.latestActivities.map((activity, index) => (
                <div key={activity.id || activity.created_at || index} className="py-4 hover:bg-gray-50 px-2 rounded transition-colors cursor-pointer" onClick={() => router.push(`/admin/news/${activity.id}`)} >
                  <p className="font-medium text-gray-800">{activity.title || 'ไม่ทราบหัวข้อ'}</p>
                  <p className="text-sm text-gray-600 mt-1">{activity.short_description}</p>
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {activity.created_at ? new Date(activity.created_at).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'ไม่ทราบวันที่'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <Calendar className="mx-auto mb-2 text-gray-400" size={32} />
              <p>ไม่มีกิจกรรมล่าสุด</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Index;