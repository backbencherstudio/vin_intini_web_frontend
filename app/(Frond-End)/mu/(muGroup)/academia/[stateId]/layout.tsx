import Sidebar from "./_components/Sidebar";

export default function layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative grid lg:grid-cols-[auto_1fr] grid-rows-1 h-full min-h-0">
            <Sidebar />
            <div className="h-full grid">
                {children}
            </div>
        </div>
    );
}
