import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const AddListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    year: "",
    mileage: "",
    location: "",
    description: "",
    features: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.price || !formData.year) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Listing created successfully!");
    navigate("/my-listings");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/my-listings")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to my listings
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2">List Your Car</h1>
          <p className="text-muted-foreground mb-8">
            Fill in the details to create your listing
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Car Images */}
            <div>
              <Label htmlFor="images">Car Images *</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 10MB (Max 8 images)
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Car Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., 2021 BMW 3 Series"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Asking Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="35000"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className="pl-7"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2021"
                  value={formData.year}
                  onChange={(e) => handleChange("year", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="mileage">Kilometer</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="25000"
                  value={formData.mileage}
                  onChange={(e) => handleChange("mileage", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Los Angeles, CA"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your car's condition, history, and any special features..."
                rows={5}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* Features */}
            <div>
              <Label htmlFor="features">Features (comma separated)</Label>
              <Input
                id="features"
                placeholder="Leather Seats, Sunroof, Navigation, Backup Camera"
                value={formData.features}
                onChange={(e) => handleChange("features", e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate each feature with a comma
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate("/my-listings")}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" size="lg">
                Create Listing
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddListing;
