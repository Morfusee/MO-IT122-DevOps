import Sidebar from "./sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen grid grid-cols-[64px_1fr]">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
