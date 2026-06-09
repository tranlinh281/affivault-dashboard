export type Platform = 'shopee' | 'lazada' | 'tiktok_shop' | 'tiki' | 'unknown';

export type LinkStatus = 'draft' | 'saved' | 'posted' | 'archived';

export type Category = {
  id: string;
  user_id: string;
  name: string;
  color?: string | null;
  created_at: string;
};

export type AffiliateLink = {
  id: string;
  user_id: string;
  original_url: string;
  affiliate_url?: string | null;
  product_url?: string | null;
  platform: Platform;
  product_name?: string | null;
  product_image?: string | null;
  category_id?: string | null;
  tags?: string[] | null;
  note?: string | null;
  status: LinkStatus;
  created_at: string;

  shop_name?: string | null;
  price?: string | null;
  sold?: string | null;
  commission_rate?: string | null;
  commission_amount?: string | null;
};

export type Campaign = {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  created_at: string;
};

export type LinkPost = {
  id: string;
  user_id: string;
  link_id: string;
  platform: string;
  content?: string | null;
  posted_at: string;
};