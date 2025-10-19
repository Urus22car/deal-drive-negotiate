import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Gauge, Calendar, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import AuthDialog from "@/components/AuthDialog";

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offerAmount, setOfferAmount] = useState("");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const isAuthenticated = false; // TODO: Replace with actual auth check
  const [offers, setOffers] = useState([
    { id: 1, amount: 33000, type: "buyer", status: "declined", message: "Initial offer" },
    { id: 2, amount: 34500, type: "seller", status: "pending", message: "Counter offer" }
  ]);

  const carDetails = {
    id: 1,
    title: "2021 BMW 3 Series",
    price: 35000,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    location: "Los Angeles, CA",
    mileage: 25000,
    year: 2021,
    description: "Beautiful BMW 3 Series in excellent condition. Single owner, well maintained with full service history.",
    features: ["Leather Seats", "Sunroof", "Navigation", "Backup Camera", "Bluetooth", "Heated Seats"]
  };

  const handleMakeOffer = () => {
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }

    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      toast.error("Please enter a valid offer amount");
      return;
    }
    
    const newOffer = {
      id: offers.length + 1,
      amount: parseFloat(offerAmount),
      type: "buyer",
      status: "pending",
      message: "Your offer"
    };
    
    setOffers([...offers, newOffer]);
    toast.success("Offer sent successfully!");
    setOfferAmount("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-4 md:py-8">
        <Button 
          variant="ghost" 
          size="sm"
          className="mb-4 md:mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to listings
        </Button>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
          {/* Left Column - Images & Details */}
          <div>
            <div className="rounded-lg overflow-hidden mb-4 md:mb-6">
              <img 
                src={carDetails.image} 
                alt={carDetails.title}
                className="w-full h-48 md:h-96 object-cover"
              />
            </div>

            <Card className="p-4 md:p-6 mb-4 md:mb-6">
              <h1 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">{carDetails.title}</h1>
              <p className="text-2xl md:text-4xl font-bold text-primary mb-4 md:mb-6">
                ₹{carDetails.price.toLocaleString()}
              </p>

              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="flex items-center text-sm md:text-base text-muted-foreground">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                  <span className="truncate">{carDetails.location}</span>
                </div>
                <div className="flex items-center text-sm md:text-base text-muted-foreground">
                  <Gauge className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                  <span>{carDetails.mileage.toLocaleString()} Km</span>
                </div>
                <div className="flex items-center text-sm md:text-base text-muted-foreground">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                  <span>{carDetails.year}</span>
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Description</h3>
                <p className="text-sm md:text-base text-muted-foreground">{carDetails.description}</p>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {carDetails.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">{feature}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Negotiation */}
          <div>
            <Card className="p-4 md:p-6 lg:sticky lg:top-8">
              <div className="flex items-center mb-4 md:mb-6">
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6 mr-2 text-primary flex-shrink-0" />
                <h2 className="text-lg md:text-2xl font-bold">Price Negotiation</h2>
              </div>

              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium mb-2">Your Offer</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input 
                      type="number"
                      placeholder="Enter amount"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      className="pl-7 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <Button 
                    onClick={handleMakeOffer} 
                    className="w-full sm:w-auto"
                  >
                    Make Offer
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4 md:pt-6">
                <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4">Negotiation History</h3>
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div 
                      key={offer.id}
                      className={`p-4 rounded-lg border-2 ${
                        offer.type === "buyer" 
                          ? "bg-primary/5 border-primary/20" 
                          : "bg-accent/5 border-accent/20"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">
                            ₹{offer.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">{offer.message}</p>
                        </div>
                        <Badge 
                          variant={offer.status === "pending" ? "default" : "secondary"}
                        >
                          {offer.status}
                        </Badge>
                      </div>
                      {offer.status === "pending" && offer.type === "seller" && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="flex-1">Accept</Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Counter
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
};

export default CarDetail;