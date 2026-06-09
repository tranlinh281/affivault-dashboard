// src/lib/linkDetector.ts

export type AffiliatePlatform =
  | 'shopee'
  | 'lazada'
  | 'tiktok_shop'
  | 'tiki'
  | 'unknown';

export function detectPlatform(url: string): AffiliatePlatform {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('shopee') || lowerUrl.includes('shopee.vn')) {
    return 'shopee';
  }

  if (lowerUrl.includes('lazada.vn') || lowerUrl.includes('s.lazada.vn')) {
    return 'lazada';
  }

  if (
    lowerUrl.includes('tiktok.com') ||
    lowerUrl.includes('vt.tiktok.com') ||
    lowerUrl.includes('shop.tiktok.com')
  ) {
    return 'tiktok_shop';
  }

  if (lowerUrl.includes('tiki.vn')) {
    return 'tiki';
  }

  return 'unknown';
}