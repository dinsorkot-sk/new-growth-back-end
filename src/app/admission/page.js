
import Sidebar from "@/components/sidebar";
import AdmissionDetail from "@/components/admission/AdmissionDetail";

export default function AdmissionPage() {
    return (
        <div className="flex flex-row min-h-screen bg-gray-50">
            <div className="fixed top-0">
                <Sidebar />
            </div>

            <div className="ms-56 w-full gap-5 p-5 flex flex-col">
                <AdmissionDetail />
            </div>
        </div>
    );
}
