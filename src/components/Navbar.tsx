import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import logo from "@/assets/autobargain-logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-12 md:h-16">
          {/* Mobile: Menu on left, Logo on right */}
          <div className="flex items-center md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] bg-background">
                <div className="flex flex-col gap-4 mt-8">
                  <Button 
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleNavigation("/")}
                  >
                    Home
                  </Button>
                  <Button 
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleNavigation("/listings")}
                  >
                    Browse Cars
                  </Button>
                  <Button 
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleNavigation("/my-listings")}
                  >
                    My Listings
                  </Button>
                  <Button 
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleNavigation("/add-listing")}
                  >
                    Sell Car
                  </Button>
                  <Button 
                    className="justify-start"
                    onClick={() => {
                      if (user) {
                        signOut().then(() => {
                          navigate("/");
                          setMobileMenuOpen(false);
                        });
                      } else {
                        handleNavigation("/signin");
                      }
                    }}
                  >
                    {user ? "Sign Out" : "Sign In"}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop: Logo on left */}
          <div 
            className="hidden md:flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="AutoBargain" className="h-12" />
          </div>

          {/* Mobile: Logo on right */}
          <div 
            className="flex md:hidden items-center cursor-pointer ml-auto"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="AutoBargain" className="h-8" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <Button 
              variant="ghost"
              onClick={() => navigate("/listings")}
            >
              Browse
            </Button>
            <Button 
              variant="ghost"
              onClick={() => navigate("/my-listings")}
            >
              My Listings
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/add-listing")}
            >
              Sell
            </Button>
            <Button 
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