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
                    {listing.bedrooms} Bedroom {listing.property_type} for {listing.purpose} in {listing.area} | RentTrustGh
                </title>

                <meta
                    name="description"
                    content={listing.meta_description}
                />

                <meta
                    property="og:title"
                    content={listing.title}
                />

                <meta
                    property="og:description"
                    content={listing.meta_description}
                />

                <meta
                    property="og:image"
                    content={listing.cover_image}
                />

                <link
                    rel="canonical"
                    href={`https://renttrustgh.com/${listing.purpose}/${listing.area_slug}/${listing.slug}`}
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
