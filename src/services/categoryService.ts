import { supabase } from '../lib/supabase';
import type { Category } from '../types/affiliate';

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Category[];
}

export async function createCategory(name: string, color?: string) {
  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase.from('categories').insert({
    name,
    color,
    user_id: userData.user?.id,
  });

  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}