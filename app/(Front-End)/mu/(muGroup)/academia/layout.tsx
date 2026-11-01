import AcademiaLayout from "./_components/AvademiaLayout";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AcademiaLayout>
            {children}
        </AcademiaLayout>
    );
}
