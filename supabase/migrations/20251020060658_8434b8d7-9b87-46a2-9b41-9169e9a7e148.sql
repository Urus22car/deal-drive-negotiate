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

-- Drop all existing SELECT policies on profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles with contact restrictions" ON public.profiles;

-- Create new policy that allows viewing profiles but contact info is masked in application
CREATE POLICY "Public can view profiles"
ON public.profiles
FOR SELECT
USING (true);

-- Add comment to document the security model
COMMENT ON FUNCTION public.has_accepted_offer_with IS 
'Security definer function to check if two users have an accepted offer between them. Used for conditional contact information disclosure in application layer.';

COMMENT ON TABLE public.profiles IS 
'User profiles table. Phone and name fields should be masked in application layer unless viewer is the profile owner or has an accepted offer with the user.';