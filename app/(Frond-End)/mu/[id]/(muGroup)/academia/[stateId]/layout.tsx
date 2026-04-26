export default function layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid grid-cols-[auto_1fr]">
            <div className="bg-gray-100 min-w-[200px] p-4">
                <h2>Sidebar</h2>
            </div>
            <div className="">
                {children}
            </div>
        </div>
    );
}
