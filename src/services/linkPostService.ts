import { supabase } from '../lib/supabase';
import type { LinkPost } from '../types/affiliate';

export async function getPostsByLinkId(linkId: string) {
  const { data, error } = await supabase
    .from('link_posts')
    .select('*')
    .eq('link_id', linkId)
    .order('posted_at', { ascending: false });

  if (error) throw error;
  return data as LinkPost[];
}

export async function createLinkPost(payload: {
  link_id: string;
  platform: string;
  content?: string | null;
}) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!userData.user) throw new Error('User not logged in');

  const { error } = await supabase.from('link_posts').insert({
    ...payload,
    user_id: userData.user.id,
  });

  if (error) throw error;

  await supabase
    .from('affiliate_links')
    .update({ status: 'posted' })
    .eq('id', payload.link_id);
}

export async function deleteLinkPost(id: string) {
  const { error } = await supabase.from('link_posts').delete().eq('id', id);

  if (error) throw error;
}