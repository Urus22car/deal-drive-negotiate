import { Button } from "@/components/ui/button";
import logo from "@/assets/autobargain-logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-12 md:h-16">
          <div 
            className="flex items-center gap-1 md:gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="AutoBargain" className="h-8 md:h-12" />
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
              onClick={() => user ? signOut().then(() => navigate("/")) : navigate("/signin")}
            >
              {user ? "Sign Out" : "Sign In"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;