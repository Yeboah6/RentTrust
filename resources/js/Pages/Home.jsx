import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";
import HeroSearch from "../Components/Home/HeroSearch";
import FeaturedListings from "../Components/Home/FeaturedListings";
import PopularAreas from "../Components/Home/PopularAreas";
import RentCalculator from "../Components/Home/RentCalculator";
import TrustFeatures from "../Components/Home/TrustFeatures";
import CTASection from "../Components/Home/CTASection";
import NewsletterSection from "../Components/Home/NewsletterSection";
import { Head } from '@inertiajs/react';

const Home = ({ verifiedRentals, verifiedSales, rentalAreas, saleAreas, totalListings, totalAreas, totalVerifiedAgents, users }) => {
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
        <FeaturedListings verifiedRentals={verifiedRentals} verifiedSales={verifiedSales} />
        <PopularAreas rentalAreas={rentalAreas} saleAreas={saleAreas} />
        <RentCalculator />
        <TrustFeatures />
        <CTASection />
        <NewsletterSection />
      </main>

      <Footer />
    </div>
    </>
  );
};

export default Home;
