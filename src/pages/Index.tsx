import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, TrendingUp, Shield, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AuthDialog from "@/components/AuthDialog";
import heroImage from "@/assets/hero-cars.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const isAuthenticated = false; // TODO: Replace with actual auth check

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/listings");
    }
  };

  const handleListYourCar = () => {
    if (isAuthenticated) {
      navigate("/add-listing");
    } else {
      setAuthDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect Car,
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Negotiate Your Price</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Buy or sell used cars with confidence. Make offers, counter-offers, and reach the perfect deal directly with sellers.
            </p>
            
            <div className="flex gap-3 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by make, model, or keyword..."
                  className="pl-10 h-14 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button 
                size="lg" 
                className="h-14 px-8"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/listings")}
              >
                Browse All Cars
              </Button>
              <Button size="lg" variant="outline" onClick={handleListYourCar}>
                List Your Car
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose AutoDeal?</h2>
            <p className="text-xl text-muted-foreground">The smarter way to buy and sell cars</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Direct Negotiation</h3>
              <p className="text-muted-foreground">
                Make offers and counter-offers in real-time. Reach the perfect price through transparent negotiation.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Secure Platform</h3>
              <p className="text-muted-foreground">
                Verified listings and secure transactions. Buy and sell with confidence and peace of mind.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Best Prices</h3>
              <p className="text-muted-foreground">
                No hidden fees or middlemen. Get the best deal through direct buyer-seller negotiation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/5 to-accent/5 border-2">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of buyers and sellers finding their perfect match on AutoDeal
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate("/listings")}
              >
                Start Shopping
              </Button>
              <Button size="lg" variant="outline" onClick={handleListYourCar}>
                List Your Car Free
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Disclaimer Footer */}
      <footer className="bg-muted/50 py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="font-semibold mb-2">Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              AutoDeal is a platform that connects buyers and sellers. We facilitate negotiations and communication between parties. 
              However, we are not responsible for any misconduct, fraudulent activity, or disputes that may occur during or after transactions. 
              Users are advised to exercise due diligence and verify all information before completing any purchase or sale.
            </p>
          </div>
        </div>
      </footer>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
};

export default Index;
