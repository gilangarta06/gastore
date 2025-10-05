import SectionHero from "@/components/public/sectionhero";
import Productlist from "@/components/public/productlist";
import Faq from "@/components/public/faq"
// import Payment from "@/components/public/payment"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SectionHero />
      <Productlist />
      <Faq />
      {/* <Payment /> */}
    </div>
  );
}
