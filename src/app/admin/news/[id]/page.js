import Sidebar from "@/components/sidebar";
import Detail from "@/components/news/detail";
import axios from "axios";
import Cookies from "js-cookie";

export const metadata = {
    title: "News",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const page = async ({ params, searchParams }) => {
    const { id } = await params;
    const { mode } = await searchParams;

    // Fetch news data if id exists
    let news = null;
    if (id && id != "create") {
        try {
            const token = Cookies.get("auth-token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/news/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            news = response.data;
            console.log(news);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }

    return (
        <div className="flex flex-row h-screen relative">
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>
            <div className="w-full p-5 overflow-auto">
                <Detail news={news} mode={mode} />
            </div>
        </div>
    )
}

export default page;