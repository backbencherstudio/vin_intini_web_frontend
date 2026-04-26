
export default function layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid grid-rows-[auto_1fr] pt-6 pb-10 sm:pt-8 sm:pb-14 md:pt-10 md:pb-16 lg:pt-12 lg:pb-20 space-y-4 sm:space-y-5 md:space-y-6">
            <div className="flex items-center gap-6">
                <button type="button">{"<-"} Back</button>
                <div>
                    Academia {">>"} Texas
                </div>
            </div>
            <div className="">
                {children}
            </div>
        </div>
    );
}
