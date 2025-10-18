import { Button } from "@/components/ui/button";
import logo from "@/assets/autobargain-logo.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-12 md:h-16">
          <div 
            className="flex items-center gap-1 md:gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Car className="w-4 h-4 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <span className="text-sm md:text-xl font-bold">AutoDeal</span>
          </div>

          <div className="flex items-center gap-1 md:gap-4">
            <Button 
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs md:h-10 md:px-4 md:text-sm"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs md:h-10 md:px-4 md:text-sm hidden sm:inline-flex"
              onClick={() => navigate("/listings")}
            >
              Browse
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs md:h-10 md:px-4 md:text-sm hidden sm:inline-flex"
              onClick={() => navigate("/my-listings")}
            >
              Listings
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs md:h-10 md:px-4 md:text-sm"
              onClick={() => navigate("/add-listing")}
            >
              Sell
            </Button>
            <Button 
              size="sm"
              className="h-7 px-2 text-xs md:h-10 md:px-4 md:text-sm"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;