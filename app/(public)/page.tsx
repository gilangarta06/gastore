// app/(public)/page.tsx
import SectionHero from "@/components/public/sectionhero";
import ProductGrid from "@/components/public/productgird";
import FAQ from "@/components/public/faq";
import Payment from "@/components/public/payment";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with gradient background */}
      <div className="relative overflow-hidden">
        {/* Gradient overlay for dark mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 pointer-events-none" />
        <SectionHero />
      </div>
      
      {/* Product Section with glass effect cards */}
        <section className="py-12 md:py-16 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Produk Terbaik Kami
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Temukan koleksi produk berkualitas dengan harga terbaik
            </p>
          </div>
          <ProductGrid />
        </div>
      </section>
      
      {/* FAQ Section with subtle background */}
      <section className="py-20 bg-muted/30">
        <FAQ />
      </section>
      
      {/* Payment Section */}
      <section className="py-20">
        <Payment />
      </section>
    </div>
  );
}