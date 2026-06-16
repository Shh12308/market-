import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewProducts from "@/components/home/NewProducts";
import TopSellers from "@/components/home/TopSellers";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <NewProducts />
        <TopSellers />
        <WhyChooseUs />
      </main>

      <Footer />
    </>
  );
}
