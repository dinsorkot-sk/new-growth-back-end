"use client"; // ถ้าคุณใช้ App Router

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "จัดการหลักสูตร", href: "/courses" },
        { name: "ข่าวสาร & กิจกรรม", href: "/news" },
        { name: "กระทู้คำถาม", href: "/forum" },
        { name: "คลังรูปภาพ", href: "/gallery" },
        { name: "คลังความรู้ออนไลน์", href: "/knowledge" },
        { name: "ออกจากระบบ", href: "/logout" },
    ];

    return (
        <div className="sidebar bg-[#1A1F36] text-white w-56 h-screen flex flex-col">
            <div className="bg-[#26A65B] py-5 px-1">
                <div className="text-center">โครงการผลิตบัณฑิตพันธ์ใหม่</div>
            </div>
            <ul className="flex-1">
                {menuItems.slice(0, -1).map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <li key={index}>
                            <Link href={item.href}>
                                <div
                                    className={`cursor-pointer border-b-1 border-[#2C3352] p-3 
                                    ${isActive ? "bg-[#2C3352] border-l-4 border-[#26A65B]" : "hover:bg-[#2C3352] hover:border-l-4 hover:border-[#26A65B]"}
                                    `}
                                >
                                    {item.name}
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <ul>
                <li>
                    <Link href="/logout">
                        <div
                            className={`cursor-pointer border-b-1 border-[#2C3352] p-3 mt-auto 
                            ${pathname === "/logout" ? "bg-[#2C3352] border-l-4 border-[#26A65B]" : "hover:bg-[#2C3352] hover:border-l-4 hover:border-[#26A65B]"}
                            `}
                        >
                            ออกจากระบบ
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
