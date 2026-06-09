import { supabase } from '../lib/supabase';
import type { AffiliateLink, Platform } from '../types/affiliate';

export type CreateLinkPayload = {
  original_url: string;
  affiliate_url?: string | null;
  platform: Platform;
  product_name?: string | null;
  category_id?: string | null;
  tags?: string[] | null;
  note?: string | null;

  product_url?: string | null;
  shop_name?: string | null;
  price?: string | null;
  sold?: string | null;
  commission_rate?: string | null;
  commission_amount?: string | null;
};

export async function getAffiliateLinks() {
  const { data, error } = await supabase
    .from('affiliate_links')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as AffiliateLink[];
}

export async function createAffiliateLink(payload: CreateLinkPayload) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!userData.user) throw new Error('User not logged in');

  const { error } = await supabase.from('affiliate_links').insert({
    ...payload,
    user_id: userData.user.id,
  });

  if (error) throw error;
}

export async function updateAffiliateLink(
  id: string,
  payload: Partial<CreateLinkPayload>,
) {
  const { error } = await supabase
    .from('affiliate_links')
    .update(payload)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteAffiliateLink(id: string) {
  const { error } = await supabase
    .from('affiliate_links')
    .delete()
    .eq('id', id);

  if (error) throw error;
}