import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Gauge, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AuthDialog from "@/components/AuthDialog";

const mockCars = [
  {
    id: 1,
    title: "2021 BMW 3 Series",
    price: 35000,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    location: "Los Angeles, CA",
    mileage: 25000,
    year: 2021,
    status: "available"
  },
  {
    id: 2,
    title: "2020 Tesla Model 3",
    price: 42000,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
    location: "San Francisco, CA",
    mileage: 18000,
    year: 2020,
    status: "negotiating"
  },
  {
    id: 3,
    title: "2019 Mercedes C-Class",
    price: 38000,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
    location: "Miami, FL",
    mileage: 32000,
    year: 2019,
    status: "available"
  },
  {
    id: 4,
    title: "2022 Audi A4",
    price: 45000,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
    location: "New York, NY",
    mileage: 15000,
    year: 2022,
    status: "available"
  },
  {
    id: 5,
    title: "2020 Lexus ES",
    price: 40000,
    image: "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800",
    location: "Chicago, IL",
    mileage: 28000,
    year: 2020,
    status: "available"
  },
  {
    id: 6,
    title: "2021 Porsche Cayenne",
    price: 68000,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
    location: "Dallas, TX",
    mileage: 20000,
    year: 2021,
    status: "available"
  }
];

const Listings = () => {
  const navigate = useNavigate();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const isAuthenticated = false; // TODO: Replace with actual auth check

  const handleCarClick = (carId: number) => {
    if (isAuthenticated) {
      navigate(`/car/${carId}`);
    } else {
      setAuthDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Available Cars</h1>
          <p className="text-muted-foreground">Find your perfect car and start negotiating</p>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {mockCars.map((car) => (
            <Card 
              key={car.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => handleCarClick(car.id)}
            >
              <div className="relative overflow-hidden h-20 md:h-32">
                <img 
                  src={car.image} 
                  alt={car.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-2 right-2 md:top-4 md:right-4 bg-primary text-primary-foreground text-xs">
                  {car.status === "negotiating" ? "In Negotiation" : "Available"}
                </Badge>
              </div>
              
              <div className="p-2 md:p-6">
                <h3 className="text-sm md:text-xl font-semibold mb-1 md:mb-2">{car.title}</h3>
                <p className="text-lg md:text-3xl font-bold text-primary mb-2 md:mb-4">
                  ₹{car.price.toLocaleString()}
                </p>
                
                <div className="space-y-1 md:space-y-2 mb-2 md:mb-4">
                  <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    {car.location}
                  </div>
                  <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                    <Gauge className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    {car.mileage.toLocaleString()} Km
                  </div>
                  <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    {car.year}
                  </div>
                </div>

                <Button className="w-full text-xs md:text-sm" size="sm">
                  View Details & Make Offer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
};

export default Listings;