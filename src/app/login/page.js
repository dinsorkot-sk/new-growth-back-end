
export const metadata = {
    title: "ระบบจัดการหลังบ้าน",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};


const Login = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <div className='w-96 h-auto bg-[#1A1F36] rounded-2xl text-white overflow-hidden'>
                <div className='bg-[#26A65B] text-center p-8'>
                    <div>ระบบจัดการหลังบ้าน</div>
                    <div className='text-2xl'>โครงการผลิตบัณฑิตพันธ์ใหม่</div>
                </div>
                <div className='p-8'>
                    <form action={'/dashboard'} method='post'>
                        <div className='text-center'>เข้าสู่ระบบ</div>
                        <div>
                            <input type="text" className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#26A65B] focus:border-[#26A65B]' placeholder='ชื่อผู้ใช้' />
                        </div>
                        <div>
                            <input type="password" className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#26A65B] focus:border-[#26A65B]' placeholder='รหัสผ่าน' />
                        </div>
                        <div>
                            <button type="submit" className='mt-1 block w-full bg-[#26A65B] text-white font-bold py-2 px-4 rounded hover:bg-[#1A1F36] hover:text-[#26A65B] hover:border hover:border-[#26A65B]'>เข้าสู่ระบบ</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;