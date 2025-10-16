import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Gauge, Calendar, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const SellerCarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [counterOffer, setCounterOffer] = useState("");
  const [offers, setOffers] = useState([
    { id: 1, amount: 33000, buyerName: "John D.", status: "declined", timestamp: "2 hours ago" },
    { id: 2, amount: 34000, buyerName: "Sarah M.", status: "pending", timestamp: "1 hour ago" },
    { id: 3, amount: 34500, buyerName: "Mike R.", status: "pending", timestamp: "30 min ago" }
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

  const handleAcceptOffer = (offerId: number, amount: number) => {
    setOffers(offers.map(offer => 
      offer.id === offerId ? { ...offer, status: "accepted" } : offer
    ));
    toast.success(`Offer of $${amount.toLocaleString()} accepted!`);
  };

  const handleDeclineOffer = (offerId: number) => {
    setOffers(offers.map(offer => 
      offer.id === offerId ? { ...offer, status: "declined" } : offer
    ));
    toast.success("Offer declined");
  };

  const handleCounterOffer = (offerId: number) => {
    if (!counterOffer || parseFloat(counterOffer) <= 0) {
      toast.error("Please enter a valid counter offer amount");
      return;
    }
    
    toast.success(`Counter offer of $${parseFloat(counterOffer).toLocaleString()} sent!`);
    setCounterOffer("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/my-listings")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to my listings
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Car Details */}
          <div>
            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src={carDetails.image} 
                alt={carDetails.title}
                className="w-full h-96 object-cover"
              />
            </div>

            <Card className="p-6">
              <h1 className="text-3xl font-bold mb-4">{carDetails.title}</h1>
              <p className="text-4xl font-bold text-primary mb-6">
                ${carDetails.price.toLocaleString()}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{carDetails.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Gauge className="w-5 h-5 mr-2" />
                  <span>{carDetails.mileage.toLocaleString()} miles</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{carDetails.year}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground">{carDetails.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {carDetails.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">{feature}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Offers Management */}
          <div>
            <Card className="p-6 sticky top-8">
              <div className="flex items-center mb-6">
                <MessageSquare className="w-6 h-6 mr-2 text-primary" />
                <h2 className="text-2xl font-bold">Buyer Offers</h2>
              </div>

              <div className="space-y-4">
                {offers.map((offer) => (
                  <Card 
                    key={offer.id}
                    className={`p-4 ${
                      offer.status === "pending" 
                        ? "border-2 border-primary" 
                        : "opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          ${offer.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          from {offer.buyerName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {offer.timestamp}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          offer.status === "accepted" ? "default" :
                          offer.status === "pending" ? "secondary" : 
                          "outline"
                        }
                      >
                        {offer.status}
                      </Badge>
                    </div>

                    {offer.status === "pending" && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleAcceptOffer(offer.id, offer.amount)}
                          >
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleDeclineOffer(offer.id)}
                          >
                            Decline
                          </Button>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <label className="block text-xs font-medium mb-1">Counter Offer</label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                              <Input 
                                type="number"
                                placeholder="Amount"
                                value={counterOffer}
                                onChange={(e) => setCounterOffer(e.target.value)}
                                className="pl-6 h-8 text-sm"
                              />
                            </div>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => handleCounterOffer(offer.id)}
                            >
                              Send
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}

                {offers.filter(o => o.status === "pending").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No pending offers at the moment</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerCarDetail;
