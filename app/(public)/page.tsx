// app/(public)/page.tsx
import SectionHero from "@/components/public/sectionhero";
import ProductGrid from "@/components/public/productgird";
import FAQ from "@/components/public/faq";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SectionHero />
      
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ProductGrid />
        </div>
      </section>
      
      <FAQ />
    </div>
  );
}