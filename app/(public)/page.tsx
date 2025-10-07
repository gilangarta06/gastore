//app/(public)/page.tsx
import SectionHero from "@/components/public/sectionhero";
import Productgird from "@/components/public/productgird";
import Faq from "@/components/public/faq"
// import Payment from "@/components/public/payment"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SectionHero />
      <Productgird />
      <Faq />
      {/* <Payment /> */}
    </div>
  );
}
