//app/(public)/layout.tsx
import Navbar from "@/components/public/navbar";
import Footer from "@/components/public/footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Navbar />
      <main className="flex-grow mt-16 bg-white dark:bg-black">
        {children}
      </main>
      <Footer />
    </div>
  );
}
