import Nav from "@/components/nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full">
      <Nav />
      <div className="flex-grow overflow-y-auto xl:overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export const runtime = "edge";
