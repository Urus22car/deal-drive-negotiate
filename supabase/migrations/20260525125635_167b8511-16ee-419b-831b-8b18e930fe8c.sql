
-- 1. Profiles: restrict public read access
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users with accepted offers can view counterparty profile"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND auth.uid() <> id
  AND public.has_accepted_offer_with(auth.uid(), id)
);

-- 2. Storage: enforce folder-based ownership on car-images
DROP POLICY IF EXISTS "Users can upload their own car images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own car images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own car images" ON storage.objects;

CREATE POLICY "Users can upload car images to their folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'car-images'
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own car images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'car-images'
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own car images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'car-images'
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Server-side validation via CHECK constraints
ALTER TABLE public.car_listings
  ADD CONSTRAINT car_listings_price_check CHECK (price >= 0 AND price <= 100000000),
  ADD CONSTRAINT car_listings_year_check CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE)::int + 2),
  ADD CONSTRAINT car_listings_mileage_check CHECK (mileage IS NULL OR (mileage >= 0 AND mileage <= 2000000)),
  ADD CONSTRAINT car_listings_title_check CHECK (char_length(title) BETWEEN 1 AND 200),
  ADD CONSTRAINT car_listings_description_check CHECK (description IS NULL OR char_length(description) <= 5000),
  ADD CONSTRAINT car_listings_location_check CHECK (location IS NULL OR char_length(location) <= 200),
  ADD CONSTRAINT car_listings_features_check CHECK (features IS NULL OR char_length(features) <= 2000);

ALTER TABLE public.offers
  ADD CONSTRAINT offers_amount_check CHECK (amount >= 0 AND amount <= 100000000),
  ADD CONSTRAINT offers_message_check CHECK (message IS NULL OR char_length(message) <= 1000);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_name_check CHECK (char_length(name) <= 100),
  ADD CONSTRAINT profiles_phone_check CHECK (char_length(phone) <= 20);

-- 4. Harden handle_new_user with input validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_name TEXT;
  user_phone TEXT;
BEGIN
  user_name := TRIM(COALESCE(NEW.raw_user_meta_data->>'name', ''));
  user_phone := TRIM(COALESCE(NEW.phone, ''));

  IF char_length(user_name) > 100 THEN
    user_name := substring(user_name from 1 for 100);
  END IF;

  IF char_length(user_phone) > 20 THEN
    user_phone := substring(user_phone from 1 for 20);
  END IF;

  INSERT INTO public.profiles (id, phone, name)
  VALUES (NEW.id, user_phone, user_name);

  RETURN NEW;
END;
$function$;
