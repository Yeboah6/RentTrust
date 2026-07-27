import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";
import HeroSearch from "../Components/Home/HeroSearch";
import FeaturedListings from "../Components/Home/FeaturedListings";
import PopularAreas from "../Components/Home/PopularAreas";
import RentCalculator from "../Components/Home/RentCalculator";
import TrustFeatures from "../Components/Home/TrustFeatures";
import CTASection from "../Components/Home/CTASection";
import { Head } from '@inertiajs/react';

const Home = ({ featuredRentals, featuredSales, rentalAreas, saleAreas, totalListings, totalAreas, totalVerifiedAgents, users }) => {
  return (
    <>
    <Head>
        <title>
            RentTrustGh | Find Your Perfect Home for Rent or Sale in Ghana
        </title>

        <meta
            name="description"
            content="Find verified houses, apartments, offices, shops, and land for rent or sale across Ghana. Browse trusted listings from landlords and agents on RentTrustGh."
        />

        <meta
            name="keywords"
            content="RentTrustGh, Ghana property, apartments for rent, houses for rent, houses for sale, real estate Ghana, Accra apartments, Tema rentals, Kumasi houses"
        />
    </Head>
    
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
    </>
  );
};

export default Home;
