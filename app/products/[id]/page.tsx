import ProductDetail from "@/components/public/productdetail";
import Navbar from "@/components/public/navbar";
import Footer from "@/components/public/footer";

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <ProductDetail />
      <Footer />
    </div>
  );
}