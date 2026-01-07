import { Building2, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-foreground">RentWise</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/search" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Search Rentals
          </Link>
          <Link to="/agents" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Agent Reviews
          </Link>
          <Link to="/areas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Area Insights
          </Link>
          <Link to="/landlords" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            For Landlords
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm">
            <User className="h-4 w-4 mr-2" />
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container py-4 flex flex-col gap-3">
            <Link to="/search" className="text-sm font-medium text-muted-foreground hover:text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>
              Search Rentals
            </Link>
            <Link to="/agents" className="text-sm font-medium text-muted-foreground hover:text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>
              Agent Reviews
            </Link>
            <Link to="/areas" className="text-sm font-medium text-muted-foreground hover:text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>
              Area Insights
            </Link>
            <Link to="/landlords" className="text-sm font-medium text-muted-foreground hover:text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>
              For Landlords
            </Link>
            <div className="flex gap-3 pt-3 border-t border-border">
              <Button variant="ghost" size="sm" className="flex-1">
                Sign In
              </Button>
              <Button size="sm" className="flex-1">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
