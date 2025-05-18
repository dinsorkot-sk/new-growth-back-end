"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios'; // เพิ่มการนำเข้า axios

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // สถานะสำหรับแสดงข้อผิดพลาด
    const router = useRouter();

    const handleSubmit = async (e) => { // เปลี่ยนเป็น async function
        e.preventDefault();
        setError(''); // รีเซ็ตข้อผิดพลาดเมื่อเริ่มฟอร์มใหม่

        try {
            // เรียก API โดยใช้ค่าจาก environment variable
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API}/login`, // ใช้ NEXT_PUBLIC_ เพื่อให้ client ใช้งานได้
                { username, password }
            );

            // เก็บ token ในคุกกี้ หมดอายุใน 7 วัน
            Cookies.set('auth-token', response.data.token, { expires: 7 });
            
            // เปลี่ยนเส้นทางไปหน้า dashboard
            router.push('/admin/dashboard');
        } catch (error) {
            // จัดการข้อผิดพลาดต่างๆ
            if (error.response) {
                // ข้อผิดพลาดจากเซิร์ฟเวอร์ (status code นอกช่วง 2xx)
                setError(error.response.data.message || 'เข้าสู่ระบบล้มเหลว');
            } else if (error.request) {
                // ไม่ได้รับคำตอบจากเซิร์ฟเวอร์
                setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
            } else {
                // ข้อผิดพลาดในการตั้งคำขอ
                setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
            }
        }
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <div className='w-96 h-auto bg-[#1A1F36] rounded-2xl text-white overflow-hidden'>
                <div className='bg-[#26A65B] text-center p-8'>
                    <div>ระบบจัดการหลังบ้าน</div>
                    <div className='text-2xl'>โครงการผลิตบัณฑิตพันธ์ใหม่</div>
                </div>
                <div className='p-8'>
                    <form onSubmit={handleSubmit}>
                        <div className='text-center'>เข้าสู่ระบบ</div>
                        
                        {/* แสดงข้อผิดพลาด */}
                        {error && (
                            <div className="mt-2 text-center text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className='mt-4'>
                            <input
                                type="text"
                                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#26A65B] focus:border-[#26A65B] text-white'
                                placeholder='ชื่อผู้ใช้'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className='mt-4'>
                            <input
                                type="password"
                                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#26A65B] focus:border-[#26A65B] text-white'
                                placeholder='รหัสผ่าน'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className='mt-6'>
                            <button
                                type="submit"
                                className='mt-1 block w-full bg-[#26A65B] text-white font-bold py-2 px-4 rounded hover:bg-[#1A1F36] hover:text-[#26A65B] hover:border hover:border-[#26A65B]'
                            >
                                เข้าสู่ระบบ
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;