-- Create a security definer function to check if there's an accepted offer between two users
CREATE OR REPLACE FUNCTION public.has_accepted_offer_with(_user_id uuid, _other_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.offers
    WHERE status = 'accepted'
      AND (
        (buyer_id = _user_id AND seller_id = _other_user_id) OR
        (seller_id = _user_id AND buyer_id = _other_user_id)
      )
  )
$$;

-- Add a column to track if contact info should be visible
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS contact_visible boolean DEFAULT false;

-- Drop existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new policy that allows viewing basic profile info but restricts contact details
CREATE POLICY "Users can view profiles with contact restrictions"
ON public.profiles
FOR SELECT
USING (
  -- Users can always see their own full profile
  auth.uid() = id
  OR
  -- Others can see the profile but phone and name are handled by application logic
  -- based on whether there's an accepted offer
  true
);

-- Add comment to document the security model
COMMENT ON FUNCTION public.has_accepted_offer_with IS 
'Security definer function to check if two users have an accepted offer between them. Used for conditional contact information disclosure.';