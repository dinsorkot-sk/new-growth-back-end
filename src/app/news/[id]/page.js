import Sidebar from "@/components/sidebar";

export const metadata = {
    title: "News",
    description: "โครงการผลิตบัณฑิตพันธ์ใหม่",
};

const page = async ({ params }) => {
    const { id } = await params;
    return (
        <div className="flex flex-row h-screen relative">
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>
            <h1>News {id}</h1>
        </div>
    )
}

export default page;