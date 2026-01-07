import { Search, MapPin, DollarSign, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const HeroSearch = () => {
  return (
    <section className="relative overflow-hidden bg-hero-gradient py-20 md:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10 animate-slide-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-4 leading-tight">
            Find Your Perfect Rental
            <br />
            <span className="opacity-90">With Real Reviews</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mx-auto">
            Discover transparent rent prices, verified agent ratings, and honest tenant reviews before you sign.
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="bg-card rounded-2xl p-4 md:p-6 card-shadow-hover">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Location Input */}
              <div className="md:col-span-4 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Enter city or neighborhood"
                  className="pl-10 h-12 bg-secondary border-0"
                />
              </div>

              {/* Property Type */}
              <div className="md:col-span-3">
                <Select>
                  <SelectTrigger className="h-12 bg-secondary border-0">
                    <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rent Range */}
              <div className="md:col-span-3">
                <Select>
                  <SelectTrigger className="h-12 bg-secondary border-0">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Rent Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1000">$0 - $1,000</SelectItem>
                    <SelectItem value="1000-1500">$1,000 - $1,500</SelectItem>
                    <SelectItem value="1500-2000">$1,500 - $2,000</SelectItem>
                    <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
                    <SelectItem value="3000+">$3,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-2">
                <Button className="w-full h-12 text-base font-semibold">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {["Manhattan, NY", "Brooklyn, NY", "San Francisco, CA", "Austin, TX"].map((city) => (
                <button
                  key={city}
                  className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-3xl mx-auto mt-12 grid grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {[
            { value: "50K+", label: "Properties Listed" },
            { value: "120K+", label: "Verified Reviews" },
            { value: "8,500+", label: "Trusted Agents" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</div>
              <div className="text-sm text-primary-foreground/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
