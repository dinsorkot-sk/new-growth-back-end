import Sidebar from "@/components/sidebar";
import Detail from "@/components/news/detail";

export const metadata = {
    title: "News",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const page = async ({ params, searchParams }) => {
    const { id } = await params;
    const { mode } = await searchParams;

    return (
        <div className="flex flex-row h-screen relative">
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>
            <div className="w-full p-5 overflow-auto">
                <Detail id={id} mode={mode} />
            </div>
        </div>
    )
}

export default page;