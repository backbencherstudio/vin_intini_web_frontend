export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className=" ">
        <div className="">
          <div className="col-span-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
