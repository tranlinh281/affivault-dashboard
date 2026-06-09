import { supabase } from '../lib/supabase';
import type { Campaign } from '../types/affiliate';

export async function getCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Campaign[];
}

export async function createCampaign(payload: {
  name: string;
  description?: string | null;
}) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!userData.user) throw new Error('User not logged in');

  const { error } = await supabase.from('campaigns').insert({
    ...payload,
    user_id: userData.user.id,
  });

  if (error) throw error;
}

export async function deleteCampaign(id: string) {
  const { error } = await supabase.from('campaigns').delete().eq('id', id);

  if (error) throw error;
}