import { supabase } from '../lib/supabase';

export async function uploadProductImage(file: File) {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error('User not logged in');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}