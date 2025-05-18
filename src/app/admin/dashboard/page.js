import Index from "@/components/dashboard";
import Sidebar from "@/components/sidebar";

const Dashboard = () => {

    return (
        <div className="flex flex-row">

            <div className="fixed top-0">
                <Sidebar />
            </div>
            <div className="ms-56 w-full p-5">
                <Index />
            </div>
        </div>
    );
}


export default Dashboard;