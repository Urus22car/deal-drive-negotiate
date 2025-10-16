import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Gauge, Calendar, MessageSquare, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const mockSellerCars = [
  {
    id: 1,
    title: "2021 BMW 3 Series",
    price: 35000,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    location: "Los Angeles, CA",
    mileage: 25000,
    year: 2021,
    status: "available",
    offers: 3,
    highestOffer: 34500
  },
  {
    id: 2,
    title: "2020 Tesla Model 3",
    price: 42000,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
    location: "San Francisco, CA",
    mileage: 18000,
    year: 2020,
    status: "negotiating",
    offers: 5,
    highestOffer: 41000
  }
];

const SellerListings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Listings</h1>
            <p className="text-muted-foreground">Manage your cars and view offers</p>
          </div>
          <Button 
            size="lg"
            onClick={() => navigate("/add-listing")}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Listing
          </Button>
        </div>

        {mockSellerCars.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-semibold mb-2">No Listings Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start selling your car by creating your first listing
              </p>
              <Button 
                size="lg"
                onClick={() => navigate("/add-listing")}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Listing
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {mockSellerCars.map((car) => (
              <Card 
                key={car.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative overflow-hidden h-32">
                  <img 
                    src={car.image} 
                    alt={car.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    {car.status === "negotiating" ? "Active Negotiations" : "Available"}
                  </Badge>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{car.title}</h3>
                  <p className="text-3xl font-bold text-primary mb-4">
                    ${car.price.toLocaleString()}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {car.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Gauge className="w-4 h-4 mr-2" />
                      {car.mileage.toLocaleString()} miles
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {car.year}
                    </div>
                  </div>

                  <div className="bg-accent/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-sm font-medium">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {car.offers} Offer{car.offers !== 1 ? 's' : ''}
                      </div>
                      {car.highestOffer && (
                        <div className="text-sm font-semibold text-accent-foreground">
                          Best: ${car.highestOffer.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => navigate(`/seller/car/${car.id}`)}
                    >
                      View Offers
                    </Button>
                    <Button variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerListings;
