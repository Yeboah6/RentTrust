import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";
import HeroSearch from "../Components/Home/HeroSearch";
import FeaturedListings from "../Components/Home/FeaturedListings";
import PopularAreas from "../Components/Home/PopularAreas";
import RentCalculator from "../Components/Home/RentCalculator";
import TrustFeatures from "../Components/Home/TrustFeatures";
import CTASection from "../Components/Home/CTASection";

const Home = ({ featuredRentals, featuredSales, rentalAreas, saleAreas, totalListings, totalAreas, totalVerifiedAgents, users }) => {
  return (
    
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <HeroSearch totalAreas={totalAreas} totalListings={totalListings} totalVerifiedAgents={totalVerifiedAgents} users={users} />
        <FeaturedListings featuredRentals={featuredRentals} featuredSales={featuredSales} />
        <PopularAreas rentalAreas={rentalAreas} saleAreas={saleAreas} />
        <RentCalculator />
        <TrustFeatures />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
