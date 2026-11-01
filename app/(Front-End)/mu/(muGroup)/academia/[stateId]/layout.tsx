import StateLayout from "./_components/StateLayout";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <StateLayout>
            {children}
        </StateLayout>
    );
}
