// export default function Home() {
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//             <h1 className="text-4xl font-bold mb-4">Welcome to RentWise</h1>
//             <p className="text-lg text-gray-700">Your trusted platform for renting properties with ease.</p>
//         </div>
//     );
// }

import Header from "@/Components/Navigation/Header";
import HeroSearch from "@/Components/HeroSearch";
// import RentSummary from "@/components/RentSummary";
// import TopAgents from "@/components/TopAgents";
// import RecentReviews from "@/components/RecentReviews";
// import LandlordCTA from "@/components/LandlordCTA";
import Footer from "@/Components/Navigation/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSearch />
        {/* <RentSummary />
        <TopAgents />
        <RecentReviews />
        <LandlordCTA /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
