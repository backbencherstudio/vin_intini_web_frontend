import Breadcrumb from "@/components/reusable/dashboard/BreadCumb";

export default function TopHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-[100] flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">

            <div className="flex items-center gap-3">
                <Breadcrumb />
            </div>

            {/* Right side */}
            <div>
                Notification / Profile
            </div>

        </header>
    );
}