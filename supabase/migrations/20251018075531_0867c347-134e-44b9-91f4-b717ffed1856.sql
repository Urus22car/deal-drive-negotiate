-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create car_listings table
CREATE TABLE public.car_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER,
  location TEXT,
  transmission TEXT,
  fuel TEXT,
  features TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'negotiating', 'sold')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on car_listings
ALTER TABLE public.car_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for car_listings
CREATE POLICY "Anyone can view available car listings"
  ON public.car_listings FOR SELECT
  USING (status = 'available' OR status = 'negotiating');

CREATE POLICY "Users can view their own listings"
  ON public.car_listings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own listings"
  ON public.car_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
  ON public.car_listings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
  ON public.car_listings FOR DELETE
  USING (auth.uid() = user_id);

-- Create car_images table
CREATE TABLE public.car_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES public.car_listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on car_images
ALTER TABLE public.car_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for car_images
CREATE POLICY "Anyone can view car images"
  ON public.car_images FOR SELECT
  USING (true);

CREATE POLICY "Users can upload images for their listings"
  ON public.car_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.car_listings
      WHERE id = car_images.car_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images from their listings"
  ON public.car_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.car_listings
      WHERE id = car_images.car_id AND user_id = auth.uid()
    )
  );

-- Create offers table
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES public.car_listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  message TEXT,
  type TEXT NOT NULL CHECK (type IN ('buyer', 'seller')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'countered')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on offers
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for offers
CREATE POLICY "Buyers can view their own offers"
  ON public.offers FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view offers for their listings"
  ON public.offers FOR SELECT
  USING (auth.uid() = seller_id);

CREATE POLICY "Buyers can create offers"
  ON public.offers FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can create counter offers"
  ON public.offers FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Buyers can update their offers"
  ON public.offers FOR UPDATE
  USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update offers for their listings"
  ON public.offers FOR UPDATE
  USING (auth.uid() = seller_id);

-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for car images
CREATE POLICY "Anyone can view car images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can upload car images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'car-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own car images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'car-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own car images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'car-images' AND auth.uid() IS NOT NULL);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_car_listings_updated_at
  BEFORE UPDATE ON public.car_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to automatically create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.phone, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();