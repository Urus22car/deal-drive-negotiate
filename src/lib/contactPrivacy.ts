import { supabase } from "@/integrations/supabase/client";

export interface ProfileWithPrivacy {
  id: string;
  name: string;
  phone: string;
  contactVisible: boolean;
}

/**
 * Fetches a user profile with contact information conditionally visible
 * based on whether there's an accepted offer between current user and target user
 */
export async function getProfileWithPrivacy(
  targetUserId: string,
  currentUserId: string | undefined
): Promise<ProfileWithPrivacy | null> {
  if (!targetUserId) return null;

  // Fetch the profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, name, phone')
    .eq('id', targetUserId)
    .single();

  if (error || !profile) {
    console.error('Error fetching profile:', error);
    return null;
  }

  // If viewing own profile, always show contact info
  if (currentUserId === targetUserId) {
    return {
      ...profile,
      contactVisible: true
    };
  }

  // If not logged in, mask contact info
  if (!currentUserId) {
    return {
      ...profile,
      name: '****',
      phone: '**********',
      contactVisible: false
    };
  }

  // Check if there's an accepted offer between the users
  const { data: hasAcceptedOffer } = await supabase.rpc(
    'has_accepted_offer_with',
    {
      _user_id: currentUserId,
      _other_user_id: targetUserId
    }
  );

  // If there's an accepted offer, show full contact info
  if (hasAcceptedOffer) {
    return {
      ...profile,
      contactVisible: true
    };
  }

  // Otherwise, mask the contact information
  return {
    ...profile,
    name: 'Hidden until offer accepted',
    phone: 'Hidden until offer accepted',
    contactVisible: false
  };
}

/**
 * Masks contact information in a profile object
 */
export function maskContactInfo(profile: { name: string; phone: string }) {
  return {
    ...profile,
    name: 'Hidden until offer accepted',
    phone: 'Hidden until offer accepted'
  };
}
