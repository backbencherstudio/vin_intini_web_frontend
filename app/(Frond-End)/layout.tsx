export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className=" h-screen ">{children}</div>;
}
