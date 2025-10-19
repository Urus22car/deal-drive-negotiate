import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import AuthDialog from "@/components/AuthDialog";

const AddListing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const isAuthenticated = false; // TODO: Replace with actual auth check
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    year: "",
    mileage: "",
    location: "",
    transmission: "",
    fuel: "",
    description: "",
    features: ""
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // Load existing data if editing
  useEffect(() => {
    if (isEditing) {
      // TODO: Load actual car data based on editId
      setFormData({
        title: "2021 BMW 3 Series",
        price: "35000",
        year: "2021",
        mileage: "25000",
        location: "Los Angeles, CA",
        transmission: "automatic",
        fuel: "petrol",
        description: "Beautiful BMW 3 Series in excellent condition.",
        features: "Leather Seats, Sunroof, Navigation"
      });
    }
  }, [isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }
    
    // Validation
    if (!formData.title || !formData.price || !formData.year) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success(isEditing ? "Listing updated successfully!" : "Listing created successfully!");
    navigate("/my-listings");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 8 - selectedImages.length);
      setSelectedImages(prev => [...prev, ...newImages]);
    }
  };

  const handleImageClick = () => {
    document.getElementById('image-upload')?.click();
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
          <h1 className="text-3xl font-bold mb-2">
            {isEditing ? "Edit Your Listing" : "List Your Car"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isEditing ? "Update your listing details" : "Fill in the details to create your listing"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Car Images */}
            <div>
              <Label htmlFor="images">Car Images *</Label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
              <div 
                onClick={handleImageClick}
                className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload multiple car images
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 10MB each (Upload up to 8 images)
                </p>
                {selectedImages.length > 0 && (
                  <p className="text-xs text-primary mt-2">
                    {selectedImages.length} image(s) selected
                  </p>
                )}
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
                <Label htmlFor="price">Asking Price (in ₹) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 500000 (5 Lakh)"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className="pl-7 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mileage">Kilometers Driven</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="e.g., 25000"
                  value={formData.mileage}
                  onChange={(e) => handleChange("mileage", e.target.value)}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Mumbai, Maharashtra"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="transmission">Transmission</Label>
                <Select value={formData.transmission} onValueChange={(value) => handleChange("transmission", value)}>
                  <SelectTrigger id="transmission">
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fuel">Fuel Type</Label>
                <Select value={formData.fuel} onValueChange={(value) => handleChange("fuel", value)}>
                  <SelectTrigger id="fuel">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="ev">EV</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
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
                {isEditing ? "Update Listing" : "Create Listing"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
};

export default AddListing;
