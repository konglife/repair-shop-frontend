export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <header>
        <h1>Repair Shop Dashboard</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
