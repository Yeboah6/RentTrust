import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";
import HeroSearch from "../Components/Home/HeroSearch";
import FeaturedListings from "../Components/Home/FeaturedListings";
import PopularAreas from "../Components/Home/PopularAreas";
import RentCalculator from "../Components/Home/RentCalculator";
import TrustFeatures from "../Components/Home/TrustFeatures";
import CTASection from "../Components/Home/CTASection";

const Home = () => {
  return (
    
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* <h1>Hello</h1> */}
         <HeroSearch />
        <FeaturedListings />
        <PopularAreas />
        <RentCalculator />
        <TrustFeatures />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
