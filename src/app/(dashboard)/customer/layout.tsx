import { Header, Footer } from "@/components/shared";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

