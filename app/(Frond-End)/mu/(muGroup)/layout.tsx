export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="h-full w-full grid">
        <div className="">
          <div className="col-span-8 h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
